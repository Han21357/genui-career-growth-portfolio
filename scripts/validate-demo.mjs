import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const demoDir = path.join(root, "demo");
const demoFile = path.join(demoDir, "index.html");
const html = fs.readFileSync(demoFile, "utf8");
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
check("故事线与能力全集并存", html.includes("开始完整成长路径") && featureIds.every((id) => html.includes(id)));

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
check("构建标识存在", html.includes('content="career-genui-ux-polish-20260728-0122"'));

for (const item of checks) {
  console.log(`${item.ok ? "PASS" : "FAIL"}  ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
}

if (failures.length) {
  console.error(`\n${failures.length} 项校验失败。`);
  process.exit(1);
}

console.log(`\n${checks.length} 项静态校验全部通过。`);
