const fs = require('fs');
const path = require('path');

function replaceInFiles(dir, oldStr, newStr) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'scratch') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      replaceInFiles(fullPath, oldStr, newStr);
    } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(oldStr)) {
        console.log(`Replacing in: ${fullPath}`);
        fs.writeFileSync(fullPath, content.replace(new RegExp(oldStr, 'g'), newStr), 'utf8');
      }
      
      // Also check capitalized
      const capOldStr = oldStr.charAt(0).toUpperCase() + oldStr.slice(1);
      const capNewStr = newStr.charAt(0).toUpperCase() + newStr.slice(1);
      if (content.includes(capOldStr)) {
        console.log(`Replacing capitalized in: ${fullPath}`);
        const newContent = fs.readFileSync(fullPath, 'utf8');
        fs.writeFileSync(fullPath, newContent.replace(new RegExp(capOldStr, 'g'), capNewStr), 'utf8');
      }
    }
  }
}

replaceInFiles(process.cwd(), 'emerald', 'pink');
console.log('Done!');
