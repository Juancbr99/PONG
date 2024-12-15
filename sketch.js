let anchoCanvas;
let altoCanvas;

let margenLateral = 20;
let margenVertical = 20;

let jugadorX;
let jugadorY;
let anchoRaqueta;
let altoRaqueta;

let computadoraX;
let computadoraY;

let pelotaX, pelotaY;
let diametroPelota;
let velocidadPelotaX = 5;
let velocidadPelotaY = 5;
let anguloPelota = 0;

let grosorMarco;

let jugadorScore = 0;
let computadoraScore = 0;

let fondo;
let barraJugador;
let barraComputadora;
let bola;
let sonidoRebote;
let sonidoGol;

let tiempoInicial;
let duracionPartida = 2.5 * 60 * 1000;

let botonReinicio;
let botonMenu;
let botonPausa;

let estadoJuego = "menu";
let botonIniciar;
let juegoPausado = false;

let botonArriba, botonAbajo;

function preload() {
    fondo = loadImage('Imagenes/fondo1.png');
    barraJugador = loadImage('Imagenes/barra1.png');
    barraComputadora = loadImage('Imagenes/barra2.png');
    bola = loadImage('Imagenes/bola.png');
    sonidoRebote = loadSound('sonido/bounce.wav');
    sonidoGol = loadSound('sonido/jingle_win_synth_02.wav');
}

function setup() {
    // Forzar el juego a modo horizontal
    if (windowWidth < windowHeight) {
        alert('Gira el dispositivo a modo horizontal para jugar');
        return; // Detener la ejecución si no está en horizontal
    }
    
    ajustarCanvas();
    jugadorY = height / 2 - altoRaqueta / 2;
    computadoraY = height / 2 - altoRaqueta / 2;
    resetPelota();
    tiempoInicial = millis();

    botonReinicio = createButton('Reiniciar');
    botonReinicio.position((width - botonReinicio.width) / 2, height - margenVertical - 40);
    botonReinicio.mousePressed(resetPartida);
    botonReinicio.hide();

    botonIniciar = createButton('Iniciar juego');
    botonIniciar.position((width - botonIniciar.width) / 2, height / 2 + 40);
    botonIniciar.mousePressed(() => {
        estadoJuego = "jugando";
        botonIniciar.hide();
        botonReinicio.show();
        botonMenu.show();
        botonPausa.show();
        tiempoInicial = millis();
    });

    botonMenu = createButton('Volver al Menú');
    botonMenu.position((width - botonMenu.width) / 2, height - margenVertical - 80);
    botonMenu.mousePressed(() => {
        estadoJuego = "menu";
        botonMenu.hide();
        botonReinicio.hide();
        botonIniciar.show();
        botonPausa.hide();
    });
    botonMenu.hide();

    botonPausa = createButton('Pausa');
    botonPausa.position(margenLateral, margenVertical);
    botonPausa.mousePressed(() => {
        juegoPausado = !juegoPausado;
        botonPausa.html(juegoPausado ? 'Reanudar' : 'Pausa');
    });
    botonPausa.hide();

    // Solo mostrar los botones en celular
    if (windowWidth < 600) {
        botonArriba = createButton('↑');
        botonArriba.position(margenLateral + 10, height / 2 - 40); // Centrado en la parte izquierda
        botonArriba.size(40, 40);
        botonArriba.mousePressed(moverArriba);
        botonArriba.hide();  // Inicialmente oculto

        botonAbajo = createButton('↓');
        botonAbajo.position(margenLateral + 10, height / 2 + 20); // Centrado en la parte izquierda
        botonAbajo.size(40, 40);
        botonAbajo.mousePressed(moverAbajo);
        botonAbajo.hide();  // Inicialmente oculto
    }
}

function windowResized() {
    ajustarCanvas();
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
    computadoraY = constrain(computadoraY, grosorMarco, height - grosorMarco - altoRaqueta);
    botonReinicio.position((width - botonReinicio.width) / 2, height - margenVertical - 40);
    botonMenu.position((width - botonMenu.width) / 2, height - margenVertical - 80);
    if (botonIniciar) botonIniciar.position((width - botonIniciar.width) / 2, height / 2 + 40);
    botonPausa.position(margenLateral, margenVertical);

    // Ajuste de botones para móvil
    if (windowWidth < 600) {
        botonArriba.position(margenLateral + 10, height / 2 - 40); // Ajuste en la posición
        botonAbajo.position(margenLateral + 10, height / 2 + 20); // Ajuste en la posición
        botonArriba.show();
        botonAbajo.show();
    }
}

function moverArriba() {
    jugadorY -= 50;
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function moverAbajo() {
    jugadorY += 50;
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function draw() {
    if (estadoJuego === "menu") {
        mostrarMenu();
    } else if (estadoJuego === "jugando") {
        if (!juegoPausado) {
            background(fondo);
            dibujarMarcos();
            dibujarRaquetas();
            dibujarPelota();
            mostrarPuntaje();
            mostrarTiempoRestante();
            moverPelota();
            moverComputadora();
            verificarColisiones();
            verificarTiempo();
        } else {
            textSize(48);
            textAlign(CENTER, CENTER);
            fill(color("#ffffff"));
            text("Pausa", width / 2, height / 2);
        }
    }
}

function mostrarMenu() {
    background(fondo);
    textSize(64);
    textAlign(CENTER, CENTER);
    fill(color("#ffffff"));
    text("PONG", width / 2, height / 2 - 60);
}

function ajustarCanvas() {
    anchoCanvas = windowWidth - 2 * margenLateral;
    altoCanvas = windowHeight - 2 * margenVertical;
    createCanvas(anchoCanvas, altoCanvas).position(margenLateral, margenVertical);

    anchoRaqueta = anchoCanvas * 0.0125;
    altoRaqueta = altoCanvas * 0.25;
    diametroPelota = anchoCanvas * 0.025;
    grosorMarco = altoCanvas * 0.025;

    jugadorX = margenLateral + 15;
    computadoraX = anchoCanvas - 25;
}

function resetPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    velocidadPelotaX = 5 * (Math.random() > 0.5 ? 1 : -1);
    velocidadPelotaY = 5 * (Math.random() > 0.5 ? 1 : -1);
    anguloPelota = 0;
}

function resetPartida() {
    jugadorScore = 0;
    computadoraScore = 0;
    tiempoInicial = millis();
    resetPelota();


function keyPressed() {
    if (keyCode === UP_ARROW) {
        jugadorY -= 50;
    } else if (keyCode === DOWN_ARROW) {
        jugadorY += 50;
    }
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}
