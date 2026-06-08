const fs = require('fs');
const path = require('path');

function walk(dir){
  let out = [];
  for(const e of fs.readdirSync(dir, { withFileTypes: true })){
    const p = path.join(dir, e.name);
    if(e.isDirectory()) out = out.concat(walk(p));
    else if(p.endsWith('.html')) out.push(p);
  }
  return out;
}

const desired = '<link rel="stylesheet" href="/styles.css">';
const files = walk(process.cwd());
let changed = 0;
for(const f of files){
  let s = fs.readFileSync(f,'utf8');
  if(s.includes(desired)) continue;
  if(/<link\s+rel=["']stylesheet["']/i.test(s)){
    s = s.replace(/<link\s+rel=["']stylesheet["'][^>]*>/i, desired);
    fs.writeFileSync(f,s,'utf8');
    console.log('Replaced in', f);
    changed++;
  } else {
    const re = /<head([^>]*)>/i;
    if(re.test(s)){
      s = s.replace(re, (m)=> m + "\n    " + desired);
      fs.writeFileSync(f,s,'utf8');
      console.log('Inserted in', f);
      changed++;
    }
  }
}
console.log('Done. Modified:', changed);
