const fs = require('fs');

const files = [
  'es/agradecimientos.html',
  'en/agradecimientos.html',
  'fr/agradecimientos.html',
  'de/agradecimientos.html'
];

const buttons = {
  'es/agradecimientos.html': '<a href="#" id="btnVolver"><button id="btnInicio"> Volver a inicio </button></a>',
  'en/agradecimientos.html': '<a href="#" id="btnVolver"><button id="btnInicio"> Back to Home </button></a>',
  'fr/agradecimientos.html': '<a href="#" id="btnVolver"><button id="btnInicio"> Retour à l\'accueil </button></a>',
  'de/agradecimientos.html': '<a href="#" id="btnVolver"><button id="btnInicio"> Zurück zur Startseite </button></a>'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Buscar el cierre de </section> y agregar el botón antes
  const buttonHtml = buttons[file];
  content = content.replace(
    '        </section>',
    '            ' + buttonHtml + '\n\n        </section>'
  );
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('updated', file);
});
