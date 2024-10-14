
const myPlot2 = document.getElementById('myGraph');

// Definir el layout (opcional)
const data = [
    {
        type: 'bar',
        x: ['giraffes', 'orangutans', 'monkeys'],
        y: [20, 14, 23]
    }
];

Plotly.newPlot(myPlot2, data);
