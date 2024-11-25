//------------------------------------------------------------RELOJ------------------------------------------------------------------
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

//--------------------------------------------------------MENU LATERAL---------------------------------------------------------------
/*Menu lateral*/
document.addEventListener("DOMContentLoaded", function() {
    const iconoAjustes = document.getElementById("iconoAjustes"); // Ícono de ajustes
    const menuLateral = document.getElementById("menuLateral");
    const cerrarMenu = document.getElementById("cerrarMenu");

    // Abre el menú lateral al hacer clic en el ícono de ajustes
    iconoAjustes.addEventListener("click", function() {
        menuLateral.classList.add("show");
    });

    // Cierra el menú lateral al hacer clic en el botón de cerrar
    cerrarMenu.addEventListener("click", function() {
        menuLateral.classList.remove("show");
    });
});

//--------------------------------------------------------FONDO BLANCO Y NEGRO------------------------------------------------------------------
//Blanco y negro
document.getElementById("blanco-negro").addEventListener("click", function() {
    var body = document.body;

    if (body.style.filter === "grayscale(100%)") {
        body.style.filter = "";
    } else {
        body.style.filter = "grayscale(100%)";
    }
});


//--------------------------------------------------------TRADUCCION DE LA PAGINA------------------------------------------------------------------
//Traduccion del texto a mano
i18next.init({
    lng: 'es', 
    resources: {
        es: {
            translation: {
                titulo: "Tragaperras"
            }
        },
        en: {
            translation: {
                titulo: "Slot Machine"
            }
        },
    }
}, function(err, t) {
    document.getElementById("juego").innerHTML = t('Tragaperras');
    // Establecer la imagen por defecto
    actualizarImagenIdioma(i18next.language);
});

function traducir() {
    const nuevoIdioma = i18next.language === 'es' ? 'en' : 'es';

    i18next.changeLanguage(nuevoIdioma, function(err, t) {
        document.getElementById("juego").innerHTML = t('titulo');
        // Cambiar la imagen de la bandera según el idioma
        actualizarImagenIdioma(nuevoIdioma);
    });
}

// Función para actualizar la imagen del idioma
function actualizarImagenIdioma(idioma) {
    const imagenIdioma = idioma === 'es' ? 'espana.png' : 'ingles.png';
    document.getElementById("imagenIdioma").src = "assets/" + imagenIdioma;
}

//-----------------------------------------------------------------FUNCIONES DE GIRAR LA TRAGAPERRAS-----------------------------------
const imagenes = [
    "assets/icono1.png",
    "assets/icono2.png",
    "assets/icono3.png",
    "assets/icono4.png",
    "assets/icono5.png",
];

// Variable para verificar si ya está girando
let girando = false;
let teclaPresionada = false; // Nueva bandera para detectar la tecla

// Función para obtener una imagen aleatoria
function getFotoAleatoria() {
    return imagenes[Math.floor(Math.random() * imagenes.length)];
}

// Función para hacer girar las imágenes de cada reel
function girarImagenes() {
    if (girando) return; // Salir de la función si ya está girando
    girando = true; // Marcar que el proceso de giro ha comenzado

    const reel1 = document.getElementById("reel1").querySelectorAll("img");
    const reel2 = document.getElementById("reel2").querySelectorAll("img");
    const reel3 = document.getElementById("reel3").querySelectorAll("img");

    let vueltas = 20;

    const intervalo = setInterval(() => {
        for (let i = 0; i < reel1.length; i++) {
            reel1[i].src = getFotoAleatoria();
            reel2[i].src = getFotoAleatoria();
            reel3[i].src = getFotoAleatoria();
        }

        vueltas--;

        if (vueltas <= 0) {
            clearInterval(intervalo);
            comprobarResultado(reel1, reel2, reel3);
            girando = false; // Marcar que el proceso de giro ha terminado, permitiendo un nuevo giro
        }
    }, 100);
}

// Multiplicadores para los icono
const multiplicadores = {
    "icono1": 2,
    "icono2": 3,
    "icono3": 1,
    "icono4": 5,
    "icono5": 1,
};

// Función para obtener el nombre del ícono a partir de la ruta src
function obtenerIconoDesdeSrc(src) {
    const partes = src.split("/");
    const nombreArchivo = partes[partes.length - 1];
    return nombreArchivo.split(".")[0];
}

// Función para calcular el premio
function calcularPremio(icono, apuesta) {
    const multiplicador = multiplicadores[icono] || 1;
    return apuesta * multiplicador;
}

//---------------------------------------MODAL GANADOR-------------------------------------------------------------
function mostrarModalGanador(premio) {
    const modalGanador = document.getElementById("modalGanador");
    const recompensaSpan = document.getElementById("recompensa");
    const closeModalGanador = document.getElementById("closeModalGanador");
    const jugarDeNuevo = document.getElementById("jugarDeNuevo");

    // Establecer la recompensa en el modal
    recompensaSpan.textContent = premio;

    // Mostrar el modal
    modalGanador.style.display = "block";

    // Cerrar el modal al hacer clic en la 'X' o en el botón de "Jugar de nuevo"
    closeModalGanador.addEventListener("click", () => {
        modalGanador.style.display = "none";
    });

    jugarDeNuevo.addEventListener("click", () => {
        modalGanador.style.display = "none";
        // Aquí puedes reiniciar la lógica del juego si es necesario
    });

    // Cerrar el modal al hacer clic fuera de su contenido
    window.addEventListener("click", (event) => {
        if (event.target === modalGanador) {
            modalGanador.style.display = "none";
        }
    });
}

//-----------------------------------SONIDOS DE LA APLICACION-------------------------------------------------------
const controlVolumen = document.querySelector("#volumen input"); 
const sonidoPremio = document.getElementById("sonidoPremio");
const audioPresionarBoton = document.getElementById("presionarBoton");

// Establece el volumen inicial del audio al valor del rango
sonidoPremio.volume = controlVolumen.value;
audioPresionarBoton.volume = controlVolumen.value;

// Evento para actualizar el volumen según el rango
controlVolumen.addEventListener("input", () => {
    sonidoPremio.volume = controlVolumen.value;
    audioPresionarBoton.volume = controlVolumen.value;
});

// Funcion para comprobar los resultados
function comprobarResultado(reel1, reel2, reel3) {
    const mensaje = document.getElementById("mensaje");

    // Convierte los reels en una matriz para manejar las posiciones fácilmente
    const matriz = [
        [reel1[0].src, reel2[0].src, reel3[0].src], // Fila superior
        [reel1[1].src, reel2[1].src, reel3[1].src], // Fila intermedia
        [reel1[2].src, reel2[2].src, reel3[2].src], // Fila inferior
    ];

    // Definir posibles combinaciones ganadoras
    const combinacionesGanadoras = [
        // Filas
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columnas
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonales
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];

    let victoria = false;
    let iconoGanador = null;

    // Comprobar cada combinación ganadora
    for (const combinacion of combinacionesGanadoras) {
        const [primera, segunda, tercera] = combinacion;
        if (
            matriz[primera[0]][primera[1]] === matriz[segunda[0]][segunda[1]] &&
            matriz[segunda[0]][segunda[1]] === matriz[tercera[0]][tercera[1]]
        ) {
            victoria = true;
            iconoGanador = matriz[primera[0]][primera[1]];
            break;
        }
    }

    if (victoria) {
        const premio = calcularPremio(obtenerIconoDesdeSrc(iconoGanador), apuesta);

        mostrarModalGanador(premio);
        monedas += premio;
        actualizarMonedasYApuesta();

        //Hacer sonar el sonido del premio
        sonidoPremio.currentTime = 0;
        sonidoPremio.play();

    } else {
        mensaje.textContent = "¡Sigue intentando!";
        mensaje.style.color = "white";
    }
}

// Evento de teclado para iniciar el giro con la tecla de espacio
document.addEventListener("keydown", (event) => {
    if ((event.key === " " || event.key === "Spacebar") && !teclaPresionada && !girando) {
        teclaPresionada = true; // Marcar que la tecla está presionada

        //Hacer sonar la musica
        audioPresionarBoton.currentTime = 0;
        audioPresionarBoton.play();

        if (monedas >= apuesta) {
            monedas -= apuesta;
            girarImagenes();
            actualizarMonedasYApuesta();
        } else {
            const mensaje = document.getElementById("mensaje");
            mensaje.textContent = "¡Introduce más monedas para seguir jugando!";
        }
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === " " || event.key === "Spacebar") {
        teclaPresionada = false; 
    }
});

// Botón de giro
const girar = document.getElementById("girar");
girar.addEventListener("click", () => {
    if (!girando) { // Comprueba si esta girando

        //Hacer sonar la musica
        audioPresionarBoton.currentTime = 0;
        audioPresionarBoton.play();

        if (monedas >= apuesta) {
            monedas -= apuesta;
            girarImagenes();
            actualizarMonedasYApuesta();
        } else {
            const mensaje = document.getElementById("mensaje");
            mensaje.textContent = "¡Introduce más monedas para seguir jugando!";
        }
    }
});


//----------------------------------------------------------------------PULPO ANIMADO--------------------------------------------------
function mostrarPulpo() {
    const pulpo = document.getElementById("pulpoAnimado");
    pulpo.style.display = "block"; // Mostrar el pulpo
}

//-----------------------------------------------------------------Sumar o Restar apuesta----------------------------------------------
const btnMasApuesta = document.getElementById("masApuesta");
const btnMenos = document.getElementById("menos");

btnMasApuesta.addEventListener("click", () => {
    if(apuesta < 200){
        apuesta += 20;
        actualizarMonedasYApuesta();
    }
    if(apuesta === 200){
        mensaje.textContent = "¡Apuesta máxima tira para jugar!";
    }
});

btnMenos.addEventListener("click", () => {
    if(apuesta > 20){
        apuesta -= 20;
        actualizarMonedasYApuesta();
    }
    if(apuesta === 20) {
        mensaje.textContent = "¡Apuesta mínima tira para jugar!";
    }
});

//--------------------------------------------------------------------Saldo del Usuario-------------------------------------------
 // Variables
 let saldo = parseFloat(localStorage.getItem("saldo")) || 0;
 let monedas = 0; 
 let apuesta = 20; 

 //Para cambiar el valor del saldo
 const saldoValor = document.getElementById("saldoValor");
 //Modal de añadir monedas
 const modalMonedas = document.getElementById("modalMonedas");
 const closeModalMonedas = document.getElementById("closeModalMonedas");
 const convertirBtn = document.getElementById("convertir");
 const masBtn = document.getElementById("mas");
 const inputMonedas = document.getElementById("inputMonedas");
 const mensajeError = document.getElementById("mensajeErrorSumar");
//Modal de retirar monedas
const modalRetirar = document.getElementById("modalRetirar");
const closeModalRetirar = document.getElementById("closeModalRetirar");
const retirarBtn = document.getElementById("retirarMon");
const retirarImg = document.getElementById("retirar");
const inputRetirar = document.getElementById("inputRetirar");
const mensajeErrorRetirar = document.getElementById("mensajeErrorRetirar");

 //Monedas y apuesta 
 const monedasDiv = document.getElementById("monedas").querySelector("p");
 const apuestaDiv = document.getElementById("apuesta").querySelector("p");

 // Actualizar saldo en la página
 function actualizarSaldoEnPagina() {
     saldoValor.textContent = `$${saldo.toFixed(2)}`;
 }
 actualizarSaldoEnPagina();

 // Actualizar la visualización de monedas y apuesta
 function actualizarMonedasYApuesta() {
     monedasDiv.textContent = `Monedas: ${monedas}`;
     apuestaDiv.textContent = `Apuesta: ${apuesta}`;
 }
 actualizarMonedasYApuesta();

 // Mostrar el modal al hacer clic en la imagen
 masBtn.addEventListener("click", () => {
     modalMonedas.style.display = "flex";
 });

 retirarImg.addEventListener("click", () => {
    modalRetirar.style.display = "flex";
 });

 // Cerrar el modal
 closeModalMonedas.addEventListener("click", () => {
     modalMonedas.style.display = "none";
     mensajeError.style.display = "none";
 });

 closeModalRetirar.addEventListener("click", () => {
    modalRetirar.style.display = "none";
    mensajeErrorRetirar.style.display = "none";
 });

 // Función para convertir el saldo en monedas
 convertirBtn.addEventListener("click", () => {
     const cantidad = parseFloat(inputMonedas.value);

     if (!saldo || saldo <= 0) {
         mensajeError.textContent = "Introduce saldo para jugar.";
         mensajeError.style.display = "block";
         return;
     }

     if (isNaN(cantidad) || cantidad <= 0) {
         mensajeError.textContent = "Introduce una cantidad válida.";
         mensajeError.style.display = "block";
         return;
     }

     if (cantidad > saldo) {
         mensajeError.textContent = "Saldo insuficiente.";
         mensajeError.style.display = "block";
         return;
     }

     // Restar del saldo y agregar monedas
     saldo -= cantidad;
     monedas += cantidad * 100; 
     apuesta = Math.min(monedas, 20); 
     localStorage.setItem("saldo", saldo);

     actualizarSaldoEnPagina();
     actualizarMonedasYApuesta();

     // Ocultar el modal y reiniciar el formulario
     modalMonedas.style.display = "none";
     inputMonedas.value = "";
     mensajeError.style.display = "none";
 });

 //Funcion para retirar el dinero y añadirlo al saldo
 retirarMon.addEventListener("click", () => {
    const cantidad = parseInt(inputRetirar.value);

    // Validar si la cantidad es válida
    if (isNaN(cantidad) || cantidad <= 0) {
        mensajeErrorRetirar.textContent = "Introduce una cantidad válida.";
        mensajeErrorRetirar.style.display = "block";
        return;
    }

    // Verificar si hay suficientes monedas para retirar
    if (cantidad > monedas) {
        mensajeErrorRetirar.textContent = "No tienes suficientes monedas.";
        mensajeErrorRetirar.style.display = "block";
        return;
    }

    // Restar monedas y sumar su valor equivalente al saldo
    monedas -= cantidad;
    saldo += cantidad / 100; 
    localStorage.setItem("saldo", saldo);

    // Actualizar la visualización de saldo y monedas
    actualizarSaldoEnPagina();
    actualizarMonedasYApuesta();

    // Ocultar el modal y reiniciar el formulario
    modalMonedas.style.display = "none";
    inputRetirar.value = "";
    mensajeErrorRetirar.style.display = "none";
});

 // Ocultar el modal si se hace clic fuera de él
 window.addEventListener("click", (event) => {
     if (event.target === modalMonedas) {
         modalMonedas.style.display = "none";
         mensajeError.style.display = "none";
     }
 });

 window.addEventListener("click", (event) => {
    if (event.target === modalRetirar) {
        modalRetirar.style.display = "none";
        mensajeErrorRetirar.style.display = "none";
    }
});

//--------------------------------------------------------------MODAL INFORMACION----------------------------------------------------
const modalInformacion = document.getElementById("modalInformacion");
const closeModalInformacion = document.getElementById("closeModalInformacion");
const informacionImg = document.getElementById("informacionImg");

informacionImg.addEventListener("click", () => {
    modalInformacion.style.display = "flex";
});

closeModalInformacion.addEventListener("click", () => {
    modalInformacion.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modalInformacion){
        modalInformacion.style.display = "none";
    }
});