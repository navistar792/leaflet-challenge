var plates;
var myMap;
var link2 = "data/PB2002_plates.json";


// retrieve the data using  D3
d3.json(link2).then(function(response){
    console.log(response);
    plates = L.geoJSON(response,{  
        style: function(feature){
            return {
                color:"orange",
                fillColor: "white",
                fillOpacity:0
            }
        },      
        onEachFeature: function(feature,layer){
            console.log(feature.coordinates);
            layer.bindPopup("Plate Name: "+feature.properties.PlateName);
        }
        
    });

    
    var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
   

    d3.json(link).then(function(data){
    console.log(data);
   
    function createCircleMarker(feature,latlng){
        let options = {
            radius:feature.properties.mag*4,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        }
        return L.circleMarker( latlng, options );

    };


    var earthQuakes = L.geoJSON(data,{
        onEachFeature: function(feature,layer){
            layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker

    });

    createMap(plates,earthQuakes);

    });

    
});


  function createMap(plates,earthQuakes) {

    //updated links
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });
  
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "mapbox/outdoors-v11",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellite,
      "Grayscale": grayscale,
      "Outdoors": outdoors
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Fault Lines": plates,
      Earthquakes: earthQuakes
    };
  
    // Create our map
    var myMap = L.map("map", {
      center: [
        34.0522,-118.2437
      ],
      zoom: 4,
      layers: [satellite, plates, earthQuakes]
    });
  
    
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();

  };


  function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "chartreuse";
        case (mag<2):
            return "greenyellow";
        case (mag<3):
            return "gold";
        case (mag<4):
            return "DarkOrange";
        case (mag<5):
            return "Peru";
        default:
            return "red";
    };
};

function displayLegend(){
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: "chartreuse"
    },{
        limit: "Mag: 1-2",
        color: "greenyellow"
    },{
        limit:"Mag: 2-3",
        color:"gold"
    },{
        limit:"Mag: 3-4",
        color:"DarkOrange"
    },{
        limit:"Mag: 4-5",
        color:"Peru"
    },{
        limit:"Mag: 5+",
        color:"red"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var strng = "";
   
    for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    
    return header+strng;

};