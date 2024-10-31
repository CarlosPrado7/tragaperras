function actualizarReloj() {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');

    const tiempo = `${horas}:${minutos}:${segundos}`;
    document.getElementById('reloj').textContent = tiempo;
}

// Actualiza el reloj cada segundo
setInterval(actualizarReloj, 1000);

// Inicia el reloj
actualizarReloj();