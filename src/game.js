const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Paneles informativos
const infoLevel = document.getElementById('infoLevel');
const infoTime = document.getElementById('infoTime');
const infoMsg = document.getElementById('infoMsg');
const btnReset = document.getElementById('btnReset');

const rows = 24;
const cols = 25;
let cellSize = Math.floor(Math.min(canvas.width / cols, canvas.height / rows));

// --- Carga de imágenes ---
const wallTexture = new Image();
wallTexture.src = 'https://iili.io/FuUelwv.png';
const pathTexture = new Image();
pathTexture.src = 'https://iili.io/FurlViG.png';
const mouseTexture = new Image();
mouseTexture.src = 'https://iili.io/Fug9Qa9.png';
const cheeseTexture = new Image();
cheeseTexture.src = 'https://iili.io/Fug9N4I.png'; 

let wallTextureLoaded = false, pathTextureLoaded = false, mouseTextureLoaded = false;
let cheeseTextureLoaded = false;

wallTexture.onload = () => { wallTextureLoaded = true; drawMaze(); }
pathTexture.onload = () => { pathTextureLoaded = true; drawMaze(); }
mouseTexture.onload = () => { mouseTextureLoaded = true; drawMaze(); }
cheeseTexture.onload = () => { cheeseTextureLoaded = true; drawMaze(); }


// Laberintos 
const laberintos = [
    // Laberinto 1
    [
        [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        [1,0,0,4,4,0,0,0,0,0,3,0,4,4,4,4,0,0,0,3,0,0,0,0,4],
        [4,4,0,4,4,0,4,4,4,4,4,0,0,0,0,0,0,4,0,4,4,4,4,0,4],
        [4,4,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,4,4,4,0,0,4],
        [4,4,0,4,4,4,0,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,0,4,4],
        [4,4,0,4,4,0,0,0,0,4,4,4,4,4,0,0,0,0,4,4,4,4,0,4,4],
        [4,4,0,4,4,0,4,4,0,0,0,4,4,4,0,4,4,4,4,4,4,4,0,4,4],
        [4,4,0,4,4,0,4,4,4,4,0,4,4,4,0,0,0,0,0,0,0,4,0,0,4],
        [4,4,0,0,0,0,4,4,4,4,0,4,4,4,4,4,4,4,4,4,0,4,4,4,4],
        [4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,9],
        [4,4,4,4,4,0,4,4,4,4,0,4,4,4,0,0,0,0,0,0,0,4,4,4,4],
        [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4],
        [4,4,0,4,4,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,4],
        [4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,4],
        [4,4,0,0,0,0,4,4,4,4,0,0,0,3,0,0,4,4,0,4,4,4,4,4,4],
        [4,0,0,4,0,4,4,4,0,0,0,4,4,4,4,0,4,4,0,0,0,0,0,0,4],
        [4,0,4,4,0,4,4,4,0,4,4,4,4,4,4,0,4,4,0,4,4,4,4,4,0],
        [4,0,4,4,0,0,0,0,0,4,4,0,0,0,0,0,4,4,0,4,4,4,4,4,0],
        [4,0,4,4,0,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4,4,4],
        [4,0,4,4,0,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,0,0,4],
        [4,0,4,4,0,4,4,4,0,0,0,0,4,4,4,4,4,4,0,4,4,4,0,4,4],
        [4,0,0,0,0,4,4,4,0,4,4,4,4,4,4,4,4,4,0,0,3,0,0,4,4],
        [4,3,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,4],
        [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
    ],
    // Laberinto 2
    [
        [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        [4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,4,4,4,4],
        [4,4,4,4,0,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4],
        [4,4,4,4,0,4,4,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4],
        [4,3,0,0,0,0,0,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4],
        [4,0,4,4,4,4,0,4,4,4,4,4,4,0,0,0,3,0,0,0,0,4,4,4,4],
        [4,0,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4],
        [4,0,0,0,0,4,0,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4],
        [4,4,4,4,0,4,0,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4],
        [1,0,4,4,0,4,0,4,4,4,4,4,4,0,4,4,4,4,4,4,0,4,4,4,4],
        [4,0,4,4,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,9],
        [4,0,4,4,0,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,4],
        [4,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4],
        [4,3,4,4,0,4,0,4,4,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4],
        [4,0,4,4,0,4,0,4,4,4,4,4,4,4,4,4,4,4,4,0,4,4,4,4,4],
        [4,0,4,4,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,4,4,4,4,4],
        [4,0,4,4,0,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        [4,0,4,4,0,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        [4,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4],
        [4,0,4,4,4,4,4,4,4,0,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4],
        [4,0,4,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4],
        [4,0,4,0,4,4,0,4,4,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        [4,3,0,0,4,4,0,3,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
    ]
];



function encontrarPosicion(laberinto, valor) {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (laberinto[y][x] === valor) return { x, y };
        }
    }
    return null;
}


let nivelActual = 0;
let mouse = encontrarPosicion(laberintos[nivelActual], 1);
let salidaActual = encontrarPosicion(laberintos[nivelActual], 9);

let startTime = null, elapsedTime = 0, timerInterval = null, juegoCompletado = false;

const originalLaberintos = JSON.parse(JSON.stringify(laberintos));

// Inicializar conteo de quesos
let quesosPorNivel = laberintos.map(contarQuesos);
let quesosComidos = 0;
let puntaje = 0;

// Variables para controlar la repetición
let touchTimer = null;
let touchInterval = null;
let currentDirection = null;
const repeatDelay = 100; // ms antes de comenzar a repetir
const repeatInterval = 50; // ms entre movimientos





// Función para iniciar repetición de movimiento
function startMoveRepeat(direction) {
    // Movimiento inmediato al primer toque
    moveMouse(direction);
    
    // Configurar repetición después de un breve delay
    touchTimer = setTimeout(() => {
        touchInterval = setInterval(() => {
            moveMouse(direction);
        }, repeatInterval);
    }, repeatDelay);
}

// Función para detener repetición
function stopMoveRepeat() {
    clearTimeout(touchTimer);
    clearInterval(touchInterval);
    currentDirection = null;
}


// Función para contar quesos
function contarQuesos(laberinto) {
    let count = 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (laberinto[y][x] === 3) count++;
        }
    }
    return count;
}



// --- Responsive canvas ---
function resizeCanvas() {
    let size = Math.min(window.innerWidth * 0.96, window.innerHeight * 0.96, 480);
    canvas.width = canvas.height = size;
    cellSize = Math.floor(size / Math.max(cols, rows));
    drawMaze();
}



// Dibujo del laberinto con texturas
// --- Dibujo principal ---
function drawMaze() {
    if (!wallTextureLoaded || !pathTextureLoaded || !mouseTextureLoaded) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const lab = laberintos[nivelActual];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let px = x * cellSize, py = y * cellSize;
            if (lab[y][x] === 4)
                ctx.drawImage(wallTexture, 0, 0, 22, 22, px, py, cellSize, cellSize);
            else if (lab[y][x] === 0 || lab[y][x] === 1 || lab[y][x] === 9)
                ctx.drawImage(pathTexture, 0, 0, 22, 22, px, py, cellSize, cellSize);
            else if (lab[y][x] === 3) 
                ctx.drawImage(cheeseTexture,0, 0, 22, 22,px, py,cellSize, cellSize); 
        }
    }
    // Ratón
    ctx.drawImage(mouseTexture, 0, 0, 22, 22, mouse.x * cellSize, mouse.y * cellSize, cellSize, cellSize);
    // Panel informativo
    updateInfoPanel();
}

// --- Panel informativo ---
function updateInfoPanel(msg = '') {
    infoLevel.textContent = `Nivel: ${nivelActual + 1} / ${laberintos.length}`;
    infoTime.textContent = `Tiempo: ${formatTime(elapsedTime)}`;
    infoMsg.innerHTML = `Quesos: ${quesosComidos} | Puntos: ${puntaje}<br>${msg}`;
}

function formatTime(ms) {
    const t = Math.floor(ms / 1000);
    const min = String(Math.floor(t / 60)).padStart(2, '0');
    const sec = String(t % 60).padStart(2, '0');
    return `${min}:${sec}`;
}

// --- Timer ---
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        if (!juegoCompletado) {
            elapsedTime = Date.now() - startTime;
            updateInfoPanel();
            drawMaze();
        }
    }, 100);
}
function stopTimer() {
    clearInterval(timerInterval);
    juegoCompletado = true;
}

// --- Movimiento y controles ---
function moveMouse(direction) {
    if (juegoCompletado) return;
    const newPos = {...mouse};
    if (direction === 'up') newPos.y--;
    if (direction === 'down') newPos.y++;
    if (direction === 'left') newPos.x--;
    if (direction === 'right') newPos.x++;
    const laberintoActual = laberintos[nivelActual];
    if (
    newPos.x >= 0 && newPos.x < cols &&
    newPos.y >= 0 && newPos.y < rows &&
    (laberintoActual[newPos.y][newPos.x] === 0 ||
     laberintoActual[newPos.y][newPos.x] === 1 ||
     laberintoActual[newPos.y][newPos.x] === 9 ||
     laberintoActual[newPos.y][newPos.x] === 3)
    ) { mouse = newPos; }


     // Comer queso si está en la posición actual
    if (laberintoActual[mouse.y][mouse.x] === 3) {
        laberintoActual[mouse.y][mouse.x] = 0;
        quesosComidos++;
        puntaje += 100;
        quesosPorNivel[nivelActual]--;
        updateInfoPanel();
    }

    // Solo permite terminar nivel si no quedan quesos
    if (
        mouse.x === salidaActual.x && mouse.y === salidaActual.y &&
        quesosPorNivel[nivelActual] === 0
    ) {
        nivelActual++;
        if (nivelActual < laberintos.length) {
            mouse = encontrarPosicion(laberintos[nivelActual], 1);
            salidaActual = encontrarPosicion(laberintos[nivelActual], 9);
            quesosPorNivel[nivelActual] = contarQuesos(laberintos[nivelActual]);
            setTimeout(drawMaze, 500);
        } else {
            stopTimer();
            
        }
    }
    
}


// Nuevos controles táctiles con repetición
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;
    
    // Centro del canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Determinar dirección
    const dx = touchX - centerX;
    const dy = touchY - centerY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        currentDirection = dx > 0 ? 'right' : 'left';
    } else {
        currentDirection = dy > 0 ? 'down' : 'up';
    }
    
    startMoveRepeat(currentDirection);
}, { passive: false });

// Eventos para detener la repetición al soltar
canvas.addEventListener('touchend', stopMoveRepeat);
canvas.addEventListener('touchcancel', stopMoveRepeat);
canvas.addEventListener('touchleave', stopMoveRepeat);


// --- Controles de teclado ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') moveMouse('up');
    if (e.key === 'ArrowDown') moveMouse('down');
    if (e.key === 'ArrowLeft') moveMouse('left');
    if (e.key === 'ArrowRight') moveMouse('right');
});

// Función de reinicio completo
function resetGame() {
    // Restaurar laberintos originales
    for (let i = 0; i < laberintos.length; i++) {
        laberintos[i] = JSON.parse(JSON.stringify(originalLaberintos[i]));
    }
    
    // Reiniciar variables de estado
    nivelActual = 0;
    mouse = encontrarPosicion(laberintos[nivelActual], 1);
    salidaActual = encontrarPosicion(laberintos[nivelActual], 9);
    quesosComidos = 0;
    puntaje = 0;
    elapsedTime = 0;
    juegoCompletado = false;
    
    // Recuperar conteo original de quesos
    quesosPorNivel = laberintos.map(contarQuesos);
    
    // Reiniciar interfaz
    updateInfoPanel('');
    if (timerInterval) clearInterval(timerInterval);
    startTimer();
    drawMaze();
}

// --- Botón de reinicio ---
// Asignar evento al botón de reinicio
btnReset.addEventListener('click', resetGame);

// --- Inicialización ---
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', () => {
    resizeCanvas();
    startTimer();
    drawMaze();

    quesosPorNivel = laberintos.map(contarQuesos);
    quesosComidos = 0;
    puntaje = 0;

});