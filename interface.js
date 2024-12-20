// Importar las bibliotecas necesarias
import Knob from './js/knob.js';
import Protobject from './js/protobject.js';
import { narrarYSonificar } from './sonification.js'; // Importar narración y sonificación

// Estilo CSS actualizado para los detalles
const style = document.createElement('style');
style.innerHTML = `
  * {
      font-family: Arial, sans-serif;
  }

  #mapContainer {
      width: 1200px;  
      height: 500px; 
      margin: 0 auto;
      position: relative;
      overflow: hidden;
  }

  #coastersList {
      width: 285px;
      padding: 2px;
      overflow-y: auto;
      font-size: 20px;
      font-weight: 200;
      color: #777777;
      position: absolute;
      top: 20px;
      left: 0px;
  }

  #coastersList h2 {
      margin-bottom: 15px;
  }

  #continentHeader {
      font-size: 22px;
      font-weight: bold;
      color: #333;
      margin-top: 20px;
      text-decoration: underline;
  }

  #coastersList div {
      margin-bottom: 10px;
      cursor: pointer;
  }

  #coastersList div:hover {
      color: red;
  }

  #details {
      padding: 20px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      display: none;
      max-width: 300px;
      position: absolute;
      z-index: 10;
      width: 300px;
  }

`;

document.head.appendChild(style);

// Crear dinámicamente el contenido HTML
document.body.innerHTML = `
  <div id="title">
    <h1 style="text-align: center;">Selecciona una montaña rusa</h1>
  </div>
  <div id="coastersList"></div>
  <div id="details"></div>
`;

// Variables de elementos DOM
const coastersList = document.getElementById('coastersList');
const details = document.getElementById('details');

// Función para agrupar las montañas rusas por continente
function groupByContinent(coasters) {
  return coasters.reduce((acc, coaster) => {
    const continent = coaster.Continent;
    if (!acc[continent]) {
      acc[continent] = [];
    }
    acc[continent].push(coaster);
    return acc;
  }, {});
}

// Función para mostrar las montañas rusas
function showCoasters(coasters) {
  const groupedCoasters = groupByContinent(coasters);

  coastersList.innerHTML = '';

  // Mostrar montañas rusas por continente
  Object.keys(groupedCoasters).forEach(continent => {
    const continentHeader = document.createElement('div');
    continentHeader.id = 'continentHeader';
    continentHeader.innerText = `Top 10 Montañas Rusas en ${continent.charAt(0).toUpperCase() + continent.slice(1)}`;
    coastersList.appendChild(continentHeader);

    const continentCoasters = groupedCoasters[continent];
    continentCoasters.sort((a, b) => b.Speed - a.Speed); // Ordenar por velocidad

    continentCoasters.forEach((coaster, index) => {
      const listItem = document.createElement('div');
      listItem.innerHTML = `
        <span>${index + 1}° ${coaster.coaster_name}</span>
      `;
      
      listItem.addEventListener('click', (event) => {
        // Mostrar detalles de la montaña rusa seleccionada cerca del clic
        showDetails(coaster, event);
        
        // Enviar la información al Arduino (puedes adaptar esta parte)
        sendDataToArduino(coaster);
      });

      coastersList.appendChild(listItem);
    });
  });
}

// Función para mostrar detalles de la montaña rusa seleccionada
function showDetails(coaster, event) {
  details.style.display = 'block';
  details.innerHTML = `
    <h2>${coaster.coaster_name}</h2>
    <p><strong>Ubicación:</strong> ${coaster.Location}</p>
    <p><strong>Parque:</strong> ${coaster.Park}</p>
    <p><strong>Velocidad:</strong> ${coaster.Speed} km/h</p>
  `;

  // Obtener las coordenadas del elemento clicado
  const rect = event.target.getBoundingClientRect();

  // Posición horizontal ajustada al margen derecho
  details.style.left = `${window.innerWidth - details.offsetWidth - 10}px`;

  // Calcular la posición vertical para los detalles
  let topPosition = rect.top + window.scrollY;

  // Verificar si la posición está demasiado baja
  const maxVerticalPosition = window.innerHeight - details.offsetHeight - 10;  // Máxima posición permitida
  if (topPosition + details.offsetHeight > window.innerHeight + window.scrollY) {
    // Si el detalle no cabe en la pantalla, ajustarlo para que se quede visible
    topPosition = window.scrollY + window.innerHeight - details.offsetHeight - 10;
  }

  // Ajustar la posición vertical de los detalles
  details.style.top = `${topPosition}px`;
}

// Simulación de enviar datos al Arduino
function sendDataToArduino(coaster) {
  console.log('Enviando al Arduino:', coaster);
  // Aquí pondrías el código necesario para comunicarte con el Arduino, por ejemplo, usando WebSockets o fetch
}

// Crear la perilla para control manual (si es necesario)
const perilla = new Knob({ min: -500, max: 500 });

// Datos de ejemplo de montañas rusas (reemplaza con tus datos reales si no están disponibles globalmente)
const coasters = [
    {
        coaster_name: "Kingda Ka",
        Speed: 206,
        Park: "Six Flags Great Adventure",
        Location: "Jackson, New Jersey, United States",
    },
    {
        coaster_name: "Formula Rossa",
        Speed: 240,
        Park: "Ferrari World Abu Dhabi",
        Location: "Abu Dhabi, United Arab Emirates",
    },
    {
        coaster_name: "Steel Dragon 2000",
        Speed: 152.9,
        Park: "Nagashima Spa Land",
        Location: "Kuwana, Mie, Japan",
    },
];

// Crear una lista interactiva para mostrar las montañas rusas
const coasterListContainer = document.createElement('div');
coasterListContainer.id = 'coasterList';
document.body.appendChild(coasterListContainer);

// Función para mostrar las montañas rusas
function displayCoasters() {
    coasterListContainer.innerHTML = '<h2>Selecciona una montaña rusa:</h2>';
    coasters.forEach((coaster, index) => {
        const coasterItem = document.createElement('div');
        coasterItem.innerHTML = `<p>${index + 1}. ${coaster.coaster_name} (${coaster.Speed} km/h)</p>`;
        coasterItem.style.cursor = 'pointer';

        // Añadir evento de clic
        coasterItem.addEventListener('click', () => {
            sendSpeedToServo(coaster.Speed); // Enviar velocidad al servo
            narrarYSonificar(coaster); // Activar narración y sonificación
        });

        coasterListContainer.appendChild(coasterItem);
    });
}

// Función para enviar la velocidad al Arduino
function sendSpeedToServo(speed) {
    console.log(`Enviando velocidad: ${speed} al servo`);
    Protobject.send({ speed }).to('arduino.js'); // Enviar la velocidad al Arduino
}

// Iniciar la perilla para control manual (opcional)
perilla.onChange((value) => {
    console.log(`Control manual: velocidad = ${value}`);
    Protobject.send({ speed: value }).to('arduino.js');
});

// Mostrar la lista de montañas rusas al cargar la página
displayCoasters();

// Llamada inicial para mostrar las montañas rusas
const coasterData = [
    {
        "coaster_name": "Kingda Ka",
        "Lat": 40.139426614825204, 
        "Lon": -74.4365807621081,
        "Speed": 206,
        "Continent": "north america",
        "Park": "Six Flags Great Adventure",
        "Location": "Jackson, New Jersey, United States",
    },
    {
        "coaster_name": "Red Force",
        "Lat": 40, 
        "Lon":  0,
        "Speed": 180,
        "Park": "Ferrari Land",
        "Continent": "europe",
        "Location": "Salou, Catalonia, Spain",
    },
    {
        "coaster_name": "Superman: Escape from Krypton",
        "Lat": 34.42420622216382, 
        "Lon": -117,
        "Speed": 160.9,
        "Park": "Six Flags Magic Mountain",
        "Continent": "north america",
        "Location": "Valencia, California, United States",
    },
    {
        "coaster_name": "Steel Dragon 2000",
        "Lat": 35.032967693470674, 
        "Lon": 136.73319273576908,
        "Speed": 152.9,
        "Park": "Nagashima Spa Land",
        "Continent": "asia",
        "Location": "Kuwana, Mie, Japan",
    },
    {
        "coaster_name": "Fury 325",
        "Lat": 35.10570140258403, 
        "Lon": -80.94252277772125,
        "Speed": 153,
        "Park": "Carowinds",
        "Continent": "north america",
        "Location": "Charlotte, North Carolina, United States",
    },
    {
        "coaster_name": "Millennium Force",
        "Lat": 41.4816668466911,
        "Lon": -82.68821643504202,
        "Speed": 150,
        "Park": "Cedar Point",
        "Continent": "north america",
        "Location": "Sandusky, Ohio, United States",
    },
    {
        "coaster_name": "Leviathan",
        "Lat": 43.84462591487945, 
        "Lon": -79.54232790421617,
        "Speed": 148,
        "Park": "Canada's Wonderland",
        "Continent": "north america",
        "Location": "Vaughan, Ontario, Canada",
    },
    {
        "coaster_name": "Orion",
        "Lat": 39.34283232625962, 
        "Lon": -84.262733319824,
        "Speed": 146,
        "Park": "Kings Island",
        "Continent": "north america",
        "Location": "Mason, Ohio, United States",
    },
    {
        "coaster_name": "Hyperion",
        "Lat": 49, 
        "Lon": 19.411642915341385,
        "Speed": 142,
        "Park": "Energylandia",
        "Continent": "europe",
        "Location": "Zator, , Malopolskie, Poland",
    },
    {
        "coaster_name": "Formula Rossa",
        "Lat": 24.484390359075295, 
        "Lon": 54.61241043716389,
        "Speed": 240,
        "Park": "Ferrari World Abu Dhabi",
        "Continent": "asia",
        "Location": "Abu Dhabi, Abu Dhabi, United Arab Emirates",
    },
    {
        "coaster_name": "Pantherian",
        "Lat": 37.837562607933606,
        "Lon": -77.43981971990725,
        "Speed": 144.8,
        "Park": "Kings Dominion",
        "Continent": "north america",
        "Location": "Doswell, Virginia, United States",
    },
    {
        "coaster_name": "Phantom's Revenge",
        "Lat": 40.389274603155265,
        "Lon": -79.86593036080696,
        "Speed": 136.8,
        "Park": "Kennywood",
        "Continent": "north america",
        "Location": "West Mifflin, Pennsylvania, United States",
    },
    {
        "coaster_name": "Goliath",
        "Lat": 34.4271249632204,
        "Lon": -120,
        "Speed": 136.8,
        "Park": "Six Flags Magic Mountain",
        "Continent": "north america",
        "Location": "Valencia, California, United States",
    },
    {
        "coaster_name": "Titan",
        "Lat": 32.755812797877105,
        "Lon": -97.07424413365949,
        "Speed": 136.8,
        "Park": "Six Flags Over Texas",
        "Continent": "north america",
        "Location": "Arlington, Texas, United States",
    },
    {
        "coaster_name": "Tower of Terror",
        "Lat": -27,
        "Lon": 26.5,
        "Speed": 95,
        "Park": "Gold Reef City",
        "Continent": "africa",
        "Location": "Johannesburg, Gauteng, South Africa",
    },
    {
        "coaster_name": "Golden Loop",
        "Lat": -27.5,
        "Lon": 30,
        "Speed": 91.7,
        "Park": "Gold Reef City",
        "Continent": "africa",
        "Location": "Johannesburg, Gauteng, South Africa",
    },
    {
        "coaster_name": "Anaconda",
        "Lat": -25,
        "Lon": 29,
        "Speed": 90,
        "Park": "Gold Reef City",
        "Continent": "africa",
        "Location": "Johannesburg, Gauteng, South Africa",
    },
    {
        "coaster_name": "Roller Coaster",
        "Lat": 29.966348962952654,
        "Lon": 29,
        "Speed": 80,
        "Park": "Dream Park",
        "Continent": "africa",
        "Location": "6th of October City, Giza, Egypt",
    },
    {
        "coaster_name": "Gwazi",
        "Lat": -24.78544910788251,
        "Lon": 25.816269508541378,
        "Speed": 77,
        "Park": "Lion Park Resort",
        "Continent": "africa",
        "Location": "Gaborone, South-East, Botswana",
    },
    {
        "coaster_name": "Boomerang",
        "Lat": 30.172228198086767,
        "Lon": 31.47674268118208,
        "Speed": 75.6,
        "Park": "Gero Land",
        "Continent": "africa",
        "Location": "Cairo, Cairo, Egypt",
    },
    {
        "coaster_name": "Montanha da Leba",
        "Lat": -8.94921769605836,
        "Lon": 13.29296537301289,
        "Speed": 75,
        "Park": "Ulengo Center Glakeni",
        "Continent": "africa",
        "Location": "Luanda, Luanda, Angola",
    },
    {
        "coaster_name": "Serpent",
        "Lat": 33.58125903547353,
        "Lon": -7.690226830683854,
        "Speed": 70,
        "Park": "Sindibad",
        "Continent": "africa",
        "Location": "Casablanca, Casablanca-Settat, Morocco",
    },
    {
        "coaster_name": "Jozi Express",
        "Lat": -26.234674301139655,
        "Lon": 28.01578416931615,
        "Speed": 68,
        "Park": "Gold Reef City",
        "Continent": "africa",
        "Location": "Johannesburg, Gauteng, South Africa",
    },
    {
        "coaster_name": "Dragon Force",
        "Lat": 28,
        "Lon": 31.45050908465807,
        "Speed": 63,
        "Park": "El Malahy",
        "Continent": "africa",
        "Location": "Cairo, Cairo, Egypt",
    },
    {
        "coaster_name": "Coaster Through the Clouds",
        "Lat": 28.57785624350408,
        "Lon": 115.78033554232901,
        "Speed": 136.0,
        "Park": "Nanchang Sunac Land",
        "Continent": "asia",
        "Location": "Xinjian, Nanchang, Jiangxi, China",
    },
    {
        "coaster_name": "Shooting Roller Coaster",
        "Lat": 37.04803801690364,
        "Lon": 118.45533828835484,
        "Speed": 135.0,
        "Park": "Sun Tzu Cultural Park",
        "Continent": "asia",
        "Location": "Guangrao, Dongying, Shandong, China",
    },
    {
        "coaster_name": "Extreme Rusher",
        "Lat": 39.865594397594116,
        "Lon": 116.48965737301288,
        "Speed": 133.6,
        "Park": "Happy Valley",
        "Continent": "asia",
        "Location": "Chaoyang, Beijing, China",
    },
    {
        "coaster_name": "Bullet Coaster",
        "Lat": 22.54648408252729,
        "Lon": 113.97630471164518,
        "Speed": 133.6,
        "Park": "Happy Valley",
        "Continent": "asia",
        "Location": "Nanshan, Shenzhen, Guangdong, China",
    },
    {
        "coaster_name": "OCT Thrust SSC1000",
        "Lat": 30.59611917306897,
        "Lon": 114.38848525397422,
        "Speed": 133.6,
        "Park": "Happy Valley",
        "Continent": "asia",
        "Location": "Hongshan, Wuhan, Hubei, China",
    },
    {
        "coaster_name": "Fujiyama",
        "Lat": 35,
        "Lon": 138.77731208465806,
        "Speed": 130,
        "Park": "Fuji-Q Highland",
        "Continent": "asia",
        "Location": "Fujiyoshida, Yamanashi, Japan",
    },
    {
        "coaster_name": "Thunder Dolphin",
        "Lat": 37,
        "Lon": 139.7532526269871,
        "Speed": 130,
        "Park": "Tokyo Dome City ",
        "Continent": "asia",
        "Location": "Bunkyo, Tokyo, Japan",
    },
    {
        "coaster_name": "Beyond the Cloud",
        "Lat": 31.327144600547822,
        "Lon": 120.46992745767096,
        "Speed": 129.6,
        "Park": "Suzhou Amusement Land Forest World",
        "Continent": "asia",
        "Location": "Huqiu, Suzhou, Jiangsu, China",
    },
    {
        "coaster_name": "DC Rivals HyperCoaster",
        "Lat": -28,
        "Lon": 152.5,
        "Speed": 115,
        "Park": "Warner Bros. Movie World",
        "Continent": "oceania",
        "Location": "Gold Coast, Queensland, Australia",
    },
    {
        "coaster_name": "Project Zero",
        "Lat": -38.06842313902613,
        "Lon": 145.66037745767096,
        "Speed": 105,
        "Park": "Gumbuya World",
        "Continent": "oceania",
        "Location": "Tynong , Victoria, Australia",
    },
    {
        "coaster_name": "Steel Taipan",
        "Lat": -29,
        "Lon": 152.5,
        "Speed": 105,
        "Park": "Dreamworld",
        "Continent": "oceania",
        "Location": "Coomera, Queensland, Australia",
    },
    {
        "coaster_name": "Superman Escape",
        "Lat": -26,
        "Lon": 152.5,
        "Speed": 100,
        "Park": "Warner Bros. Movie World",
        "Continent": "oceania",
        "Location": "Gold Coast, Queensland, Australia",
    },
    {
        "coaster_name": "Gold Coaster",
        "Lat": -27,
        "Lon": 153.3153233730129,
        "Speed": 85,
        "Park": "Dreamworld",
        "Continent": "oceania",
        "Location": "Coomera, Queensland, Australia",
    },
    {
        "coaster_name": "Abyss",
        "Lat": -32.09506390129051,
        "Lon": 115.81702245767096,
        "Speed": 85,
        "Park": "Adventure World",
        "Continent": "oceania",
        "Location": "Bibra Lake, Western Australia, Australia",
    },
    {
        "coaster_name": "Leviathan",
        "Lat": -27.957176162950194,
        "Lon": 154,
        "Speed": 80,
        "Park": "Sea World",
        "Continent": "oceania",
        "Location": "Surfers Paradise, Queensland, Australia",
    },
    {
        "coaster_name": "Motocoaster",
        "Lat": -29,
        "Lon": 153.3167669153419,
        "Speed": 72,
        "Park": "Dreamworld",
        "Continent": "oceania",
        "Location": "Coomera, Queensland, Australia",
    },
    {
        "coaster_name": "Big Dipper",
        "Lat": -33.846757470044125,
        "Lon": 151.20998654232903,
        "Speed": 72,
        "Park": "Luna Park",
        "Continent": "oceania",
        "Location": "Sydney, New South Wales, Australia",
    },
    {
        "coaster_name": "Jet Rescue",
        "Lat": -27.956457881256362,
        "Lon": 153.42593408465808,
        "Speed": 70,
        "Park": "Sea World",
        "Continent": "oceania",
        "Location": "Surfers Paradise, Queensland, Australia",
    },
    {
        "coaster_name": "Furius Baco",
        "Lat": 40,
        "Lon": 2.5,
        "Speed": 135,
        "Park": "PortAventura Park",
        "Continent": "europe",
        "Location": "Salou, Tarragona, Spain",
    },
    {
        "coaster_name": "Shambhala",
        "Lat": 42.5,
        "Lon": 1.1611704576709636,
        "Speed": 134,
        "Park": "PortAventura Park",
        "Continent": "europe",
        "Location": "Salou, Tarragona, Spain",
    },
    {
        "coaster_name": "Stealth",
        "Lat": 51.40509825340038,
        "Lon": -0.516129830683855,
        "Speed": 128.7,
        "Park": "Thorpe Park",
        "Continent": "europe",
        "Location": "Chertsey, Surrey, England, United Kingdom",
    },
    {
        "coaster_name": "Hyperia",
        "Lat": 51.40230588659548,
        "Lon": -0.5133178306838551,
        "Speed": 128.7,
        "Park": "Thorpe Park",
        "Continent": "europe",
        "Location": "Chertsey, Surrey, England, United Kingdom",
    },
    {
        "coaster_name": "Silver Star",
        "Lat": 47.5,
        "Lon": 7.7188520846580735,
        "Speed": 127,
        "Park": "Europa Park",
        "Continent": "europe",
        "Location": "Rust, Baden-Württemberg, Germany",
    },
    {
        "coaster_name": "Schwur des Kärnan",
        "Lat": 54.07684257144166,
        "Lon": 10.781755915341927,
        "Speed": 127,
        "Park": "Hansa-Park",
        "Continent": "europe",
        "Location": "Sierksdorf, Schleswig-Holstein, Germany",
    },
    {
        "coaster_name": "Zadra",
        "Lat": 51,
        "Lon": 19.403806626987105,
        "Speed": 121,
        "Park": "Energylandia",
        "Continent": "europe",
        "Location": "Zator, Malopolskie, Poland",
    },
    {
        "coaster_name": "Expedition GeForce",
        "Lat": 49.31854769506126,
        "Lon": 8.296074542329038,
        "Speed": 120,
        "Park": "Holiday Park",
        "Continent": "europe",
        "Location": "Hassloch, Rhineland-Palatinate, Germany",
    },
    {
        "coaster_name": "Montezum",
        "Lat": -21.5,
        "Lon": -45.5,
        "Speed": 103,
        "Park": "Hopi Hari",
        "Continent": "south america",
        "Location": "Vinhedo, São Paulo, Brazil",
    },
    {
        "coaster_name": "Drakko: The Flying Beast",
        "Lat": 6,
        "Lon": -72,
        "Speed": 99.8,
        "Park": "Salitre Magico",
        "Continent": "south america",
        "Location": "Bogotá, Cundinamarca, Colombia",
    },
    {
        "coaster_name": "Doble Loop",
        "Lat": 4.667274276634175,
        "Lon": -74.3,
        "Speed": 90.1,
        "Park": "Salitre Magico",
        "Continent": "south america",
        "Location": "Bogotá, Cundinamarca, Colombia",
    },
    {
        "coaster_name": "Katapul",
        "Lat": -23.097951664302474,
        "Lon":  -48,
        "Speed": 85.3,
        "Park": "Hopi Hari",
        "Continent": "south america",
        "Location": "Vinhedo, São Paulo, Brazil",
    },
    {
        "coaster_name": "Kráter",
        "Lat": 3,
        "Lon": -75.77104452437403,
        "Speed": 83.7,
        "Park": "Parque del Café",
        "Continent": "south america",
        "Location": "Montenegro, Quindio, Colombia",
    },
    {
        "coaster_name": "Desafío",
        "Lat": -33,
        "Lon": -58.57438608479904,
        "Speed": 80,
        "Park": "Parque de la Costa",
        "Continent": "south america",
        "Location": "Tigre, Buenos Aires, Argentina",
    },
    {
        "coaster_name": "Firewhip",
        "Lat": -26.799440955801707,
        "Lon": -48.61846054232904,
        "Speed": 80,
        "Park": "Beto Carrero World",
        "Continent": "south america",
        "Location": "Penha, Santa Catarina, Brazil",
    },
    {
        "coaster_name": "Raptor",
        "Lat": -34.5,
        "Lon": -70.66250966136771,
        "Speed": 80,
        "Park": "Fantasilandia",
        "Continent": "south america",
        "Location": "Santiago, Metropolitana de Santiago, Chile",
    },
    {
        "coaster_name": "Boomerang",
        "Lat": -32.5,
        "Lon": -70.66301981855422,
        "Speed": 75.6,
        "Park": "Fantasilandia",
        "Continent": "south america",
        "Location": "Santiago, Metropolitana de Santiago, Chile",
    },
    {
        "coaster_name": "Boomerang",
        "Lat": -35,
        "Lon": -58.57506883068386,
        "Speed": 75.6,
        "Park": "Parque de la Costa",
        "Continent": "south america",
        "Location": "Tigre, Buenos Aires, Argentina",
    }
];

showCoasters(coasterData);
