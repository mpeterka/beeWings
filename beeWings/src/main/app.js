// http://vigorbee.cz/files/kridla-manual.pdf
var c07;
var p0, p7, p3;
var c12, c24;
var p1, p2, p4;

var results = [];

var getPosition = function(obj) {
	return $(obj).offset();
};

var getDistance = function(point1, point2) {
	var position1 = getPosition(point1);
	var position2 = getPosition(point2);
	return Math.sqrt(Math.pow(position1.top - position2.top, 2) + Math.pow(position1.left - position2.left, 2));
};

var loketniIndex = function() {
	return getDistance($("#p2"), $("#p4")) / getDistance($("#p2"), $("#p1"));
};

var discoidalAngle = function() {
	var p0 = getPosition($("#p0"));
	var p3 = getPosition($("#p3"));
	var p5 = getPosition($("#p5"));
	var p7 = getPosition($("#p7"));
	
	// TODO: magic
	return null;
};

jsPlumb.ready(function() {
	jsPlumb.setRenderMode(jsPlumb.SVG);
	
	jsPlumb.importDefaults({
		DragOptions : { cursor: "pointer", zIndex:2000 },
		ConnectionsDetachable: false,
		Anchors: ["Center"],
		Connector: ["Straight"],
		Endpoint: ["Blank"],
		EndpointsOnTop: false,
		PaintStyle: {
			lineWidth : 2,
			strokeStyle : "red"
		},
		LogEnabled: true,
		MaxConnections: 2
	});
	
	var endpointOptions = { 
	}; 
	p0 = jsPlumb.addEndpoint('p0', { anchor:"LeftMiddle"}, endpointOptions);
	p3 = jsPlumb.addEndpoint('p3', { anchor:"AutoDefault"}, endpointOptions );
	p7 = jsPlumb.addEndpoint('p7', { anchor:"RightMiddle"}, endpointOptions );
	
	var c07 = jsPlumb.connect({ 
		source: p0,
		target: p7,
		paintStyle: {strokeStyle: "blue"}
	});
	
	
	p1 = jsPlumb.addEndpoint('p1', { anchor:"LeftMiddle" }, endpointOptions );
	p2 = jsPlumb.addEndpoint('p2', { anchor:"LeftMiddle" }, endpointOptions );
	c12 = jsPlumb.connect({
			source : p1,
			target : p2,
		});
	
	p4 = jsPlumb.addEndpoint('p4', { anchor:"RightMiddle" }, endpointOptions );
	c24 = jsPlumb.connect({
		source : p2,
		target : p4,
	});
	
	jsPlumb.draggable(jsPlumb.getSelector(".point"));
	
	$(".point").draggable({
		stop : function() {
			refreshLoketniIndex();
		}
	});

});

var refreshLoketniIndex = function() {
	$("#loketni-index").text(loketniIndex());
};

var refreshPlot = function() {
	var plotOptions = {
		series : {
			lines : {
				show : false
			},
			points : {
				show : true,
				fillColor: "red"
			}
		},
		xaxis: {
			tickSize: 5,
			min: -10.0,
			max: +10.0
		},
		yaxis: {
			tickSize: 0.5,
			min: 0.5,
			max: 4.0
		}
	};
	
	var $placeholder = $("#graph");
	
	var plot = $.plot($placeholder, [results], plotOptions);

	var ctx = plot.getCanvas().getContext("2d");

	// carnica
	drawRegion(ctx, plot.pointOffset({ x: 0, y: 2}), plot.pointOffset({ x: 10, y: 4}), "rgba(0, 0, 165, 0.2)", "rgba(0, 0, 165, 1)", "carnica");
	
	// caucasia
	drawRegion(ctx, plot.pointOffset({ x: -10, y: 1.7}), plot.pointOffset({ x: 0, y: 3.2}), "rgba(0, 165, 0, 0.2)", "rgba(0, 165, 0, 1)", "caucasia");
	
	// mellifera
	drawRegion(ctx, plot.pointOffset({ x: -10, y: 0.5}), plot.pointOffset({ x: 2, y: 2.1}), "rgba(127, 127, 0, 0.2)", "rgba(127, 127, 0, 1)", "mellifera");
};

var drawRegion = function(ctx, posBottom, posTop, fillColor, shadowColor, text) {
	ctx.shadowBlur = 10;
	ctx.shadowColor = shadowColor;
	ctx.fillStyle = fillColor;
	
	ctx.beginPath();
	ctx.moveTo(posBottom.left, posBottom.top);
	ctx.lineTo(posTop.left, posBottom.top);
	ctx.lineTo(posTop.left, posTop.top);
	ctx.lineTo(posBottom.left, posTop.top);
	ctx.fill();
	
	ctx.fillStyle = 'black';
	ctx.font = 'italic bold 12px sans-serif';
	ctx.textBaseline = 'bottom';
	ctx.fillText(text, posBottom.left + 5, posBottom.top - 5);
};

$(document).ready(function() {
	$("#addBtn").click(function() {
		results.push([0, loketniIndex()]);
		refreshPlot();
	});
});