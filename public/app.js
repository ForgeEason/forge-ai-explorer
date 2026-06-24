const app = document.querySelector("#app");

const state = {
  screen: "home",
  bg: {},
  answers: {},
  questionIndex: 0,
  consent: false,
  showInternal: false,
  submitted: false,
  submissionId: ""
};

const bgFields = [
  { id: "name", label: "昵称", type: "input", placeholder: "例如：小陈" },
  { id: "identity", label: "你现在更接近哪种状态？", options: ["企业员工", "管理者", "个体经营者", "自由职业者", "创业者", "学生", "待业/转型中", "全职照顾家庭", "退休/再就业探索", "暂时不确定"] },
  { id: "goal", label: "你最希望 AI 先帮你哪类事情？", options: ["提高工作效率", "找工作/转型", "做副业或自由接单", "写文案/做内容", "学习新知识", "整理资料和信息", "经营客户或社群", "家庭事务/生活规划", "做个人项目", "暂时不确定"] },
  { id: "task", label: "你平时最常遇到的任务是？", options: ["写东西", "查资料", "整理信息", "沟通回复", "做计划", "学习理解", "处理客户", "做内容发布", "经营产品/服务", "暂时说不清"] },
  { id: "frequency", label: "你现在使用 AI 的情况更接近？", options: ["从没用过", "偶尔试过", "每周会用", "几乎每天用"] },
  { id: "concern", label: "你现在对 AI 最大的顾虑是？", options: ["怕出错", "怕被替代", "没人教", "没时间", "觉得和自己关系不大", "不怕，只是还没开始"] },
  { id: "forgeHelp", label: "你更希望 Forge AI 锻造训战营怎么帮你？", options: ["从零带我上手", "给我真实案例照着练", "帮我解决自己的具体问题", "帮我建立固定流程", "帮我提高内容/经营/沟通效率", "暂时不确定，想先看看"] }
];

const questions = [
  {
    station: "第1站：认识 AI",
    dimension: "认知清晰度",
    id: "q1",
    text: "如果你让 AI 写了一份分析内容，看起来很专业，你通常会怎么处理？",
    options: [
      ["直接用，先省时间", 0],
      ["简单改改再用", 1],
      ["看关键事实、数据和结论是否靠谱，再决定怎么用", 3],
      ["不太敢用，怕它说错", 1]
    ]
  },
  {
    station: "第1站：认识 AI",
    dimension: "认知清晰度",
    id: "q2",
    text: "关于 AI 的回答，你更接近哪种看法？",
    options: [
      ["它说得通常都对", 0],
      ["它很有帮助，但重要内容还要自己判断", 3],
      ["它不太可靠，所以我一般不太敢用", 1],
      ["我还不太清楚该怎么判断", 1]
    ]
  },
  {
    station: "第1站：认识 AI",
    dimension: "认知清晰度",
    id: "q3",
    text: "你觉得 AI 现在更适合帮你做哪类事？",
    options: [
      ["替我做最终决定", 0],
      ["帮我起草、整理、改写、提炼思路", 3],
      ["直接给我权威结论", 1],
      ["像搜索工具一样帮我找答案", 1]
    ]
  },
  {
    station: "第2站：靠近 AI",
    dimension: "拥抱意愿",
    id: "q4",
    text: "听到别人已经开始用 AI 提效，你的第一反应更接近？",
    options: [
      ["有点焦虑，但想知道他怎么用", 2],
      ["觉得离我还比较远", 0],
      ["担心自己跟不上，所以不太想碰", 0],
      ["想马上试试能不能帮到我的事", 3]
    ]
  },
  {
    station: "第2站：靠近 AI",
    dimension: "拥抱意愿",
    id: "q5",
    text: "如果有一部分重复事情可以让 AI 先帮你处理，你会？",
    options: [
      ["愿意试，能省时间就好", 3],
      ["想试，但担心自己不会操作", 2],
      ["还是自己做更踏实", 1],
      ["感觉我的情况暂时用不上 AI", 0]
    ]
  },
  {
    station: "第2站：靠近 AI",
    dimension: "拥抱意愿",
    id: "q6",
    text: "遇到一个没用过的新工具，你通常会？",
    options: [
      ["先点一点，试试看", 3],
      ["等别人教我再用", 2],
      ["能不用就不用，怕弄错", 1],
      ["通常会先放一边，有需要再说", 1]
    ]
  },
  {
    station: "第3站：发现任务",
    dimension: "任务识别能力",
    id: "q7",
    text: "哪类事情最适合先尝试用 AI 辅助？",
    options: [
      ["替你做人生、经营或工作上的重大决定", 0],
      ["把会议、课程、聊天或资料整理成清单", 3],
      ["不检查就直接回复重要客户、雇主或合作方", 1],
      ["直接替你确认合同、法律或财务结论", 0]
    ]
  },
  {
    station: "第3站：发现任务",
    dimension: "任务识别能力",
    id: "q8",
    text: "当你对 AI 说“帮我把这件事弄好”，结果往往不好，可能是因为？",
    options: [
      ["可能是工具不适合这个任务", 1],
      ["事情没说清楚，AI 不知道要做到什么程度", 3],
      ["可能需要换一个更贵的 AI", 0],
      ["这类事情本来就完全不能用 AI", 0]
    ]
  },
  {
    station: "第3站：发现任务",
    dimension: "任务识别能力",
    id: "q9",
    text: "想让 AI 真正帮上忙，哪种做法更合适？",
    options: [
      ["找出重复、繁琐、有套路的部分先试", 3],
      ["把最难拍板的决定直接交给它", 0],
      ["所有小事都问它，先用起来再说", 1],
      ["等它能完全替代我再开始用", 0]
    ]
  },
  {
    station: "第4站：说清需求",
    dimension: "表达与提问能力",
    id: "q10",
    text: "你想让 AI 帮你写一段宣传文案，哪种说法更容易得到可用结果？",
    options: [
      ["帮我写个文案", 0],
      ["写得高级一点", 1],
      ["我面向的是新手用户，希望写一段自然、不硬广的宣传文案，突出名额有限，150字以内", 3],
      ["你随便发挥", 0]
    ]
  },
  {
    station: "第4站：说清需求",
    dimension: "表达与提问能力",
    id: "q11",
    text: "AI 第一次给的结果方向不对，你更可能怎么做？",
    options: [
      ["只说“不对，重写”", 1],
      ["换个工具重新问一遍", 1],
      ["告诉它哪里不对，补充背景或例子，再让它改", 3],
      ["先不用了，等以后再研究", 0]
    ]
  },
  {
    station: "第4站：说清需求",
    dimension: "表达与提问能力",
    id: "q12",
    text: "要让 AI 输出更接近你想要的内容，哪种信息最有帮助？",
    options: [
      ["给它一句“写好一点”", 0],
      ["说清楚给谁看、用在哪里、要什么格式和字数", 3],
      ["少说一点，让它自由发挥", 1],
      ["给个大概方向，让它自己理解", 0]
    ]
  },
  {
    station: "第5站：安全使用",
    dimension: "判断与安全意识",
    id: "q13",
    text: "哪种信息最不适合直接发给公开 AI 工具？",
    options: [
      ["已公开的产品介绍", 0],
      ["普通学习笔记", 0],
      ["客户身份证号、手机号、合同金额", 3],
      ["不含隐私的活动文案", 0]
    ]
  },
  {
    station: "第5站：安全使用",
    dimension: "判断与安全意识",
    id: "q14",
    text: "关于把个人或工作内容发给 AI，你更接近哪种看法？",
    options: [
      ["AI 是工具，发什么都没关系", 0],
      ["涉及客户隐私、个人隐私、公司机密、未公开数据时，要先脱敏或不发", 3],
      ["所有内容都完全不能用 AI 处理", 1],
      ["以前没太想过这个问题", 0]
    ]
  },
  {
    station: "第5站：安全使用",
    dimension: "判断与安全意识",
    id: "q15",
    text: "AI 给了你一个看起来很专业的法律、医疗、财务建议，你会？",
    options: [
      ["如果说得很专业，就先照着做", 0],
      ["先当参考，关键问题再找专业人士或官方渠道确认", 3],
      ["这类建议我完全不会看", 1],
      ["看起来有道理的话，可以先采用", 0]
    ]
  },
  {
    station: "第6站：持续变强",
    dimension: "学习迁移潜力",
    id: "q16",
    text: "第一次用 AI 生成的内容不满意，你通常会？",
    options: [
      ["觉得 AI 不太适合我，以后少用", 0],
      ["换个工具，但还是用差不多的问法", 1],
      ["补充背景、目标、风格或例子，再让它修改", 3],
      ["直接找别人帮忙更快", 1]
    ]
  },
  {
    station: "第6站：持续变强",
    dimension: "学习迁移潜力",
    id: "q17",
    text: "如果你发现一句特别好用的问法，你会？",
    options: [
      ["用完就忘，下次再说", 0],
      ["下次凭印象再试", 1],
      ["存下来，慢慢整理成自己的常用指令", 3],
      ["觉得能用一次就够了", 0]
    ]
  },
  {
    station: "第6站：持续变强",
    dimension: "学习迁移潜力",
    id: "q18",
    text: "看到别人用 AI 做出好结果，你会？",
    options: [
      ["觉得那是他行业或情况才用得上", 0],
      ["想想这个方法能不能搬到自己的事情里", 3],
      ["觉得挺厉害，但跟我关系不大", 0],
      ["等以后有空再研究", 1]
    ]
  }
];

const dimensionNames = ["认知清晰度", "拥抱意愿", "任务识别能力", "表达与提问能力", "判断与安全意识", "学习迁移潜力"];

const icon = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2.8 19.6 7v9.8L12 21.2 4.4 16.8V7L12 2.8Z" stroke="currentColor" stroke-width="1.6"/>
    <path d="M8.2 9.4 12 7.2l3.8 2.2v5.2L12 16.8l-3.8-2.2V9.4Z" stroke="currentColor" stroke-width="1.6"/>
    <path d="M12 7.2v9.6M4.8 7.2l7.2 4.2 7.2-4.2" stroke="currentColor" stroke-width="1.3"/>
  </svg>`;

function header() {
  return `
    <header class="topbar">
      <div class="brand">
        <div class="mark">${icon}</div>
        <div>
          <div class="brand-title">Forge AI 实用力探索站</div>
          <div class="brand-subtitle">锻造训战营 · 入营诊断原型</div>
        </div>
      </div>
      <div class="top-actions">
        <button class="ghost-btn" onclick="goHome()">首页</button>
        <button class="dark-btn" onclick="quickDemo()">快速看结果</button>
      </div>
    </header>`;
}

function render() {
  const content = state.screen === "home" ? home() :
    state.screen === "profile" ? profileForm() :
    state.screen === "quiz" ? quiz() :
    results();

  app.innerHTML = `<div class="shell">${header()}${content}<div class="footer-note">Forge AI 锻造训战营 · 科学诊断在后台，轻松探索在前台</div></div>`;
}

function home() {
  return `
    <section class="hero">
      <div>
        <div class="eyebrow">Forge AI 锻造训战营</div>
        <h1>找到你的 AI 实用力起点</h1>
        <p class="lead">不用懂技术，不考概念。5 分钟生成你的 AI 实用力画像，看看你最适合从哪件小事开始，让 AI 真正帮上忙。</p>
        <div class="hero-actions">
          <button class="primary-btn" onclick="state.screen='profile'; render()">开始探索</button>
          <button class="ghost-btn" onclick="quickDemo()">查看结果样例</button>
        </div>
        <div class="assurance">
          <div class="chip">不考技术</div>
          <div class="chip">不考英语</div>
          <div class="chip">不贴标签</div>
          <div class="chip">不要求用过 AI</div>
        </div>
      </div>
      <aside class="forge-visual" aria-label="Forge AI visual identity">
        <div class="ring"></div>
        <div class="steel-card">
          <h2>前台像探索，后台像诊断</h2>
          <p>学员看到的是起点、场景与行动建议；Forge 内部获得拥抱深度、风险稳健、带教策略和复测基线。</p>
          <div class="metrics-row">
            <div class="metric-mini"><strong>6</strong><span>核心维度</span></div>
            <div class="metric-mini"><strong>18</strong><span>探索题</span></div>
            <div class="metric-mini"><strong>7</strong><span>分钟内完成</span></div>
          </div>
        </div>
      </aside>
    </section>`;
}

function profileForm() {
  const fields = bgFields.map(field => {
    if (field.type === "input") {
      return `<div class="field"><label>${field.label}</label><input value="${state.bg[field.id] || ""}" placeholder="${field.placeholder}" oninput="state.bg.${field.id}=this.value"></div>`;
    }
    return `<div class="field"><label>${field.label}</label><select onchange="state.bg.${field.id}=this.value">
      <option value="">请选择</option>
      ${field.options.map(opt => `<option ${state.bg[field.id] === opt ? "selected" : ""}>${opt}</option>`).join("")}
    </select></div>`;
  }).join("");

  return `
    <section class="screen">
      <div class="panel">
        <div class="panel-inner">
          <div class="section-head">
            <div>
              <div class="eyebrow">Before the forge</div>
              <h2>先了解一点你的情况</h2>
              <p>这些信息不进入能力评分，只用于生成更贴近你的场景建议，以及 Forge 内部带教参考。</p>
            </div>
          </div>
          <div class="form-grid">${fields}</div>
          <div class="fineprint">请不要填写客户隐私、身份证号、手机号、合同金额、企业机密或未公开经营数据。信息仅用于生成个人报告、匹配训练营学习路径和内部带教参考。</div>
          <label class="consent"><input type="checkbox" ${state.consent ? "checked" : ""} onchange="state.consent=this.checked"> <span>我已了解，并同意生成个人 AI 实用力画像。</span></label>
          <div class="nav-row">
            <button class="ghost-btn" onclick="state.screen='home'; render()">返回</button>
            <button class="primary-btn" onclick="startQuiz()">进入 6 站探索</button>
          </div>
        </div>
      </div>
    </section>`;
}

function quiz() {
  const q = questions[state.questionIndex];
  const selected = state.answers[q.id]?.text;
  const progress = Math.round(((state.questionIndex + 1) / questions.length) * 100);
  return `
    <section class="screen">
      <div class="panel">
        <div class="panel-inner">
          <div class="section-head">
            <div>
              <div class="eyebrow">Forge exploration</div>
              <h2>请选择更接近你真实情况的一项</h2>
              <p>没有标准答案，也不会在页面上显示对错。你越真实，画像越有参考价值。</p>
            </div>
            <div class="progress-wrap">
              <div class="progress-label"><span>${q.station}</span><span>${progress}%</span></div>
              <div class="progress-track"><div class="progress-bar" style="width:${progress}%"></div></div>
            </div>
          </div>
          <div class="question-card">
            <div class="question-meta">
              <div class="station">${q.dimension}</div>
              <h2 class="question-title">${q.text}</h2>
              <p class="question-note">第 ${state.questionIndex + 1} / ${questions.length} 步。Forge 会在后台把选择转化为六维画像、拥抱指数和带教建议。</p>
            </div>
            <div>
              <div class="options">
                ${q.options.map((opt, i) => `<button class="option ${selected === opt[0] ? "selected" : ""}" onclick="answer('${q.id}', ${i})"><span class="option-key">${String.fromCharCode(65 + i)}</span><span>${opt[0]}</span></button>`).join("")}
              </div>
              <div class="nav-row">
                <button class="ghost-btn" onclick="prevQuestion()" ${state.questionIndex === 0 ? "disabled" : ""}>上一步</button>
                <button class="primary-btn" onclick="nextQuestion()">${state.questionIndex === questions.length - 1 ? "生成画像" : "继续"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

function results() {
  const report = buildReport();
  const scenario = scenarioFor(state.bg.identity, state.bg.goal, state.bg.task);
  return `
    <section class="screen">
      <div class="results-layout">
        <div>
          <div class="result-hero">
            <div class="result-badge">你的 Forge AI 实用力画像</div>
            <h2>${report.persona.name}</h2>
            <p>${report.persona.line}</p>
            <p>${report.persona.detail}</p>
          </div>
          <div class="cards">
            <div class="info-card">
              <h3>建议先练的真实场景</h3>
              <p>${scenario}</p>
            </div>
            <div class="info-card">
              <h3>Forge 推荐路径</h3>
              <p>${report.path}</p>
            </div>
            <div class="info-card">
              <h3>你的优势</h3>
              <p>${report.strength.name} 较突出。${report.strength.copy}</p>
            </div>
            <div class="info-card">
              <h3>下一步补强</h3>
              <p>${report.weakness.name} 是优先补强点。${report.weakness.copy}</p>
            </div>
            <div class="info-card">
              <h3>从明天开始的 7 个小练习</h3>
              <ul>
                <li>让 AI 总结一篇与你相关的文章。</li>
                <li>改写一段通知、文案或说明。</li>
                <li>列一个方案或学习提纲。</li>
                <li>整理一次会议、课程或聊天内容。</li>
                <li>模拟一次客户、同事、雇主或学员问答。</li>
                <li>把一个不满意的结果，通过补充背景改到能用。</li>
                <li>总结最适合你用 AI 帮忙的 3 类事情。</li>
              </ul>
            </div>
            <div class="info-card">
              <h3>安全提醒</h3>
              <p>AI 可以帮你提高效率，但不能替你承担专业责任。涉及法律、医疗、财务、合同、人事等重要事项，请以专业人士、公司制度或官方渠道为准。不要向公开 AI 工具输入个人隐私、客户隐私、企业机密和未公开数据。</p>
            </div>
          </div>
        </div>
        <aside class="radar-card">
          <h3>核心指标</h3>
          <div class="score">
            ${report.indices.slice(0, 2).map(item => `<div class="score-line"><div class="score-top"><span>${item.label}</span><span>${item.value}</span></div><div class="bar"><span style="width:${item.value}%"></span></div></div>`).join("")}
          </div>
          ${radar(report.dimensions)}
          <button class="dark-btn" style="width:100%; margin-top:14px" onclick="restart()">重新探索</button>
        </aside>
      </div>
    </section>`;
}

function startQuiz() {
  if (!state.consent) {
    alert("请先勾选同意生成个人 AI 实用力画像。");
    return;
  }
  state.screen = "quiz";
  state.questionIndex = 0;
  render();
}

function answer(id, optionIndex) {
  const q = questions.find(item => item.id === id);
  const [text, score] = q.options[optionIndex];
  state.answers[id] = { text, score, dimension: q.dimension };
  render();
}

function nextQuestion() {
  const q = questions[state.questionIndex];
  if (!state.answers[q.id]) {
    alert("请选择一个更接近你的选项。");
    return;
  }
  if (state.questionIndex === questions.length - 1) {
    state.screen = "results";
    submitCurrentReport();
  } else {
    state.questionIndex += 1;
  }
  render();
}

function prevQuestion() {
  if (state.questionIndex > 0) {
    state.questionIndex -= 1;
    render();
  }
}

function buildReport() {
  const sums = Object.fromEntries(dimensionNames.map(name => [name, { score: 0, count: 0 }]));
  questions.forEach(q => {
    const a = state.answers[q.id] || { score: 0 };
    sums[q.dimension].score += a.score;
    sums[q.dimension].count += 1;
  });
  const dimensions = dimensionNames.map(name => ({
    name,
    value: Math.round((sums[name].score / (sums[name].count * 3)) * 100)
  }));

  const by = name => dimensions.find(d => d.name === name).value;
  const readiness = avg(["认知清晰度", "任务识别能力", "表达与提问能力", "判断与安全意识"].map(by));
  const potential = avg(["拥抱意愿", "学习迁移潜力"].map(by));
  const trueEmbrace = Math.round(avg([by("拥抱意愿"), frequencyScore(), answerScore("q6"), answerScore("q16")]));
  const futureDepth = Math.round(avg([by("学习迁移潜力"), answerScore("q16"), answerScore("q17"), answerScore("q18")]));
  const risk = Math.round(avg([by("判断与安全意识"), answerScore("q1"), answerScore("q2")]));
  const scene = Math.round(avg([by("任务识别能力"), bgClarity(state.bg.goal), bgClarity(state.bg.task)]));
  const coaching = Math.round(avg([by("拥抱意愿"), concernScore(), helpScore()]));

  const total = Math.round(avg(dimensions.map(d => d.value)));
  const persona = personaFor(total);
  const sorted = [...dimensions].sort((a, b) => b.value - a.value);
  const quadrant = quadrantFor(readiness, futureDepth);

  return {
    persona,
    dimensions,
    strength: copyFor(sorted[0]),
    weakness: copyFor(sorted[sorted.length - 1]),
    path: pathFor(persona.name),
    indices: [
      { label: "当前准备度", value: readiness },
      { label: "成长潜力", value: potential },
      { label: "真实拥抱指数", value: trueEmbrace },
      { label: "未来拥抱深度", value: futureDepth },
      { label: "风险稳健指数", value: risk },
      { label: "场景落地指数", value: scene },
      { label: "带教响应指数", value: coaching }
    ],
    embraceType: embraceFor(trueEmbrace, state.bg.concern),
    depthType: depthFor(futureDepth),
    quadrant,
    coach: coachFor(quadrant, state.bg.concern)
  };
}

function avg(values) {
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function answerScore(id) {
  return Math.round(((state.answers[id]?.score || 0) / 3) * 100);
}

function frequencyScore() {
  return { "从没用过": 10, "偶尔试过": 38, "每周会用": 72, "几乎每天用": 92 }[state.bg.frequency] || 35;
}

function bgClarity(value) {
  return value && !value.includes("不确定") && !value.includes("说不清") ? 78 : 34;
}

function concernScore() {
  const map = { "不怕，只是还没开始": 82, "没人教": 68, "没时间": 58, "怕出错": 52, "怕被替代": 42, "觉得和自己关系不大": 30 };
  return map[state.bg.concern] || 48;
}

function helpScore() {
  return state.bg.forgeHelp && !state.bg.forgeHelp.includes("不确定") ? 76 : 42;
}

function personaFor(total) {
  if (total < 28) return {
    name: "AI 观察者",
    line: "你不是不会学 AI，而是还没遇到一个足够具体、足够低压力的入口。",
    detail: "第一步不需要复杂工具，也不需要学概念。先让 AI 帮你完成一个很小的真实任务，建立一次轻松的成功体验。"
  };
  if (total < 45) return {
    name: "AI 试水者",
    line: "你已经愿意靠近 AI，接下来要学的是怎么把需求说清楚。",
    detail: "你可能遇到过答得不准、不像自己想要的情况。下一步不是急着换工具，而是练会背景、目标、对象、格式和限制。"
  };
  if (total < 62) return {
    name: "AI 协作新手",
    line: "你已经能让 AI 帮上忙了，接下来要让它更稳定、更懂你。",
    detail: "你已经具备基本协作意识。接下来可以练习追问、修改、复用，把偶尔好用变成经常好用。"
  };
  if (total < 80) return {
    name: "AI 实战学徒",
    line: "你已经具备把 AI 放进真实场景的基础。",
    detail: "现在的重点不是了解更多概念，而是带着真实任务训练，把零散使用升级成稳定流程。"
  };
  return {
    name: "AI 潜力玩家",
    line: "你很适合成为 Forge 训战营里的 AI 实操标杆，但也要记得：越好用，越要会把关。",
    detail: "你已经有比较强的主动探索和迁移意识，下一步可以尝试个人工作流、多工具组合和案例复盘。"
  };
}

function pathFor(name) {
  if (name.includes("观察者")) return "破冰入门路径：建立信心，完成第一个 AI 小成功。";
  if (name.includes("试水者")) return "清晰表达路径：把需求说清楚，提高 AI 输出可用率。";
  if (name.includes("协作")) return "场景实操路径：把 AI 用进真实任务，形成可复用模板。";
  if (name.includes("学徒")) return "工作流锻造路径：把零散使用升级为稳定流程。";
  return "标杆进阶路径：形成可展示、可复盘、可带动他人的 AI 使用案例。";
}

function copyFor(d) {
  const copy = {
    "认知清晰度": "说明你对 AI 的边界、价值和核查必要性有一定理解。",
    "拥抱意愿": "说明你对尝试新方法不排斥，有机会更快建立使用习惯。",
    "任务识别能力": "说明你能较快找到适合 AI 辅助的任务入口。",
    "表达与提问能力": "说明你更容易把需求讲清楚，让 AI 输出接近预期。",
    "判断与安全意识": "说明你在隐私、机密和专业建议上更稳健。",
    "学习迁移潜力": "说明你更可能把一次好结果迁移到更多场景。"
  };
  return { name: d.name, copy: copy[d.name] };
}

function scenarioFor(identity, goal, task) {
  const map = {
    "自由职业者": "客户沟通、报价说明、作品介绍、交付清单和社媒内容。",
    "个体经营者": "活动文案、客户回复、产品卖点、会员维护和短视频脚本。",
    "待业/转型中": "简历优化、岗位分析、面试模拟、学习计划和作品集整理。",
    "学生": "知识点解释、学习计划、资料总结、表达练习和项目展示。",
    "全职照顾家庭": "家庭计划、资料整理、育儿学习、生活决策辅助和时间安排。",
    "退休/再就业探索": "兴趣学习、资料整理、简历梳理、轻创业想法和社群表达。",
    "管理者": "周报总结、会议提纲、任务拆解、团队沟通和复盘报告。",
    "企业员工": "会议纪要、通知撰写、资料整理、工作汇报和流程说明。",
    "创业者": "业务方案、用户访谈、产品卖点、社群运营和融资材料初稿。"
  };
  if (map[identity]) return map[identity];
  if (goal && !goal.includes("不确定")) return `先从“${goal}”相关的小任务开始，再逐步沉淀成固定流程。`;
  if (task && !task.includes("不清")) return `先从“${task}”这类高频任务开始，选择低风险、可检查的小事项。`;
  return "先从总结资料、改写说明、列清单和做计划这些低风险任务开始。";
}

function embraceFor(score, concern) {
  if (score >= 76) return "主动拥抱型：愿意试、愿意迭代，也更可能把 AI 迁移到自己的真实场景。";
  if (concern === "怕出错") return "谨慎靠近型：想靠近 AI，但需要安全边界、低风险任务和明确示范。";
  if (concern === "怕被替代") return "焦虑防御型：需要先理解 AI 是协作工具，不是对个人价值的否定。";
  if (score >= 48) return "被动跟随型：知道 AI 重要，但还需要真实收益和同伴案例来激活。";
  return "无感观望型：暂时还没看到和自己有关的场景，需要从具体小事唤醒。";
}

function depthFor(score) {
  if (score >= 84) return "带动扩散型：未来可能形成可分享案例，带动团队、同学、客户或社群一起使用。";
  if (score >= 68) return "流程嵌入型：未来可能建立个人常用流程，把 AI 变成日常系统的一部分。";
  if (score >= 52) return "任务协作型：未来可能把 AI 用进固定任务，如沟通、内容、学习和资料整理。";
  if (score >= 34) return "工具辅助型：未来更可能稳定用于总结、改写、查资料和整理信息。";
  return "浅尝型：未来可能停留在偶尔问答或简单文案，需要先建立第一批成功体验。";
}

function quadrantFor(readiness, depth) {
  if (readiness >= 50 && depth >= 50) return "进阶挑战型：准备度和未来拥抱深度都较高，可给真实任务、复盘任务和分享机会。";
  if (readiness < 50 && depth >= 50) return "重点培养型：意愿和潜力较好，方法不足，适合重点陪练。";
  if (readiness >= 50 && depth < 50) return "激励唤醒型：有基础但动力不强，需要用成果反馈和真实收益激活。";
  return "鼓励陪伴型：先降低恐惧和距离感，不宜直接上复杂任务。";
}

function coachFor(quadrant, concern) {
  if (quadrant.includes("进阶")) return "建议安排工作流锻造任务，并观察其是否适合作为 Forge 案例分享对象。";
  if (quadrant.includes("重点")) return "建议优先安排清晰表达训练，首个任务选择低风险、高反馈的小场景。";
  if (quadrant.includes("激励")) return "建议用同身份案例和效率收益唤醒，并设置一个可以马上完成的成果任务。";
  if (concern === "怕被替代") return "建议先做协作观念破冰，强调人的判断、审美、经验和责任不可替代。";
  return "建议从安全感和小成功开始，减少术语输入，用陪练方式完成第一个可见成果。";
}

function radar(dimensions) {
  const center = 150;
  const maxR = 104;
  const points = dimensions.map((d, i) => {
    const angle = (-90 + i * 60) * Math.PI / 180;
    const r = maxR * d.value / 100;
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  });
  const grid = [0.25, 0.5, 0.75, 1].map(scale => {
    const ps = dimensions.map((_, i) => {
      const angle = (-90 + i * 60) * Math.PI / 180;
      const r = maxR * scale;
      return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
    }).join(" ");
    return `<polygon points="${ps}" fill="none" stroke="rgba(20,17,15,.16)" stroke-width="1" />`;
  }).join("");
  const axes = dimensions.map((d, i) => {
    const angle = (-90 + i * 60) * Math.PI / 180;
    const x = center + Math.cos(angle) * maxR;
    const y = center + Math.sin(angle) * maxR;
    const tx = center + Math.cos(angle) * (maxR + 28);
    const ty = center + Math.sin(angle) * (maxR + 28);
    return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(20,17,15,.13)" />
      <text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#746a60">${d.name.replace("能力", "").replace("意识", "")}</text>`;
  }).join("");
  return `<svg class="radar" viewBox="0 0 300 300" role="img" aria-label="六维雷达图">
    ${grid}${axes}
    <polygon points="${points.map(p => p.join(",")).join(" ")}" fill="rgba(226,93,47,.24)" stroke="#e25d2f" stroke-width="2" />
    ${points.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#191614" />`).join("")}
  </svg>`;
}

function quickDemo() {
  state.bg = {
    name: "样例学员",
    identity: "自由职业者",
    goal: "做副业或自由接单",
    task: "沟通回复",
    frequency: "偶尔试过",
    concern: "没人教",
    forgeHelp: "给我真实案例照着练"
  };
  questions.forEach(q => {
    const preferred = q.options.find(opt => opt[1] === 3) || q.options[0];
    state.answers[q.id] = { text: preferred[0], score: preferred[1], dimension: q.dimension };
  });
  state.answers.q4 = { text: questions[3].options[0][0], score: 2, dimension: questions[3].dimension };
  state.answers.q6 = { text: questions[5].options[1][0], score: 2, dimension: questions[5].dimension };
  state.submitted = true;
  state.submissionId = "demo";
  state.screen = "results";
  render();
}

function restart() {
  state.screen = "profile";
  state.answers = {};
  state.questionIndex = 0;
  state.submitted = false;
  state.submissionId = "";
  render();
}

function goHome() {
  state.screen = "home";
  render();
}

render();

async function submitCurrentReport() {
  if (state.submitted) return;
  state.submitted = true;
  try {
    const report = buildReport();
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bg: state.bg,
        answers: state.answers,
        report
      })
    });
    const result = await response.json();
    state.submissionId = result.id || "";
  } catch (error) {
    console.warn("submission failed", error);
  }
}
