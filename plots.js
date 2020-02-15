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
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
  
        PANEL.html("");
        PANEL.append("h6").text('ID: '+result.id);
        PANEL.append("h6").text('Ethnicity: '+result.ethnicity);
        PANEL.append("h6").text('Gender: '+result.gender);
        PANEL.append("h6").text('Age: ' +result.age);
        PANEL.append("h6").text('Location: ' + result.location);
        PANEL.append("h6").text('BBtype: '+result.bbtype);
        PANEL.append("h6").text('wfreq: '+result.wfreq);
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
            margin: {t:50, l:150}
        };
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart
        var trace1 = {
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
          
        var data = [trace1];  
        var layout = {
            title: '',
            xaxis: {title: "OTU ID"},
            showlegend: false,
            height: 600,
            width: 1200,
            margin: {t:50, l:150}
        };
        Plotly.newPlot("bubble", data, layout);
    });
}
