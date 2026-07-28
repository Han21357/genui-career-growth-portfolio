import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const demoDir = path.join(root, "demo");
const demoFile = path.join(demoDir, "index.html");
const html = fs.readFileSync(demoFile, "utf8");
const researchHtml = fs.readFileSync(path.join(root, "research", "competitive-analysis.html"), "utf8");
const failures = [];
const checks = [];

function check(name, condition, detail = "") {
  checks.push({ name, ok: Boolean(condition), detail });
  if (!condition) failures.push(`${name}${detail ? `: ${detail}` : ""}`);
}

const htmlFiles = fs.readdirSync(demoDir).filter((name) => name.endsWith(".html"));
check("唯一公开 HTML", htmlFiles.length === 1 && htmlFiles[0] === "index.html", htmlFiles.join(", "));

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
let syntaxError = "";
for (const script of scripts) {
  try {
    new Function(script);
  } catch (error) {
    syntaxError = error.stack || error.message;
    break;
  }
}
check("内联 JavaScript 语法", scripts.length === 1 && !syntaxError, syntaxError);

const markup = html.slice(0, html.indexOf("<script"));
const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
check("静态 DOM ID 唯一", duplicateIds.length === 0, duplicateIds.join(", "));

const featureMatch = html.match(/const FEATURE_IDS=(\[[^;]+\])/);
const featureIds = featureMatch ? JSON.parse(featureMatch[1]) : [];
check("能力入口完整", featureIds.length >= 21, `发现 ${featureIds.length} 个`);
check("四阶段能力导航保留", ["目标诊断", "理解建构", "练习计划", "实战转化"].every((text) => html.includes(text)));

const stepsMatch = html.match(/const GUIDED_JOURNEY_STEPS=\[([\s\S]*?)\n\];/);
const storyStepCount = stepsMatch ? (stepsMatch[1].match(/\{key:/g) || []).length : 0;
check("故事线十阶段", storyStepCount === 10, `发现 ${storyStepCount} 个`);
check("产品特征优先，故事线作为可选演示", html.includes("把复杂任务变成可操作、可验证、可继续的界面") && html.includes("GUIDED PRODUCT TOUR / 可选演示") && featureIds.every((id) => html.includes(id)));
check("市场调研独立页签", html.includes('data-console-page="market"') && html.includes('id="panelMarket"') && html.includes("../research/competitive-analysis.html?embed=1&amp;v=20260728-02"));
const marketChapter = researchHtml.indexOf('id="chapter-market"');
const productChapter = researchHtml.indexOf('id="chapter-product"');
check("市场报告两篇完整且顺序正确", marketChapter >= 0 && productChapter > marketChapter && researchHtml.includes("第一篇｜市场格局、运营模式与商业化判断") && researchHtml.includes("第二篇｜功能竞争、GenUI 产品机会与设计发心"));

const sceneStart = html.indexOf('<div class="panel active" id="panelDemo">');
const sceneEnd = html.indexOf('<div class="panel" id="panelReport">');
const sceneText = html
  .slice(sceneStart, sceneEnd)
  .replace(/<[^>]*>/g, " ")
  .replace(/\s+/g, " ");
const bannedVisible = ["原型", "开发者", "Demo", "demo", "Prompt", "prompt"].filter((word) => sceneText.includes(word));
check("场景区无研发口吻", bannedVisible.length === 0, bannedVisible.join(", "));

[
  "元宝主模型何时委派给 GenUI",
  "Artifact Plan",
  "Schema 校验",
  "确认与写回",
  "回到主模型",
].forEach((text) => check(`策略链包含：${text}`, html.includes(text)));

[
  "APP_STATE=",
  "function reducer",
  "function dispatch",
  "localStorage",
  "renderSheet",
  "renderFullscreen",
  "UNDO_LAST_ACTION",
  "RESET_SCENARIO",
  "CLEAR_ALL",
  "resetGuidedJourneyState",
  "prefers-reduced-motion",
  "focus-visible",
].forEach((token) => check(`关键机制保留：${token}`, html.includes(token)));

check("画幅变量存在", ["--phone-height", "--phone-ratio", "--left-panel-width"].every((token) => html.includes(token)));
check("构建标识存在", html.includes('content="career-genui-report-structure-20260728-02"'));

for (const item of checks) {
  console.log(`${item.ok ? "PASS" : "FAIL"}  ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
}

if (failures.length) {
  console.error(`\n${failures.length} 项校验失败。`);
  process.exit(1);
}

console.log(`\n${checks.length} 项静态校验全部通过。`);
