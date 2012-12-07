//
// UGLY globals (for now)
//
var ctlDown = false;
var ismousedown = false;
var moduleCount = 0;
var lowestPoint = 0;
var currentMod = 0;


//track alt down
$(document).keydown(function(event) {
	if (event.which == 18) {
		if (ctlDown == false) ctlDown = true;
		$(".zone").addClass("highlighted");
		$(".zone").removeClass("moving");
		$("#guiActiveZone").hide();
	}
});
$(document).keyup(function(event) {
	if (event.which == 18) {
		if (ctlDown == true) ctlDown = false;
		$(".zone").removeClass("highlighted");
	}
});


//
// register modules, attaching functionality to thier components
//
function registerModule(el) {
	var tabEl = $(el).children(".tab");
	var modID = $(el).attr("id");
	var modNum = modID.substr(modID.indexOf("module") + 6);
	
	$("#"+ modID + " .tab .up").click(function() {
		var moduleNum = $(this).parent().parent().attr("id");
		var home = "#" + modID;
		var target = $(home).siblings()[ $(home).index() - 1 ];
		$(target).before( $(home) );
	});

	$("#"+ modID + " .tab .down").click(function() {
		var moduleNum = $(this).parent().parent().attr("id");
		var home = "#" + modID;
		var target = $(home).siblings()[ $(home).index() + 0 ];
		$(target).after( $(home) );
	});

	$("#" + modID + " .tab .close").click(function() {
		$("#" + modID).remove();
	});

	$("#" + modID + " input").keypress(function(event) {
		if (event.which == 13) {
	        event.preventDefault();
	        $(this).blur();
		}
	});

	$("#" + modID + " .inputCss").focus(function(){
		var targetCss = $(this).attr("data-css");
		var targetEl  = $(this).attr("data-el");
		$(this).val( $(targetEl).css( targetCss ) );
	});
	$("#" + modID + " .inputCss").blur(function() {
		var targetCss = $(this).attr("data-css");
		var targetEl  = $(this).attr("data-el");
		$(targetEl).css( targetCss, $(this).val() );
	});
}

//
// make targeted zone active, track/update gui objects around it.
//
function registerZones(el) {
	//position bars and positional data to element
	function posBars(el) {
		$("#movInfo").html("top:" + el.css('top') + " left:" + el.css('left') );
        $("#hBars").css("height", el.outerHeight()-2 );
        $("#hBars").css("top", el.position().top);
        $("#vBars").css("width", el.outerWidth()-2 );
        $("#vBars").css("left", el.position().left );
	}

	//zones can become draggable, on mouse click
	$(el).mousedown( function() {
		if(ctlDown) {
			//prepare zone (editble, draggable, etc)
			$(".zone").removeClass("moving");
			$(".zone").removeClass("draggable").css("z-index","100").attr("contenteditable","false");
			$(this).addClass("draggable").css("z-index","105").attr("contenteditable","true");
			$(".draggable").draggit(".draggable");
			$("#guiActiveZone").show();

			//prepare guidebars for this zone
			$(".zone").addClass("highlighted");
			$(this).parent().append( $("#hBars") );
		    $(this).parent().append( $("#vBars") );
			$("#hBars").addClass("moving");
	        $("#vBars").addClass("moving");
	        $(this).prepend( $("#movInfo") );
	        posBars( $(this) );
    	}
	});

	$(el).mousemove( function() {
		if(ismousedown){
	        posBars( $(this) );
	        $(".inputCss").focus();
	        $(".inputCss").blur();
		}
	});

	$(el).mouseup( function() {
		$("#editorGui").append( $("#movInfo").empty() );
		$(".zone").removeClass("draggable").css("z-index","100");
		$(".zone").removeClass("highlighted");
		$("#hBars").removeClass("moving");
        $("#vBars").removeClass("moving");
	});
}
registerZones( $(".zone") );





//
// Enhanced dragging function
//
// Original code from PlugTrade.com - jQuery draggit Function 
//  
jQuery.fn.draggit = function (el) {
    var thisel = this;
    var thistarget = $(el);
    var oldPosX;
    var oldPosY;
    var relX;
    var relY;
    var outBoundsX;
    var outBoundsY;
    var padTop;
    var padRight;
    var padBottom;
    var padLeft;

    thistarget.css('position','absolute');

    thisel.bind('mousedown', function(e){
        setMove(e);
    });

    function setMove(e) {
    	var parentPos = $(el).parent().position();
    	var pos = $(el).position();
        var conW = $(el).parent().width();
        var conH = $(el).parent().height();

        padTop = parseInt( $(el).parent().css("padding-top").replace("px", "") );
        padRight = parseInt( $(el).parent().css("padding-right").replace("px", "") );
        padBottom = parseInt( $(el).parent().css("padding-bottom").replace("px", "") );
        padLeft = parseInt( $(el).parent().css("padding-left").replace("px", "") );

        outBoundsX = parentPos.left + conW - $(el).outerWidth();
        outBoundsY = parentPos.top  + conH - $(el).outerHeight();

        relX = e.pageX;
        relY = e.pageY;

       	oldPosX = pos.left;
    	oldPosY = pos.top;

        ismousedown = true;
        $(el).addClass('moving');
    }
    setMove(el);

    $(document).bind('mousemove',function(e){ 
        if(ismousedown)
        {
            var parentPos = $(el).parent().position();

            var mouseX = e.pageX;
            var mouseY = e.pageY;

            if(relX != undefined || relY != undefined || oldPosX != undefined || oldPosY != undefined) {
            	var diffX =  mouseX - relX  + oldPosX; 
	            var diffY =  mouseY - relY  + oldPosY;

	            // check if we are beyond parent bounds if so, limit
	            if(diffX < 0 + padLeft)   diffX = 0 + padLeft;
	            if(diffY < 0 + padTop)   diffY = 0 + padTop;
	            if(diffX > outBoundsX + padRight ) diffX =  outBoundsX + padRight; 
	            if(diffY > outBoundsY + padBottom ) diffY =  outBoundsY + padBottom;          

	            $(el).css('left', Math.floor(diffX) );
	            $(el).css('top',  Math.floor(diffY) );
            }
	    }
    });

    $(window).bind('mouseup', function(e){
        ismousedown = false;
        $(el).removeClass('moving');
    });

    return this;
} // end jQuery draggit function //



//
// Form Functionality
//
$(function () {
	//return key should activate all inout fields
	$("input").keypress(function(event) {
		if (event.which == 13) {
	        event.preventDefault();
	        $(this).blur();
		}
	});

	//generic functions to allow css attributes to be tied to input fields
	$(".inputCss").focus(function(){
		var targetCss = $(this).attr("data-css");
		var targetEl  = $(this).attr("data-el");
		$(this).val( $(targetEl).css( targetCss ) );
	});
	$(".inputCss").blur(function() {
		var targetCss = $(this).attr("data-css");
		var targetEl  = $(this).attr("data-el");
		$(targetEl).css( targetCss, $(this).val() );
	});

	//extra function to always cap the editable area to 960px
	$("#overallPadding").blur(function() {
		$("#editableArea").outerWidth(960);
	});

	$("#addBackground").blur(function() {
		$("#editableArea").css("background", "url(" + $(this).val() + ") no-repeat");
	});

	$("#addModule").click(function() {
		moduleCount++;
		var tabTitle = "module" + moduleCount;
		$("#editableArea").append('<div class="module"><div class="tab"><h3>' + tabTitle + '</h3><input class="inputCss" name="moduleHeight" type="text" class="text" value="" data-el="#'+tabTitle+'" data-css="height"/><a class="up" href="javascript://void();">^</a> <a class="down" href="javascript://void();">v</a> <a class="close" href="javascript://void();">X</a></div><h2 class="zone">New Module</h2><p class="zone" style="top: 100px;">Im in a module!</p></div>');
		$(".module:last").attr("id", tabTitle);
		$(".zone:last").css("z-index", "106");

		registerZones($(".zone"));
		registerModule("#" + tabTitle);
		currentMod = ("#" + tabTitle);
	});

	$("#addZone").click(function() {
		$(currentMod).append('<div class="zone"><h2>new zone</h2><p>lipsum orem.</p></div>');
		$(currentMod + " .zone:last").css("z-index", "106");

		registerZones($(".zone"));
	});

	$("#removeZone").click(function() {
		$(".zone.moving").remove(); 
	});
});


//
// Data storing
//
$(function () {
	//for all savable elements, on blur store thier data
	$(".persistant").blur(function () {
		localStorage.setItem('data_' + $(this).attr("id"), this.innerHTML);
	});

	//load all savable elements from data
	$(".persistant").each( function(i) {
		var dataValue = 'data_' + $(this).attr("id");
		if ( localStorage.getItem( dataValue ) ) {
			$(this).html( localStorage.getItem( dataValue ) );
		};
	});
});