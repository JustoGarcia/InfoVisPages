(function() {
    const myPlot = document.getElementById('myMap');

    const lon = coasterData.map(item => item.Lon);
    const lat = coasterData.map(item => item.Lat);
    const magnitud = coasterData.map(item => item.Speed * 0.15); // Ajustar escala de velocidad

    // Crear arrays para nombre, velocidad, parque y ubicación
    const names = coasterData.map(item => item.coaster_name);
    const speeds = coasterData.map(item => item.Speed);
    const parks = coasterData.map(item => item.Location);
    const ubics = coasterData.map(item => item.Ubic);

    // Crear el gráfico con etiquetas emergentes personalizadas
    const data = [
        {
            type: 'scattergeo',
            mode: 'markers',
            lon: lon,
            lat: lat,
            marker: {
                size: magnitud,
                colorscale: [
                    [0, '#00FF00'], // Verde: Velocidades bajas (< 150 km/h)
                    [0.5, '#FFFF00'], // Amarillo: Velocidades medias (150 - 200 km/h)
                    [1, '#FF0000'] // Rojo intenso: Velocidades altas (> 200 km/h)
                ],
                cmin: 100, // Mínimo rango de velocidad
                cmax: 240, // Máximo rango de velocidad
                color: speeds,
                line: { color: 'black' }
            },
            text: names, // Mostrar nombres en hover
            hovertemplate: 
                '<b>Nombre:</b> %{text}<br>' +
                '<b>Velocidad:</b> %{customdata[0]} km/h<br>' +
                '<b>Parque:</b> %{customdata[1]}<br>' +
                '<b>Ubicación:</b> %{customdata[2]}<extra></extra>', // Añadir solo la ubicación
            customdata: coasterData.map(item => [
                item.Speed, 
                item.Location,
                item.Ubic
            ])
        }
    ];

    // Configuración del layout del gráfico
    const layout = {
        geo: {
            scope: 'world',
            showland: true,
            projection: { type: 'natural earth' },
            countrycolor: 'rgb(255, 255, 255)',
            subunitcolor: 'rgb(255, 255, 255)',
        },
        margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
        dragmode: false
    };

    // Dibujar el gráfico en el div con id 'myMap'
    Plotly.newPlot(myPlot, data, layout, { scrollZoom: false, displayModeBar: false });
})();
