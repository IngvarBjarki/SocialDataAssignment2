// lets start defining all our global variables
// which we can access in all functions
var h = 400;
var w = 600;
var all_centroids = [];
var all_locations = [];

var svgTwo = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class","second");

var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683])
    .scale(125000)
    .translate([w / 2, h / 2]);

var path = d3.geo.path()
    .projection(projection);

d3.json("https://raw.githubusercontent.com/suneman/socialdataanalysis2017/master/files/sfpddistricts.geojson", function(json) {
    svgTwo.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "rgb(40,40,40)");

    // add text to the geoplot
    d3.csv("Copy-of-neighbourhoods.csv", function(error, data) {
        if (error) {
            console.log(error);
        } else {
            //set data on right format
            for (var i = 0; i < data.length; i++) {
                data[i].lat = Number(data[i].lat);
                data[i].lon = Number(data[i].lon);
            }

            //here we write the neigbourhood name on the geoplot
            svgTwo.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d) {
                    return projection([d.lon, d.lat])[0];
                })
                .attr("y", function(d) {
                    return projection([d.lon, d.lat])[1];
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "15px")
                .attr("fill", "beige");

        }
    });


    // here we load all our point into the geoplot,
    //so our map will first show upp then the points
    loadAllPoints();

});



function loadAllPoints() {
    d3.json("data_2.json", function(json) {
        json = JSON.parse(json);

        // lets transfrom the data to the correct format for all the prostitution points
        var all_locations = [];
        for (var i = 0; i < json.lon.length; i++) {
            all_locations[i] = {
                "lon": json.lon[i],
                "lat": json.lat[i],
                "labels": json.labels[i],
                "centroid": false
            };
        };

        // lets transform the data to the correct format for all the centroids
        for (var i = 0; i < json.centroid_lat.length; i++) {
            all_centroids[i] = {
                "lon": json.centroid_lon[i],
                "lat": json.centroid_lat[i],
                "labels": i,
                "centroid": true
            };
        };

        // add the locations of our datapoints and our centroids together
        // then when we are making circles we can choose what size it should be
        // depending on if its a centroid or not
        all_locations = all_locations.concat(all_centroids);

        // generate our points
        getProstitutionPoints(all_locations);
    });
}

function getProstitutionPoints(all_locations) {

    var circle = svgTwo.selectAll(".dataCircle")
        .data(all_locations);
    circle
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
            if (d.centroid) {
                return 10;
            } else {
                return 2;
            }
        })
        .style("fill", function(d) {
            return getColor(d.labels);
        })
        .style("stroke", function(d) {
            if (d.centroid) {
                return "black";
            } else {
                return getColor(d.labels);
            }
        })
        .style("stroke-width", function(d) {
            if (d.centroid) {
                return "5";
            } else {
                return "0";
            }
        });

}


function getColor(class_labels) {
    switch (class_labels) {
        case 0:
            return "rgba(253,25,153, 0.75)";
        case 1:
            return "rgba(153,252,32, 0.75)";
        case 2:
            return "rgba(0,230,254, 0.75)";
        case 3:
            return "rgba(255,240,1, 0.75)";
        case 4:
            return "rgba(161,14,236, 0.75)";
        case 5:
            return "rgba(255,165,0,0.75)";
        default:
            return "rgba(255,100,255)";
    }
}



d3.selectAll(".k_buttons")
    .on("click", function() {
        showdata = this.id + ".json";

        d3.json(showdata, function(error, json) {
            if (error) {
                console.log(error);
            } else {

                json = JSON.parse(json);
                // lets remove the current data
                svgTwo.selectAll("circle").remove();
                all_centroids = [];
                all_locations = [];
                // lets transfrom the data to the correct format for all the prostitution points
                for (var i = 0; i < json.lon.length; i++) {
                    all_locations[i] = {
                        "lon": json.lon[i],
                        "lat": json.lat[i],
                        "labels": json.labels[i],
                        "centroid": false
                    };
                };

                // lets transform the data to the correct format for all the centroids
                for (var i = 0; i < json.centroid_lat.length; i++) {
                    all_centroids[i] = {
                        "lon": json.centroid_lon[i],
                        "lat": json.centroid_lat[i],
                        "labels": i,
                        "centroid": true
                    };
                };

                all_locations = all_locations.concat(all_centroids);
                getProstitutionPoints(all_locations);

            }
        });
    });