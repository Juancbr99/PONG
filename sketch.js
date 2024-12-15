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

let jugadorUltimaPosicionY;

let botonArriba;
let botonAbajo;

function preload() {
    fondo = loadImage('Imagenes/fondo1.png');
    barraJugador = loadImage('Imagenes/barra1.png');
    barraComputadora = loadImage('Imagenes/barra2.png');
    bola = loadImage('Imagenes/bola.png');
    sonidoRebote = loadSound('sonido/bounce.wav');
    sonidoGol = loadSound('sonido/jingle_win_synth_02.wav');
}

function setup() {
    ajustarCanvas();
    jugadorY = height / 2 - altoRaqueta / 2;
    computadoraY = height / 2 - altoRaqueta / 2;
    resetPelota();
    tiempoInicial = millis();

    // Botones y controles
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

    // Botones de control en el móvil
    if (windowWidth < 600) {
        // Botón de arriba
        botonArriba = createButton('↑');
        botonArriba.size(30, 30);  // Tamaño reducido
        botonArriba.mousePressed(moverArriba);
        botonArriba.hide();  // Inicialmente oculto

        // Botón de abajo
        botonAbajo = createButton('↓');
        botonAbajo.size(30, 30);  // Tamaño reducido
        botonAbajo.mousePressed(moverAbajo);
        botonAbajo.hide();  // Inicialmente oculto
    }
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

    // Mostrar botones solo en el móvil
    if (windowWidth < 600) {
        botonArriba.show();
        botonAbajo.show();
        botonArriba.position(jugadorX + anchoRaqueta / 2 - 15, jugadorY - 100);  // Ajustado aquí
        botonAbajo.position(jugadorX + anchoRaqueta / 2 - 15, jugadorY + altoRaqueta - 30 );  // Ajustado aquí
    }
}

function ajustarCanvas() {
    anchoCanvas = windowWidth;
    altoCanvas = windowHeight;
    createCanvas(anchoCanvas, altoCanvas).position(0, 0);

    anchoRaqueta = anchoCanvas * 0.0125;
    altoRaqueta = altoCanvas * 0.25;
    diametroPelota = anchoCanvas * 0.025;
    grosorMarco = altoCanvas * 0.025;

    jugadorX = margenLateral + 15;
    computadoraX = anchoCanvas - 25;
}

function windowResized() {
    ajustarCanvas();
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
    computadoraY = constrain(computadoraY, grosorMarco, height - grosorMarco - altoRaqueta);
    botonReinicio.position((width - botonReinicio.width) / 2, height - margenVertical - 40);
    botonMenu.position((width - botonMenu.width) / 2, height - margenVertical - 80);
    if (botonIniciar) botonIniciar.position((width - botonIniciar.width) / 2, height / 2 + 40);
    botonPausa.position(margenLateral, margenVertical);

    // Ajuste de la posición de los botones para el movimiento en dispositivos móviles
    if (windowWidth < 600) {
        botonArriba.position(jugadorX + anchoRaqueta / 2 - 15, jugadorY - 100);  // Ajustado aquí
        botonAbajo.position(jugadorX + anchoRaqueta / 2 - 15, jugadorY + altoRaqueta - 30);  // Ajustado aquí
    }
}

function mostrarMenu() {
    background(fondo);
    textSize(64);
    textAlign(CENTER, CENTER);
    fill(color("#ffffff"));
    text("PONG", width / 2, height / 2 - 60);
}

function dibujarMarcos() {
    fill(color("#000000"));
    rect(0, 0, width, grosorMarco);
    rect(0, height - grosorMarco, width, grosorMarco);
}

function dibujarRaquetas() {
    image(barraJugador, jugadorX, jugadorY, anchoRaqueta, altoRaqueta);
    image(barraComputadora, computadoraX, computadoraY, anchoRaqueta, altoRaqueta);
}

function dibujarPelota() {
    push();
    translate(pelotaX, pelotaY);
    rotate(anguloPelota);
    imageMode(CENTER);
    image(bola, 0, 0, diametroPelota, diametroPelota);
    pop();
}

function mostrarPuntaje() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(color("#ffffff"));
    text(jugadorScore, width / 4, grosorMarco * 3);
    text(computadoraScore, 3 * width / 4, grosorMarco * 3);
}

function mostrarTiempoRestante() {
    let tiempoRestante = duracionPartida - (millis() - tiempoInicial);
    let minutos = floor(tiempoRestante / 60000);
    let segundos = floor((tiempoRestante % 60000) / 1000);
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(color("#ffffff"));
    text(nf(minutos, 2) + ':' + nf(segundos, 2), width / 2, grosorMarco * 3);
}

function moverPelota() {
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    let velocidadTotal = sqrt(velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY);
    anguloPelota += velocidadTotal * 0.05;

    if (pelotaY - diametroPelota / 2 < grosorMarco || 
        pelotaY + diametroPelota / 2 > height - grosorMarco) {
        velocidadPelotaY *= -1;
    }
}

function moverComputadora() {
    if (pelotaY > computadoraY + altoRaqueta / 2) {
        computadoraY += 4;
    } else if (pelotaY < computadoraY + altoRaqueta / 2) {
        computadoraY -= 4;
    }
    computadoraY = constrain(computadoraY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function verificarColisiones() {
    if (pelotaX - diametroPelota / 2 < jugadorX + anchoRaqueta && 
        pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
        let puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3;
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX *= -1;
        sonidoRebote.play();
    }

    if (pelotaX + diametroPelota / 2 > computadoraX && 
        pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {
        let puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3;
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX *= -1;
        sonidoRebote.play();
    }

    if (pelotaX < 0) {
        computadoraScore++;
        sonidoGol.play();
        narrarMarcador();
        resetPelota();
    } else if (pelotaX > width) {
        jugadorScore++;
        sonidoGol.play();
        narrarMarcador();
        resetPelota();
    }
}

function verificarTiempo() {
    if (millis() - tiempoInicial >= duracionPartida) {
        mostrarGanador();
        estadoJuego = "menu";
        botonReinicio.hide();
        botonMenu.hide();
        botonIniciar.show();
        botonPausa.hide();
        resetPelota();
        jugadorScore = 0;
        computadoraScore = 0;
    }
}

function mostrarGanador() {
    let mensaje;
    if (jugadorScore > computadoraScore) {
        mensaje = `¡Ganaste! Marcador final: ${jugadorScore} a ${computadoraScore}`;
    } else if (jugadorScore < computadoraScore) {
        mensaje = `Perdiste. Marcador final: ${jugadorScore} a ${computadoraScore}`;
    } else {
        mensaje = `Es un empate. Marcador final: ${jugadorScore} a ${computadoraScore}`;
    }
    let narrador = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(narrador);
}

function narrarMarcador() {
    let narrador = new SpeechSynthesisUtterance(`El marcador es ${jugadorScore} a ${computadoraScore}`);
    window.speechSynthesis.speak(narrador);
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
}

// Funciones para mover la raqueta con los botones
function moverArriba() {
    jugadorY -= 20;
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function moverAbajo() {
    jugadorY += 20;
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        jugadorY -= 50;
    } else if (keyCode === DOWN_ARROW) {
        jugadorY += 50;
    }
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}
