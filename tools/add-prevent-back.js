const fs = require('fs');
const path = require('path');

const files = [
  'es/PREGUNTA1.html', 'es/PREGUNTA2.html', 'es/PREGUNTA3.html', 'es/PREGUNTA4.html', 'es/PREGUNTA5.html', 'es/agradecimientos.html',
  'en/PREGUNTA1.html', 'en/PREGUNTA2.html', 'en/PREGUNTA3.html', 'en/PREGUNTA4.html', 'en/PREGUNTA5.html', 'en/agradecimientos.html',
  'fr/PREGUNTA1.html', 'fr/PREGUNTA2.html', 'fr/PREGUNTA3.html', 'fr/PREGUNTA4.html', 'fr/PREGUNTA5.html', 'fr/agradecimientos.html',
  'de/PREGUNTA1.html', 'de/PREGUNTA2.html', 'de/PREGUNTA3.html', 'de/PREGUNTA4.html', 'de/PREGUNTA5.html', 'de/agradecimientos.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const isQuestion = file.includes('PREGUNTA');
  
  if (isQuestion) {
    // Para preguntas: insertar prevent-back.js después de submit-client.js
    content = content.replace(
      '<script src="../submit-client.js"></script>',
      '<script src="../submit-client.js"></script>\n    <script src="../prevent-back.js"></script>'
    );
  } else {
    // Para agradecimientos: insertar prevent-back.js antes de </body>
    content = content.replace(
      '</body>',
      '    <script src="../prevent-back.js"></script>\n  </body>'
    );
  }
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('updated', file);
});
