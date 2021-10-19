// create the URL for the geoJason
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// Creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 8
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

var depthCheck =[];
var depthCheck2 =[];

  // retrieve the data using  D3
d3.json(url).then(function(data){
    console.log(data)
    // Start for loop to add the new markers 
    for (var i = 0; i < data.features.length; i++){


        // retrive the coordinates for markers
        coords = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]
        
        //retrieve the color used for each marker
        
        
        var color = '';
        var depth = data.features[i].geometry.coordinates[2];
        depthCheck.push(depth);

        switch(true){
            case (depth > -10 && depth < 10):
                color = 'rgb(19, 235, 45)'
                break;
            case (depth >= 10 && depth < 20):
                color = 'rgb(138, 206, 0)'
                break;
            case (depth >= 20 && depth < 30):
                color = 'rgb(186, 174, 0)'
                break;
            case (depth >= 30 && depth < 40):
                color = 'rgb(218, 136, 0)'
                break;
            case ( depth >= 40 && depth < 50):
                color = 'rgb(237, 91, 0)'
                break;
            case (depth >= 50):
                color = 'rgb(242, 24, 31)'
                break;
        }

        // create the variables for your popup
        var date = moment(data.features[i].properties.time).format('MMMM Do YYYY')
        var time =  moment(data.features[i].properties.time).format('h:mm:ss a')
        var loc = data.features[i].properties.place
        var mag = data.features[i].properties.mag

        // Create the circles for each earthquake report and add to the baseMap layer.
        L.circle(coords, {
            opacity: .5,
            fillOpacity: 0.75,
            weight: .5,
            color: 'black',
            fillColor: color,
            radius: 7000 * data.features[i].properties.mag
    }).bindPopup(`<p align = "left"> <strong>Date:</strong> ${date} <br> <strong>Time:</strong>${time} <br>
     <strong>Location:</strong> ${loc} <br> <strong>Magnitude:</strong> ${mag} </p>`).addTo(myMap)
    

    newMarker = L.layer
}

// for(var i=0; i<depthCheck.length;i++) depthCheck[i] = +depthCheck[i];



});

// min and max for legend



// console.log(d3.min(data, d => data.features[d].geometry.coordinates[2]));


var legend = L.control({position: 'bottomright'});


legend.onAdd = function (){
    var div = L.DomUtil.create('div', 'info legend');
    var grades = ['-10-10', '10-20', '20-30', '30-40', '40-50', '50+'];
    var colors = [
        'rgb(19, 235, 45)',
        'rgb(138, 206, 0)',
        'rgb(186, 174, 0)',
        'rgb(218, 136, 0)',
        'rgb(237, 91, 0)',
        'rgb(242, 24, 31)'
        ];
    var labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    grades.forEach(function(grade, index){
        labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 20px"+ "; height: 15px" + "\"></li>" + "<li>" + grade + "</li></div>");
    })
  
    div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    return div;

};

legend.addTo(myMap);



d3.json(url).then(function(data2){
    console.log(data2)
    // Start for loop to add the new markers 
    for (var i = 0; i < data2.features.length; i++){
        var depth2 = data2.features[i].geometry.coordinates[2];
        depthCheck2.push(depth2);
    };
    console.log(depthCheck2);
    var setMax = d3.max(Array.from(depthCheck2.values()));
    var setMin = d3.min(Array.from(depthCheck2.values()));
    var q1 = d3.quantile(depthCheck2, 0.25);
    var q2 = d3.quantile(depthCheck2, 0.50);
    var q3 = d3.quantile(depthCheck2, 0.75);
    
    console.log(setMin);
    console.log(q1);
    console.log(q2);
    console.log(q3);
    console.log(setMax);
});

