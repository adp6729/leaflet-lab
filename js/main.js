//Examples from leaflet.org
function createMapID(){
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYWRwNjcyOSIsImEiOiJjajc2dnRjYngxMnYwMnduejlheTZ0eWprIn0.Aml7Po1lql8bRriVZzAJHA'
    }).addTo(mymap);
    var marker = L.marker([51.5, -0.09]).addTo(mymap);
    var circle = L.circle([51.508, -0.11], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(mymap);
    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(mymap);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");
    var popup = L.popup()
        .setLatLng([51.5, -0.09])
        .setContent("I am a standalone popup.")
        .openOn(mymap);

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }

    mymap.on('click', onMapClick);
}

function createGeoJSONMap() {
    var geomap = L.map('geoJSONmap').setView([39.74739, -105], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiYWRwNjcyOSIsImEiOiJjajc2dnRjYngxMnYwMnduejlheTZ0eWprIn0.Aml7Po1lql8bRriVZzAJHA'
    }).addTo(geomap);

    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    }
    var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    };
    L.geoJSON(geojsonFeature, {
        onEachFeature: onEachFeature
    }).addTo(geomap);

    var myLines = [{
        "type": "LineString",
        "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    }, {
        "type": "LineString",
        "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    }];
    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };
    L.geoJSON(myLines, {style: myStyle}).addTo(geomap);

    //            var myLayer = L.geoJSON().addTo(geomap);
    //            myLayer.addData(geojsonFeature)
    //            L.geoJSON(myLayer).addTo(geomap);

    var states = [{
        "type": "Feature",
        "properties": {"party": "Republican"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-104.05, 48.99],
                [-97.22,  48.98],
                [-96.58,  45.94],
                [-104.03, 45.94],
                [-104.05, 48.99]
            ]]
        }
    }, {
        "type": "Feature",
        "properties": {"party": "Democrat"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-109.05, 41.00],
                [-102.06, 40.99],
                [-102.03, 36.99],
                [-109.04, 36.99],
                [-109.05, 41.00]
            ]]
        }
    }];

    //            L.geoJSON(states, {
    //                style: function(feature) {
    //                    switch (feature.properties.party) {
    //                        case 'Republican': return {color: "#ff0000"};
    //                        case 'Democrat':   return {color: "#0000ff"};
    //                    }
    //                }
    //            }).addTo(geomap);

    var someFeatures = [{
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "show_on_map": true
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Busch Field",
            "show_on_map": false
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.98404, 39.74621]
        }
    }];

    L.geoJSON(someFeatures, {
        filter: function(feature, layer) {
            return feature.properties.show_on_map;
        }
    }).addTo(geomap);
}

//GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//1. Create the Leaflet map--done (in createMap())
//2. Import GeoJSON data--done (in getData())
//3. Add circle markers for point features to the map--done (in AJAX callback)
//4. Determine which attribute to visualize with proportional symbols
//5. For each feature, determine its value for the selected attribute
//6. Give each feature's circle marker a radius based on its attribute value

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [45, -110],
        zoom: 4
    })

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map)

    //call getData function
    getData(map)
}

//Example 2.7 line 1...function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/MultiRacial.geojson", {
        dataType: "json",
        success: function(response){
            
            //call function to create proportional symbols, put in a layer
            geoJsonLayer = createPropSymbols(response, map);
            
            //create a L.markerClusterGroup layer
            var markers = L.markerClusterGroup();
            
            //add geojson to marker cluster layer
            markers.addLayer(geoJsonLayer);
            
            //add marker cluster layer to map
//            map.addLayer(markers);
            
            //add geo JSON layer to map
            map.addLayer(geoJsonLayer);
        }
    })
}

function createPropSymbols(data, map) {
    
    var attribute = "MultiRacialPerc2010"
    
    //create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    }
    
    //calculate the radius of each proportional symbol
    function calcPropRadius(attValue, scaleFactor) {
        
        //area based on attribute value and scale factor
        var area = attValue * scaleFactor;
        
        //radius calculated based on area
        var radius = Math.sqrt(area/Math.PI);

        return radius;
    };

    
    //create a Leaflet GeoJSON layer
    var geoJsonLayer = L.geoJson(data, {
        pointToLayer: function (feature, latlng){
            // Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute])
          
//            console.log(feature.properties, attValue)
            
            // Test for variable type, then
            // Step 6: Give each feature's circle marker a radius based on its attribute value            
            var strTest = attribute.search("Pop")
            if (strTest > -1) {
                geojsonMarkerOptions.radius = calcPropRadius(attValue, 0.1);
                details = ["Population", ""]
            } else {
                geojsonMarkerOptions.radius = calcPropRadius(attValue, 600);
                details = ["Percentage", "%"]
            }
            
            // Create circle marker layer
            var layer = L.circleMarker(latlng, geojsonMarkerOptions)
            
            // Build popup content string
            var popupContent = "<p><b>City:</b> " + feature.properties.CityState + "</p>"
            var year = attribute.slice(-4)
            popupContent += "<p><b>" + details[0] + " in " + year + ":</b> " + feature.properties[attribute] + details[1] + "</p>";

            //bind the popup to the circle marker
            layer.bindPopup(popupContent, {
                offset: new L.Point(0, -geojsonMarkerOptions.radius),
                closeButton: false
            })
            
            //event listeners to open popup on hover
            layer.on({
                mouseover: function(){
                    this.openPopup()
                },
                mouseout: function(){
                    this.closePopup()
                },
                click: function(){
                    $("#panel").html(popupContent);
                }
            })

            return layer;
        }})
    
    return geoJsonLayer    
}

$(document).ready(createMap);