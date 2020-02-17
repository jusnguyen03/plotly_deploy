function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        optionChanged(sampleNames[0]);
    })}
  
    init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGauge(newSample);
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
  
        PANEL.html("");
        PANEL.append("h6").text('ID: '+result.id);
        PANEL.append("h6").text('ETHNICITY: '+result.ethnicity);
        PANEL.append("h6").text('GENDER: '+result.gender);
        PANEL.append("h6").text('AGE: ' +result.age);
        PANEL.append("h6").text('LOCATION: ' + result.location);
        PANEL.append("h6").text('BBTYPE: '+result.bbtype);
        PANEL.append("h6").text('WFREQ: '+result.wfreq);
    });
}

function buildCharts(sample){
    
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample)
        
        
        var sortedresult= resultArray.sort((a,b)=> a.sample_values - b.sample_values).reverse();
        var result = sortedresult[0];
        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;
        otu_ids_string = otu_ids.map(otu_ids => `OTU ${otu_ids}`);
        var wfreq = result.wfreq;

        // Bar Chart
        var trace = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids_string.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };
        
        var data = [trace];
        var layout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t:50, l:150}
        };
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart
        var traceA = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        };
          
        var data = [traceA];  
        var layout = {
            title: "Bacteria Cultures Per Sample",
            xaxis: {title: "OTU ID"},
            showlegend: false,
            height: 600,
            width: 1200,
            margin: {t:50, l:150}
        };
        Plotly.newPlot("bubble", data, layout);
    });
}

function buildGauge(wfreq) {
    // Frequencey between 0 and 180
    var level = parseFloat(wfreq) * 20;
    // Calculations using MathPI
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI)/180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    // Main Path
    var mainPath = "M -.0 -0.05 L .0 0.05 L";
    var paX = String(x);
    var space = " ";
    var paY = String(y);
    var pathEnd = "Z";
    var path = mainPath.concat(paX, space, paY, pathEnd);
    var newdata = [
        {
            type: "scatter",
            x: [0],
            y: [0],
            marker: {size:12, color: "80000"},
            showlegend: false,
            name: "Freq",
            text: level,
            hoverinfo: "text+name"
        },
        {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90, 
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                    "rgba(0, 105, 11, .5)",
                    "rgba(10, 120, 22, .5)",
                    "rgba(15, 127, 0, .5)",
                    "rgba(110, 154, 22, .5)",
                    "rgba(170, 202, 42, .5)",
                    "rgba(205, 209, 95, .5)",
                    "rgba(210, 206, 145, .5)",
                    "rgba(230, 226, 202, .5)",
                    "rgba(240, 230, 215, .5)",
                    "rgba(255, 255, 255, 0)",
                ]
            },
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
        },
    ];
    var layout = {
        shapes: [
            {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                    color: "850000"
                }
            }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
            showgrid: false,
            showticklabels: false,
            zeroline: false,
            range: [-1,1]
        },
        yaxis: {
            showgrid: false,
            showticklabels: false,
            zeroline: false,
            range: [-1,1]
        }
    };
    var gaugeChart = document.getElementById("gauge");
    Plotly.newPlot(gaugeChart,newdata,layout);
}