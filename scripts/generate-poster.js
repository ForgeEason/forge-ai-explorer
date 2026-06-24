const fs = require("fs/promises");
const path = require("path");
const QRCode = require("qrcode");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "assets");
const publicUrl = process.env.PUBLIC_URL || "http://127.0.0.1:3000/";

function esc(text) {
  return String(text).replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[s]));
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const qrSvgRaw = await QRCode.toString(publicUrl, {
    type: "svg",
    margin: 0,
    color: {
      dark: "#191614",
      light: "#f4efe6"
    }
  });
  const qrInner = qrSvgRaw
    .replace(/<\?xml[^>]*>/g, "")
    .replace(/<!DOCTYPE[^>]*>/g, "")
    .replace(/<svg[^>]*>/, "")
    .replace("</svg>", "");

  const poster = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1754" viewBox="0 0 1240 1754">
  <defs>
    <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f6efe4"/>
      <stop offset="0.55" stop-color="#e8ddcd"/>
      <stop offset="1" stop-color="#cfc0af"/>
    </linearGradient>
    <linearGradient id="ember" x1="0" x2="1">
      <stop offset="0" stop-color="#b96e3a"/>
      <stop offset="0.46" stop-color="#e25d2f"/>
      <stop offset="1" stop-color="#c9a45e"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="32" stdDeviation="34" flood-color="#191614" flood-opacity="0.24"/>
    </filter>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#191614" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1240" height="1754" fill="url(#paper)"/>
  <rect width="1240" height="1754" fill="url(#grid)"/>
  <path d="M0 0H1240V518C1003 466 802 472 638 537C442 615 304 787 0 835V0Z" fill="#191614"/>
  <path d="M0 0H1240V518C1003 466 802 472 638 537C442 615 304 787 0 835V0Z" fill="url(#grid)" opacity=".48"/>
  <circle cx="1002" cy="236" r="210" fill="none" stroke="#f4efe6" stroke-opacity=".14" stroke-width="1.5"/>
  <circle cx="1002" cy="236" r="134" fill="none" stroke="#e25d2f" stroke-opacity=".34" stroke-width="2"/>
  <circle cx="1002" cy="236" r="54" fill="#e25d2f" opacity=".38"/>
  <path d="M96 121H166L201 181L166 241H96L61 181L96 121Z" fill="none" stroke="#f4d8ab" stroke-width="4"/>
  <path d="M113 151H149L167 181L149 211H113L95 181L113 151Z" fill="none" stroke="#e25d2f" stroke-width="4"/>
  <text x="232" y="169" fill="#fff1dc" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="38" font-weight="800">FORGE AI</text>
  <text x="232" y="211" fill="#c9a45e" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="24" font-weight="700" letter-spacing="4">锻造训战营</text>

  <text x="80" y="424" fill="#fff1dc" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="88" font-weight="900">AI 实用力探索站</text>
  <text x="84" y="500" fill="#e7c08a" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="36" font-weight="700">找到你第一个能被 AI 帮上的真实场景</text>
  <rect x="82" y="562" width="496" height="4" fill="url(#ember)"/>

  <g filter="url(#softShadow)">
    <rect x="80" y="790" width="1080" height="548" fill="#f6efe4" stroke="#191614" stroke-opacity=".16"/>
    <rect x="116" y="826" width="548" height="476" fill="#191614"/>
    <rect x="116" y="826" width="548" height="476" fill="url(#grid)" opacity=".32"/>
    <text x="160" y="906" fill="#fff1dc" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="42" font-weight="850">不是考试，是一次起点定位</text>
    <text x="160" y="978" fill="#ccbda9" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="27">不考技术 / 不考英语 / 不贴标签</text>
    <text x="160" y="1044" fill="#ccbda9" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="27">5 分钟生成你的 AI 实用力画像</text>
    <text x="160" y="1110" fill="#ccbda9" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="27">给出适合你的第一个练习场景</text>
    <text x="160" y="1190" fill="#e7c08a" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="24" font-weight="700">Forge 内部同步生成诊断报告</text>
    <text x="160" y="1232" fill="#ccbda9" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="22">拥抱指数 / 未来深度 / 风险稳健 / 带教策略</text>

    <rect x="736" y="862" width="332" height="332" fill="#f4efe6" stroke="#191614" stroke-opacity=".18" stroke-width="12"/>
    <g transform="translate(766 892) scale(2.72)">
      ${qrInner}
    </g>
    <text x="902" y="1260" text-anchor="middle" fill="#191614" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="25" font-weight="800">扫码开始探索</text>
    <text x="902" y="1294" text-anchor="middle" fill="#746a60" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="17">${esc(publicUrl)}</text>
  </g>

  <text x="80" y="1472" fill="#191614" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="30" font-weight="800">Forge AI 锻造训战营</text>
  <text x="80" y="1522" fill="#746a60" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="23">用真实任务锻造 AI 实用力，把“听说过 AI”变成“真的用得上”。</text>
  <rect x="80" y="1582" width="1080" height="1.5" fill="#191614" opacity=".16"/>
  <text x="80" y="1646" fill="#746a60" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="19">请勿在测试中填写客户隐私、企业机密、身份证号、手机号、合同金额或未公开经营数据。</text>
</svg>`;

  await fs.writeFile(path.join(outDir, "forge-ai-explorer-qr.svg"), qrSvgRaw, "utf8");
  await fs.writeFile(path.join(outDir, "forge-ai-explorer-poster.svg"), poster, "utf8");
  console.log(`Generated poster for ${publicUrl}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
