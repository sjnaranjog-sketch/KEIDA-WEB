Instrucciones para recibir respuestas de las páginas HTML

1) Instalar dependencias (Node.js requerido):

   npm install

2) Iniciar servidor:

   npm start

   Esto ejecuta `server.js` en http://localhost:3000

3) Flujo:

- Las páginas HTML incluyen `submit-client.js` que captura clics en los botones de avance.
- Cuando el usuario hace click, se solicita la respuesta (prompt) y se envía a `POST http://localhost:3000/submit`.
- El servidor intentará guardar las respuestas en `responses.db` (SQLite). Si SQLite no está disponible, escribirá sentencias SQL en `pending_inserts.sql`.

4) Acceso desde el móvil con datos móviles:

- Si tu PC está conectado a Internet, puedes crear un túnel público usando `localtunnel` para que el teléfono acceda desde cualquier red.
- Ejecuta primero el servidor:

  npm start

- En otra terminal, ejecuta:

  npm run public-qr

- Esto generará una URL pública y un archivo `qr_public_mobile.html` con el QR listo para escanear.

Notas:
- Si quieres integrar otra base de datos, modifica `server.js` para usar el driver correspondiente.
- El cliente usa `keepalive` y `sendBeacon` como fallback para mejorar la entrega antes de navegación.
