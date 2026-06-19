const fs = require('fs');
const path = require('path');
const dirs = ['es','en','fr','de'];
const files = [];
for(const d of dirs){
  for(let i=1;i<=5;i++){
    files.push(path.join(d, `PREGUNTA${i}.html`));
  }
}

files.forEach(file=>{
  try{
    let text = fs.readFileSync(file,'utf8');
    // Regex to find input radio and the label text that follows (up to </label>)
    const updated = text.replace(/(<input[^>]*name=["']valoracion["'][^>]*value=["'](\d+)["'][^>]*>\s*)([^<\n\r][^<]*?)(?=\s*<\/label>)/g, (m, p1, val, labelText) => {
      // if labelText already starts with a number and hyphen, skip
      if(/^\s*\d+\s*-\s*/.test(labelText)) return p1 + labelText;
      return p1 + (val + ' - ' + labelText.trim());
    });
    if(updated !== text){
      fs.writeFileSync(file, updated, 'utf8');
      console.log('updated', file);
    }
  }catch(err){
    // ignore missing files
  }
});
