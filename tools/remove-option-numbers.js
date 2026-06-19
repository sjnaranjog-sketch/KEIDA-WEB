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
    const updated = text.replace(/>\s*[1-5]\s*-\s*/g, '> ');
    if(updated !== text){
      fs.writeFileSync(file, updated, 'utf8');
      console.log('updated', file);
    }
  }catch(err){
    // ignore missing files
  }
});
