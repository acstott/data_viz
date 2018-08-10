// Read Data from MongoDB Server, Load Data to Route /data, Await Load Before Rendering View

queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

// Crossfilter Dimensions, Data Preparation, Plotting  

function makeGraphs(error, recordsJson) {

        var records = recordsJson;

        records.forEach(function(d) {
                d["longitude"] = +d["longitude"];
                d["latitude"] = +d["latitude"];
        });

// Crossfilter Instance 

	var ndx = crossfilter(records);

// Dimensions for Grpahs

	var protoDim = ndx.dimension(function(d) { return d["proto"]; });
	var hostDim = ndx.dimension(function(d) { return d["host"]; });
	var allDim = ndx.dimension(function(d) {return d;});


// Define Data Grouping 
 
	var hostGroup = hostDim.group();
	var protoGroup = protoDim.group();
	var all = ndx.groupAll();

// Define Charts via dc.js Specifications
// Note: "#my-chart-name" Goes in html Template 
        
        var numberRecordsND = dc.numberDisplay("#number-records-nd");
	var hostChart = dc.rowChart("#host-chart");
	var protoChart = dc.pieChart("#proto-chart");

// Create & Populate Charts with Data & Formatting via d3.js with dc.js Specifications 

	numberRecordsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	hostChart
        .width(400)
        .height(400)
        .dimension(hostDim)
        .group(hostGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#231B12', '#4C3F54', '#07575B', '#505160', '#375E97', '#4CB5F5', '#68829E', '#4897D8', '#1995AD'])
        .elasticX(true)
        .xAxis().ticks(4);

	protoChart
        .width(400)
        .height(400)
    .dimension(protoDim)
        .group(protoGroup)
    .colors(d3.scale.ordinal().range(
  ['#00995f', '#00663b', '#00331e']))
    .radius(200)
    .slicesCap(5)
    .minAngleForLabel(0)
    .legend(dc.legend().gap(3));

    var map = L.map('map');

	var drawMap = function(){

	    map.setView(new L.LatLng(38.326575, -106.998098), 2); 
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

// HeatMap 
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["latitude"], d["longitude"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20, 
			maxZoom: 1,
		}).addTo(map);
	};

// Draw Map
	drawMap();

// Update the heatmap if any dc chart get filtered

	dcCharts = [hostChart, protoChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			}); 
			drawMap();
		});
	});

// Render Everything to Views (/data_viz/app/views.py file) 

	dc.renderAll();

};
