import Arduino from './js/arduino.js';
import Protobject from './js/protobject.js';
import TextToSpeech from './js/textToSpeech.js';

Arduino.start();
Protobject.onReceived((coaster) => {
  
	Arduino.servoWrite({ pin: 6, value: (coaster.Speed/240)*700 });
  TextToSpeech.play("es-CL","Has seleccionado la motaña rusa" + coaster.coaster_name + ". Está ubicada en" + coaster.Location +", en el parque" + coaster.Park +"Su velocidad máxima es de"+coaster.Speed +"kilómetros por hora." );
    TextToSpeech.onTTSEnd(() => {
    console.log("Speech playback ended.");
      Arduino.servoWrite({ pin: 6, value: 0});
});
  
});