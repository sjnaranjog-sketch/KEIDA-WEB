(function(){
  function getLanguageFromPath(){
    const parts = window.location.pathname.split('/').filter(Boolean);
    // assuming URL ends with /{lang}/{file}
    if(parts.length >= 2){
      return parts[parts.length-2];
    }
    return 'es';
  }

  function getFilename(){
    return window.location.pathname.split('/').pop();
  }

  function getQuestionLabel(){
    const h1 = document.querySelector('h1');
    return h1 ? h1.textContent.trim() : getFilename();
  }

  async function sendAnswer(payload){
    try{
      // try fetch to local server
      await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload),
        keepalive: true
      });
    }catch(e){
      // if unreachable, try sendBeacon
      if(navigator && navigator.sendBeacon){
        const url = 'http://localhost:3000/submit';
        const blob = new Blob([JSON.stringify(payload)], {type:'application/json'});
        navigator.sendBeacon(url, blob);
      } else {
        console.warn('Could not send answer to server', e);
      }
    }
  }

  function attachToButton(button){
    if(!button) return;
    button.addEventListener('click', function(e){
      e.preventDefault();
      handleSubmit(button.closest('form') || document.querySelector('form'), button);
    });
  }

  function attachToForm(form){
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      handleSubmit(form, form.querySelector('button[type=submit], input[type=submit]'));
    });
  }

  function handleSubmit(form, button){
    let answer = null;
    const radios = form.querySelectorAll('input[type=radio]:checked');
    if(radios && radios.length>0){
      answer = Array.from(radios).map(r=>r.value).join(',');
    } else {
      const textInputs = form.querySelectorAll('input[type=text], textarea');
      if(textInputs && textInputs.length>0){
        answer = Array.from(textInputs).map(i=>i.value.trim()).filter(v=>v).join(', ');
      }
    }
    if(!answer){
      answer = prompt('Ingresa tu respuesta para: "' + getQuestionLabel() + '" (por ejemplo 1-5, Sí/No)');
    }

    const payload = {
      language: getLanguageFromPath(),
      question: getQuestionLabel(),
      filename: getFilename(),
      answer: answer,
      timestamp: new Date().toISOString()
    };

    sendAnswer(payload).finally(()=>{
      const nextLink = button ? button.closest('a') : null;
      if(nextLink && nextLink.href){
        window.location.href = nextLink.getAttribute('href');
        return;
      }
      if(button && button.dataset.next){
        window.location.href = button.dataset.next;
        return;
      }
      const current = getFilename();
      const nextPage = form.getAttribute('data-next') || getNextPage(current);
      window.location.href = nextPage;
    });
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
    return 'PREGUNTA2.html';
  }

  document.addEventListener('DOMContentLoaded', function(){
    const ids = ['btnsiguiente','btnfin','btnInicio','btnStart'];
    ids.forEach(id=>{
      const b = document.getElementById(id);
      if(b) attachToButton(b);
    });

    document.querySelectorAll('form').forEach(form=>{
      attachToForm(form);
    });
  });
})();
