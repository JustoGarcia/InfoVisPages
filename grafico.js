const myPlot2 = document.getElementById('myGraph');

// Datos de las montañas rusas
const rollerCoasters = [
    { name: 'Kingda Ka', speed: 206 },
    { name: 'Red Force', speed: 180 },
    { name: 'Superman: Escape from Krypton', speed: 160.9 },
    { name: 'Steel Dragon 2000', speed: 152.9 },
    { name: 'Fury 325', speed: 153 },
    { name: 'Millennium Force', speed: 150 },
    { name: 'Leviathan', speed: 148 },
    { name: 'Orion', speed: 146 },
    { name: 'Hyperion', speed: 142 },
    { name: 'Formula Rossa', speed: 240 }
];

// Ordenar las montañas rusas por velocidad descendente
rollerCoasters.sort((a, b) => b.speed - a.speed);

// Crear los datos para el gráfico con colores basados en la velocidad
const barChartData = [
    {
        type: 'bar',
        x: rollerCoasters.map(coaster => coaster.name),
        y: rollerCoasters.map(coaster => coaster.speed),
        marker: {
            color: rollerCoasters.map(coaster => {
                if (coaster.speed > 200) {
                    return '#FF0000'; // Rojo para las velocidades más altas
                } else if (coaster.speed > 150) {
                    return '#FFFF00'; // Amarillo para velocidades medias
                } else {
                    return '#00FF00'; // Verde para velocidades más bajas
                }
            }),
            line: {
                color: 'black',
                width: 1
            }
        }
    }
];

// Configuración del layout para mejorar la estética
const layout = {
    title: {
        text: 'Velocidades de las Montañas Rusas',
        font: {
            family: 'Arial, sans-serif',
            size: 24
        }
    },
    xaxis: {
        title: {
            text: 'Nombre de la Montaña Rusa',
            font: {
                family: 'Arial, sans-serif',
                size: 18
            }
        },
        tickangle: -45,
        tickfont: {
            family: 'Arial, sans-serif',
            size: 12
        }
    },
    yaxis: {
        title: {
            text: 'Velocidad (km/h)',
            font: {
                family: 'Arial, sans-serif',
                size: 18
            }
        },
        tickfont: {
            family: 'Arial, sans-serif',
            size: 12
        }
    },
    margin: { l: 50, r: 50, b: 150, t: 50 },
    plot_bgcolor: '#f8f8f8',
    paper_bgcolor: '#f8f8f8'
};

// Renderizar el gráfico
Plotly.newPlot(myPlot2, barChartData, layout);
