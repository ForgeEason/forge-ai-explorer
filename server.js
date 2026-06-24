const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const publicDir = path.join(root, "public");
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "submissions.json");
const port = Number(process.env.PORT || 3000);
const adminPassword = process.env.ADMIN_PASSWORD || "ForgeInternal2026!";
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(24).toString("hex");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8"
};

const sessions = new Map();

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]\n", "utf8");
  }
}

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return Object.fromEntries(raw.split(";").map(item => {
    const [key, ...rest] = item.trim().split("=");
    return [key, decodeURIComponent(rest.join("=") || "")];
  }).filter(([key]) => key));
}

function isAdmin(req) {
  const token = parseCookies(req).forge_admin;
  const session = token && sessions.get(token);
  return Boolean(session && session.expires > Date.now());
}

function createSession() {
  const token = crypto.createHmac("sha256", sessionSecret)
    .update(`${Date.now()}:${Math.random()}`)
    .digest("hex");
  sessions.set(token, { expires: Date.now() + 1000 * 60 * 60 * 8 });
  return token;
}

function sanitizeSubmission(input) {
  const safe = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    userAgent: "",
    ipHint: "",
    bg: {},
    answers: {},
    report: {}
  };

  if (input && typeof input === "object") {
    safe.bg = typeof input.bg === "object" && input.bg ? input.bg : {};
    safe.answers = typeof input.answers === "object" && input.answers ? input.answers : {};
    safe.report = typeof input.report === "object" && input.report ? input.report : {};
  }

  return safe;
}

async function appendSubmission(submission) {
  await ensureDataFile();
  const current = JSON.parse(await fs.readFile(dataFile, "utf8"));
  current.push(submission);
  await fs.writeFile(dataFile, JSON.stringify(current, null, 2), "utf8");
}

async function serveStatic(req, res, pathname) {
  const requestPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, safePath);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

async function handleApi(req, res, url) {
  if (req.method === "POST" && url.pathname === "/api/submissions") {
    try {
      const body = JSON.parse(await readBody(req) || "{}");
      const submission = sanitizeSubmission(body);
      submission.userAgent = String(req.headers["user-agent"] || "").slice(0, 240);
      submission.ipHint = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].slice(0, 80);
      await appendSubmission(submission);
      json(res, 201, { ok: true, id: submission.id });
    } catch (error) {
      json(res, 400, { ok: false, message: "提交失败，请稍后重试。" });
    }
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/login") {
    const body = JSON.parse(await readBody(req) || "{}");
    if (body.password === adminPassword) {
      const token = createSession();
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": `forge_admin=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`,
        "Cache-Control": "no-store"
      });
      res.end(JSON.stringify({ ok: true }));
    } else {
      json(res, 401, { ok: false, message: "口令不正确。" });
    }
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/logout") {
    const token = parseCookies(req).forge_admin;
    if (token) sessions.delete(token);
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": "forge_admin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
      "Cache-Control": "no-store"
    });
    res.end(JSON.stringify({ ok: true }));
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/submissions") {
    if (!isAdmin(req)) {
      json(res, 401, { ok: false, message: "需要内部登录。" });
      return true;
    }
    await ensureDataFile();
    const list = JSON.parse(await fs.readFile(dataFile, "utf8"));
    json(res, 200, { ok: true, submissions: list.reverse() });
    return true;
  }

  return false;
}

async function main() {
  await ensureDataFile();
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      if (await handleApi(req, res, url)) return;
    }
    if (url.pathname === "/admin") {
      await serveStatic(req, res, "/admin.html");
      return;
    }
    await serveStatic(req, res, url.pathname);
  });

  server.listen(port, () => {
    console.log(`Forge AI Explorer running at http://127.0.0.1:${port}`);
  });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
