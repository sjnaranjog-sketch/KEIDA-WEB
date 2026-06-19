const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const stylesFile = path.join(root, 'styles.css');
let styles = fs.existsSync(stylesFile) ? fs.readFileSync(stylesFile,'utf8') : '';
const boxCss = `\n/* Caja redondeada para el título de la pregunta */\n.question-box{\n    display:inline-block;\n    padding:10px 22px;\n    border-radius:999px; /* bordes totalmente redondeados */\n    border:2px solid var(--turquesa);\n    background:var(--blanco);\n    color:var(--azul-keida);\n    font-weight:700;\n    box-shadow:0 6px 18px rgba(23,52,92,.06);\n}\n`;
if(!/\.question-box\s*\{/.test(styles)){
  fs.appendFileSync(stylesFile, boxCss, 'utf8');
  console.log('appended styles.css');
} else {
  console.log('styles.css already has .question-box');
}

const dirs = ['es','en','fr','de'];
let updatedFiles = [];
for(const d of dirs){
  for(let i=1;i<=5;i++){
    const file = path.join(root, d, `PREGUNTA${i}.html`);
    if(!fs.existsSync(file)) continue;
    let text = fs.readFileSync(file,'utf8');
    const newText = text.replace(/<header>\s*<h1(.*?)>(.*?)<\/h1>\s*<\/header>/is, (m, attr, content) => {
      if(/class=["'].*question-box.*["']/.test(attr)) return m; // already has class
      // preserve existing attrs
      const newH1 = `<header>\n      <h1 class="question-box"${attr}>${content}</h1>\n    </header>`;
      return newH1;
    });
    if(newText !== text){
      fs.writeFileSync(file, newText, 'utf8');
      updatedFiles.push(file);
    }
  }
}
if(updatedFiles.length) console.log('updated', updatedFiles.join(', '));
else console.log('no files changed');
