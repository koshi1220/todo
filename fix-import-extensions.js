// fix-import-extensions.js
import fs from "fs";
import path from "path";

const rootDir = "./src";

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const updated = content.replace(
    /from\s+["']([^.'"][^"']*)["']/g,
    (match, p1) => {
      // すでに .ts, .js, .tsx 付きならスルー
      if (/\.(ts|js|tsx|jsx)$/.test(p1)) return match;
      return `from "${p1}.ts"`; // 必要に応じて .js に変更
    }
  );
  fs.writeFileSync(filePath, updated, "utf8");
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fixImportsInFile(fullPath);
    }
  }
}

walk(rootDir);
console.log("✅ importパスを修正しました！");
