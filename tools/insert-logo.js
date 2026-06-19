const fs = require('fs');
const path = require('path');
const dirs = ['es', 'en', 'fr', 'de'];

dirs.forEach((dir) => {
  const dirPath = path.join(__dirname, '..', dir);
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.html'));
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('class="logo-keida"') || content.includes("class='logo-keida'")) {
      return;
    }
    content = content.replace(
      /<body>(\s*)/,
      '<body>$1    <img src="../img/logo.png" class="logo-keida" alt="KEIDA logo">$1'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('updated', filePath);
  });
});
