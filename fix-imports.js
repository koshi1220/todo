import fs from "fs";
import path from "path";

const rootDir = "./src";

function fixFileImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // 相対パスには .js をつける
  content = content.replace(
    /from\s+["'](\.{1,2}\/[^"']+)["']/g,
    (match, p1) => {
      return p1.match(/\.(ts|js|tsx|jsx)$/) ? match : `from "${p1}.js"`;
    }
  );

  // パッケージ名 + .ts を削除
  content = content.replace(
    /from\s+["'](react|react-dom[^"']*|firebase\/[^"']*|clsx|react-dnd[^"']*|react-router-dom[^"']*)\.ts["']/g,
    (match, pkg) => `from "${pkg}"`
  );

  fs.writeFileSync(filePath, content, "utf8");
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fixFileImports(fullPath);
    }
  }
}

walk(rootDir);
console.log("✅ import 文を修正しました。再度 npm run build を実行してください。");
