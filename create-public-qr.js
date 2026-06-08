const fs = require('fs');
const localtunnel = require('localtunnel');

async function main() {
  const targetPath = process.argv[2] || 'fr/PREGUNTA1.html';
  const localUrl = `http://localhost:3000/${targetPath}`;
  const tunnel = await localtunnel({ port: 3000 });
  const publicUrl = `${tunnel.url}/${targetPath}`.replace(/\/\/+$/, '');

  console.log('Servidor local:', localUrl);
  console.log('URL pública:', publicUrl);

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(publicUrl)}`;
  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>QR público para móvil</title>
  <style>
    body{display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:1rem;font-family:system-ui,Segoe UI,Roboto,Arial;background:#f7fbff}
    .card{max-width:460px;width:100%;background:#fff;padding:22px;border-radius:14px;box-shadow:0 10px 28px rgba(0,0,0,.1);text-align:center}
    img{max-width:100%;height:auto}
    a{display:inline-block;margin-top:14px;color:#0366d6}
    p{color:#333}
  </style>
</head>
<body>
  <div class="card">
    <h1>Escanea este QR</h1>
    <p>Abre la prueba desde tu móvil con redes móviles</p>
    <img src="${qrSrc}" alt="QR público para móvil">
    <p><a href="${publicUrl}">${publicUrl}</a></p>
    <p style="font-size:.9rem;color:#555;">Asegúrate de tener `npm start` corriendo en la PC antes de usar el QR.</p>
  </div>
</body>
</html>`;

  fs.writeFileSync('qr_public_mobile.html', html, 'utf8');
  console.log('Archivo creado: qr_public_mobile.html');
  console.log('Pulsa Ctrl+C para cerrar el túnel cuando termines.');
}

main().catch(err => {
  console.error('Error al crear el túnel público:', err.message || err);
  process.exit(1);
});