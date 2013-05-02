//http://vigorbee.cz/files/kridla-manual.pdf
var c07;
var p0, p7, p3;
var c12, c24;
var p1, p2, p4;

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

jsPlumb.ready(function() {
	jsPlumb.setRenderMode(jsPlumb.SVG);
	
	jsPlumb.importDefaults({
		DragOptions : { cursor: "pointer", zIndex:2000 },
		ConnectionsDetachable: false,
		Anchors: ["AutoDefault"],
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
	p0 = jsPlumb.addEndpoint('p0', { anchor:"LeftMiddle" }, endpointOptions );
	p3 = jsPlumb.addEndpoint('p3', { anchor:"AutoDefault" }, endpointOptions );
	p7 = jsPlumb.addEndpoint('p7', { anchor:"RightMiddle" }, endpointOptions );
	
	var c07 = jsPlumb.connect({ 
		source: p0,
		target: p7
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
	
	//jsPlumb.getSelector(".point");
	jsPlumb.getSelector(".point").bind("beforeDrag", function(connection){
		console.log(connection);
	});

});

$(document).ready(function() {
	$("#calculateBtn").click(function() {
		$("#loketniIndex").text(loketniIndex());
	});
});