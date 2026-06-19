(function() {
  // Prevenir retroceso y no guardar en historial
  window.history.pushState(null, null, window.location.href);
  
  window.addEventListener('popstate', function(event) {
    // Cuando intenta retroceder, avanzar nuevamente
    window.history.forward();
  });
})();
