const fs = require('fs');
const files = ['es/index.html','en/index.html','fr/index.html','de/index.html'];
const emojis = ['\uD83C\uDDEA\uD83C\uDDF8','\uD83C\uDDEC\uD83C\uDDE7','\uD83C\uDDEB\uD83C\uDDF7','\uD83C\uDDE9\uD83C\uDDEA'];
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  let updated = text;
  for (const e of emojis) {
    updated = updated.split(e).join('');
  }
  updated = updated.split('es: " ES"').join('es: "ES"');
  updated = updated.split('en: " EN"').join('en: "EN"');
  updated = updated.split('fr: " FR"').join('fr: "FR"');
  updated = updated.split('de: " DE"').join('de: "DE"');
  updated = updated.split('>  ES').join('> ES');
  updated = updated.split('>  EN').join('> EN');
  updated = updated.split('>  FR').join('> FR');
  updated = updated.split('>  DE').join('> DE');
  if (updated !== text) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log('updated', file);
  }
}
