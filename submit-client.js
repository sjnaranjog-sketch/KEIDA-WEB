(function(){

    function getFilename(){
        return window.location.pathname.split('/').pop();
    }

    function getQuestionLabel(){
        const h1 = document.querySelector('h1');
        return h1 ? h1.textContent.trim() : getFilename();
    }

    function getLanguageFromPath(){
        const parts = window.location.pathname.split('/').filter(Boolean);
        return parts.length >= 2 ? parts[parts.length - 2] : 'es';
    }

    function getErrorMessage(language){
        const messages = {
            es: 'Por favor seleccione una opción para continuar.',
            en: 'Please select an option to continue.',
            fr: 'Veuillez sélectionner une option pour continuer.',
            de: 'Bitte wählen Sie eine Option, um fortzufahren.'
        };

        return messages[language] || messages.es;
    }

    function getNextPage(filename){
        const match = filename.match(/^PREGUNTA(\d+)\.html$/i);

        if(match){
            const num = parseInt(match[1], 10);

            if(num >= 1 && num < 5){
                return `PREGUNTA${num + 1}.html`;
            }

            if(num === 5){
                return 'agradecimientos.html';
            }
        }

        return 'PREGUNTA1.html';
    }

    async function sendAnswer(payload){
        try{
            await fetch('http://localhost:3000/submit', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(payload),
                keepalive:true
            });
        }catch(error){
            console.warn('No se pudo enviar la respuesta', error);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {

        const formulario = document.querySelector('form');

        if(!formulario) return;

        formulario.addEventListener('submit', (e) => {

            e.preventDefault();

            const respuesta =
            formulario.querySelector('input[type="radio"]:checked');

            const mensajeError =
            document.getElementById('mensajeError');

            if(!respuesta){

                if(mensajeError){
                    mensajeError.textContent =
                    getErrorMessage(getLanguageFromPath());
                }

                return;
            }

            if(mensajeError){
                mensajeError.textContent = '';
            }

            const payload = {
                language:getLanguageFromPath(),
                question:getQuestionLabel(),
                filename:getFilename(),
                answer:respuesta.value,
                timestamp:new Date().toISOString()
            };

            sendAnswer(payload);
            window.location.replace(getNextPage(getFilename()));

        });

    });

})();