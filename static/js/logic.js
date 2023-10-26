let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// TO GET THE COORDINATES
d3.json(url).then(function(data) {
    
    let earthquakeInfo = data;
    console.log(earthquakeInfo);

    let latitude = earthquakeInfo.features;
    console.log(latitude);

    // TO CREATE A LIST WITH ALL THE PAST 7 DAYS EARTHQUAKES COORDINATES

    let coordinatesList = []
    for (let i = 0; i < latitude.length; i++) {
        let coordinates = latitude[i];
        let justOneCoordinate = coordinates.geometry.coordinates;
        // console.log("latitude: " + justOneCoordinate[0], "longitude: " + justOneCoordinate[1]);
        coordinatesList.push(justOneCoordinate);
    }
    // console.log(coordinatesList);

    // TO GET ALL THE MAGNITUDES AND POPUPS
    let magnitudeList = []
    let popupPlacesList = []
    let depthList = []
    for (let i = 0; i < latitude.length; i++){
        let eachMag = latitude[i].properties.mag;
        magnitudeList.push(eachMag);
        let popupPlaces = latitude[i].properties.place;
        popupPlacesList.push(popupPlaces);
        let depthData = coordinatesList[i][2];
        depthList.push(parseFloat(depthData));

        // console.log(eachMag)
    }


    // USING A DEPTH LIST TO GET THE MARKERS WITH A PROPER COLOR
    console.log(depthList)

    let minDepth = depthList[0];
    let maxDepth = depthList[0];
    
    for (let i = 1; i < depthList.length; i++) {
      if (depthList[i] < minDepth) {
        minDepth = depthList[i];
      }
      if (depthList[i] > maxDepth) {
        maxDepth = depthList[i];
      }
    }
    
    console.log("Minimum Depth: " + minDepth);
    console.log("Maximum Depth: " + maxDepth);

    const colorScale = d3.scaleLinear()
    .domain([minDepth, 30, 60, 90, 120])
    .range(['green', 'yellow', 'orange', 'orange', 'red']);

    // TO PLOT THE MAP
    var map = L.map('map').setView([35, -102], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
  
    coordinatesList.forEach(function(coordinate, index) {
        const mag = magnitudeList[index];
        const popup = popupPlacesList[index];
        const depthTooltip = depthList[index];
        const color = getColorBasedOnDepth(depthTooltip, colorScale)

        let text = "Location: " + popup + "<br>" +
        "Magnitude: " + mag + "<br>" +
        "Depth: " + depthTooltip
        
        const radius = mag * 8500;
        L.circle([coordinate[1], coordinate[0]], {
            radius: radius,
            color: color,
            fill: true,
            fillOpacity: 0.5
        }).bindTooltip(text)
        .addTo(map);
    });


    // ANOTHER TRY




    // LEGEND CONFIG AND ADD TO MAP.
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        var labels = ["-10", "30", "60", "110"];
        var colors = ['green', 'yellow', 'orange', 'red'];
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
        }
        return div;
    };

    legend.addTo(map);

    function getColorBasedOnDepth(depth, colorScale) {
        return colorScale(depth);
    }
})

