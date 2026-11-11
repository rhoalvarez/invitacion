const surpriseBtn = document.getElementById("surpriseBtn");
const message = document.getElementById("message");
const musicBtn = document.getElementById("musicBtn");
const confettiLayer = document.getElementById("confettiLayer");

// ==================================
// 🌻 CONFETI DEL JARDÍN
// ==================================

function launchConfetti(amount = 120) {

    const colors = [
        "#78b84d",
        "#ffd166",
        "#ff78a6",
        "#8ed8c9",
        "#b49bfa",
        "#ff9d70",
        "#ffffff"
    ];

    for (let i = 0; i < amount; i++) {

        const piece = document.createElement("span");

        piece.className = "confetti";

        piece.style.left = Math.random() * 100 + "vw";

        piece.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.setProperty(
            "--drift",
            (Math.random() * 220 - 110) + "px"
        );

        piece.style.animationDuration =
            (3 + Math.random() * 3) + "s";

        piece.style.animationDelay =
            (Math.random() * 0.8) + "s";

        confettiLayer.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 7000);
    }
}


// ==================================
// 🎁 DESBLOQUEAR SORPRESA
// ==================================

surpriseBtn.addEventListener("click", () => {

    message.classList.remove("hidden");

    surpriseBtn.textContent = "🏆 ¡MISIÓN CUMPLIDA!";

    surpriseBtn.disabled = true;

    launchConfetti(180);

    message.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

});


// ==================================
// 🎵 MÚSICA DE CUMPLEAÑOS
// ==================================

let audioContext = null;

let musicTimer = null;

let noteIndex = 0;

let musicOn = false;


// Melodía alegre

const melody = [

    [523.25, 0.22],
    [659.25, 0.22],
    [783.99, 0.22],
    [659.25, 0.22],

    [698.46, 0.22],
    [783.99, 0.22],
    [880.00, 0.38],
    [783.99, 0.22],

    [659.25, 0.22],
    [587.33, 0.22],
    [523.25, 0.38],
    [587.33, 0.22],

    [659.25, 0.22],
    [698.46, 0.22],
    [783.99, 0.45],

    [0, 0.18]

];


// Reproducir nota

function playNote(frequency, duration) {

    if (!audioContext || frequency === 0) return;

    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.10,
        audioContext.currentTime + 0.025
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);

    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration + 0.03
    );

}


// Reproducir siguiente nota

function playNextNote() {

    if (!musicOn) return;

    const [frequency, duration] =
        melody[noteIndex % melody.length];

    playNote(frequency, duration);

    noteIndex++;

    musicTimer = setTimeout(
        playNextNote,
        duration * 1000 + 35
    );

}


// ==================================
// 🔊 BOTÓN DE MÚSICA
// ==================================

musicBtn.addEventListener("click", async () => {

    if (!musicOn) {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            musicBtn.textContent = "Audio no disponible";
            return;
        }

        audioContext = audioContext || new AudioContextClass();

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        musicOn = true;

        noteIndex = 0;

        musicBtn.textContent = "🔇 Apagar musiquita";

        musicBtn.setAttribute("aria-pressed", "true");

        playNextNote();

    } else {

        musicOn = false;

        clearTimeout(musicTimer);

        if (audioContext) {
            await audioContext.suspend();
        }

        musicBtn.textContent = "🎵 Activar musiquita";

        musicBtn.setAttribute("aria-pressed", "false");

    }

});