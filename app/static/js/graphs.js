queue()
    .defer(d3.json, "/data")
    .await(makeGraphs);

function makeGraphs(error, recordsJson) {

        var records = recordsJson;
//        var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");

        records.forEach(function(d) {
//                d["timestamp"] = dateFormat.parse(d["timestamp"]);
//                d["timestamp"].setMinutes(0);
//                d["timestamp"].setSeconds(0);
                d["longitude"] = +d["longitude"];
                d["latitude"] = +d["latitude"];
        });

	//Create a Crossfilter instance
	var ndx = crossfilter(records);

	//Define Dimensions
//	var dateDim = ndx.dimension(function(d) { return d["timestamp"]; });
	var srcDim = ndx.dimension(function(d) { return d["src"]; });
	var protoDim = ndx.dimension(function(d) { return d["proto"]; });
	var hostDim = ndx.dimension(function(d) { return d["host"]; });
	var allDim = ndx.dimension(function(d) {return d;});


            //Group Data
//	var numSrcByDate = dateDim.group();
	var hostGroup = hostDim.group();
	var protoGroup = protoDim.group();
	var srcGroup = srcDim.group();
	var all = ndx.groupAll();

    //Charts
        var numberRecordsND = dc.numberDisplay("#number-records-nd");
//	var timeChart = dc.barChart("#time-chart");
	var hostChart = dc.rowChart("#host-chart");
	var protoChart = dc.rowChart("#proto-chart");
	var srcChart = dc.rowChart("#src-chart");

	numberRecordsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

//	timeChart
//		.width(650)
//		.height(140)
//		.margins({top: 10, right: 50, bottom: 20, left: 20})
//		.dimension(dateDim)
//		.group(numSrcByDate)
//		.transitionDuration(500)
//		.elasticY(true)
//		.yAxis().ticks(4);

	hostChart
        .width(300)
        .height(100)
        .dimension(hostDim)
        .group(hostGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

	protoChart
		.width(300)
		.height(150)
        .dimension(protoDim)
        .group(protoGroup)
        .colors(['#6baed6'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);

	srcChart
		.width(300)
		.height(310)
        .dimension(srcDim)
        .group(srcGroup)
        .ordering(function(d) { return -d.value })
        .colors(['#6baed6'])
        .elasticX(true)
        .xAxis().ticks(4);

    var map = L.map('map');

	var drawMap = function(){

	    map.setView([24.254, 234.132], 4);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 15,
			}).addTo(map);

		//HeatMap
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

	//Draw Map
	drawMap();

	//Update the heatmap if any dc chart get filtered
	dcCharts = [hostChart, protoChart, srcChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			}); 
			drawMap();
		});
	});

	dc.renderAll();

};
