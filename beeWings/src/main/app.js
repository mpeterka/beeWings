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

var elbowIndex = function() {
	return getDistance($("#p2"), $("#p4")) / getDistance($("#p2"), $("#p1"));
};

/**
 * "Beemorph" algorithm
 */
var discoidalAngle = function() {
	var B = getPosition($("#p0"));
	var bx = B.left;
	var by = B.top;
	var G = getPosition($("#p3"));
	var gx = G.left;
	var gy = G.top;
	var F = getPosition($("#p5"));
	var fx = F.left;
	var fy = G.top;
	var A = getPosition($("#p7"));
	var ax = A.left;
	var ay = A.top;
	
	var abxDiff = ax - bx;// AB X diff
	var abyDiff = ay - by;// AB Y diff
	var abLen = Math.pow(abxDiff*abxDiff + abyDiff*abyDiff, 0.5); // Length AB
	
	var afxDiff = ax - fx;
	var afyDiff = ay - fy;
	var afLen = Math.pow(afxDiff*afxDiff + afyDiff*afyDiff, 0.5);
	
	var bfxDiff = bx - fx;
	var bfyDiff = by - fy;
	var bfLen = Math.pow(bfxDiff*bfxDiff + bfyDiff*bfyDiff, 0.5);
	
	var cosAbfAngle = ((abLen*abLen + bfLen*bfLen - afLen*afLen)/(2*abLen*bfLen));// Cos Angle ABF
	//var abfAngle = Math.acos(cosAbfAngle); //Angle ABF
	
	var bhLen = cosAbfAngle * bfLen;
	var bhAbRat = bhLen / abLen; // Ration BH/AB
	
	var hx = bx + (bhAbRat * abxDiff);
	var hy = by + (bhAbRat * abyDiff);
	
	var hgxDiff = hx - gx;
	var hgyDiff = hy - gy;
	var hgLen = Math.pow(hgxDiff*hgxDiff + hgyDiff*hgyDiff, 0.5);
	
	var bgxDiff = bx - gx;
	var bgyDiff = by - gy;
	var bgLen = Math.pow(bgxDiff*bgxDiff + bgyDiff*bgyDiff, 0.5);
	
	var agxDiff = ax - gx;
	var agyDiff = ay - gy;
	var agLen = Math.pow(agxDiff*agxDiff + agyDiff*agyDiff, 0.5);
	
	// Angle BHG Degrees
	var bhgAngle = toDegrees(Math.acos((bhLen*bhLen + hgLen*hgLen - bgLen*bgLen)/(2 * bhLen * hgLen)));
	
	// DISCOIDAL SHIFT
	var discoidalShift = 90 - bhgAngle * sign(bgLen - agLen);

	return -1 * discoidalShift;// beemorph fix
};

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}

function sign(n) {
	if (n < 0) {return -1;};
	if (n > 0) {return 1;};
	return 0;
}

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
			refreshElbowIndex();
			refreshDiscoidalAngle();
		}
	});
	
	var offset = $("#canvas").offset();
	$(".point").each(function(index, el) {
		var $el = $(el);
		$el.offset({top: $el.offset().top + offset.top, left: $el.offset().left + offset.left});
	});
	jsPlumb.repaintEverything();

});

var refreshElbowIndex = function() {
	$("#elbow-index").text(elbowIndex());
};
var refreshDiscoidalAngle = function() {
	$("#discoidal-angle").text(discoidalAngle());
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
	drawRegion(ctx, plot.pointOffset({ x: 0, y: 2}), plot.pointOffset({ x: 10, y: 4}), "rgba(0, 0, 165, 0.2)", "rgba(0, 0, 165, 1)", $.t("bee.breed.carnica"));
	
	// caucasia
	drawRegion(ctx, plot.pointOffset({ x: -10, y: 1.7}), plot.pointOffset({ x: 0, y: 3.2}), "rgba(0, 165, 0, 0.2)", "rgba(0, 165, 0, 1)", $.t("bee.breed.caucasia"));
	
	// mellifera
	drawRegion(ctx, plot.pointOffset({ x: -10, y: 0.5}), plot.pointOffset({ x: 2, y: 2.1}), "rgba(127, 127, 0, 0.2)", "rgba(127, 127, 0, 1)", $.t("bee.breed.mellifera"));
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
	ctx.font = 'italic 10px sans-serif';
	ctx.textBaseline = 'bottom';
	ctx.fillText(text, posBottom.left + 5, posBottom.top - 5);
};

$(document).ready(function() {
	$("#addBtn").click(function() {
		results.push([discoidalAngle(), elbowIndex()]);
		refreshPlot();
	});
	$.i18n.init({
		debug: false,
		lng: "cs-CZ"
	}, function() {
		$("html").i18n();
	});
});


var viewImage = function(el) {
	// get the input element
	var $image = $("#canvas");

	if (el.files && el.files.length > 0) {
		var file = el.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			$image.css("background-image", "url(" + e.target.result + ")");
			var image = new Image();
			image.onload = function(evt) {
				$("#canvas").css("width", this.width).css("height", this.height);
			};
			image.src = e.target.result;
			
		};
		reader.readAsDataURL(file);
	}
};