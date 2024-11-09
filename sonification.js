// Importar datos de montañas rusas desde coaster_db.js
const coasters = coasterData;

// Rango de frecuencias (en Hz) para la sonificación
const minFrequency = 200; // Frecuencia mínima
const maxFrequency = 800; // Frecuencia máxima

// Mapea la velocidad de una montaña rusa a una frecuencia de sonido
function mapSpeedToFrequency(speed) {
    const minSpeed = Math.min(...coasters.map(coaster => coaster.Speed));
    const maxSpeed = Math.max(...coasters.map(coaster => coaster.Speed));
    return ((speed - minSpeed) / (maxSpeed - minSpeed)) * (maxFrequency - minFrequency) + minFrequency;
}

// Reproduce un sonido con efecto Doppler basado en la velocidad proporcionada usando Web Audio API
function playSoundForSpeed(speed) {
    const frequency = mapSpeedToFrequency(speed);

    // Crear contexto de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Crear oscilador para el tono principal
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine"; // Tipo de onda: seno

    // Configurar frecuencia inicial para el efecto Doppler
    oscillator.frequency.setValueAtTime(frequency * 1.2, audioContext.currentTime);

    // Crear ganancia para controlar el volumen
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volumen inicial

    // Conectar el oscilador a la ganancia y luego a la salida de audio
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Iniciar el oscilador
    oscillator.start();

    // Mantener el tono alto y luego hacer que descienda en frecuencia para el efecto Doppler
    oscillator.frequency.exponentialRampToValueAtTime(frequency, audioContext.currentTime + 0.5);

    // Suavizar el apagado del volumen después del descenso de frecuencia
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

    // Detener el oscilador después de que el sonido se desvanece
    oscillator.stop(audioContext.currentTime + 0.8);
}
