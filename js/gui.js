//
// UGLY globals (for now)
//
var ctlDown = false;
var ismousedown = false;
var lowestPoint = 0;


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
		$(".zone").removeClass("draggable").css("z-index","100");//.children().attr("contenteditable","false");
		$(".zone").removeClass("highlighted");
		//$(".zone").removeClass("moving");
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
	$("#editorGui input").keypress(function(event) {
		if (event.which == 13) {
	        event.preventDefault();
	        $(this).blur();
		}
	});

	//generic functions to allow css attributes to be tied to input fields
	$(".inputCss").focus(function(){
		var targetCss = $(this).attr("data-css"); //padding
		var targetEl  = $(this).attr("data-el");  //.zone.moving
		$(this).val( $(targetEl).css( targetCss ) ); 
	});
	$(".inputCss").blur(function() {
		var targetCss = $(this).attr("data-css");
		var targetEl  = $(this).attr("data-el");
		$(targetEl).css( targetCss, $(this).val() );
	});

	$(".inputLinkRel").focus(function() {
		var targetRel = $(this).attr("data-rel");
		var targetEl = $(this).attr("data-el");
		$(this).val( $(targetEl).attr("rel") );
	});

	$(".inputLinkRel").blur(function() {
		var targetRel = $(this).attr("data-rel");
		var targetEl = $(this).attr("data-el");
		$(targetEl).attr( targetRel, $(this).val() );
	});

	$(".inputLinkSrc").focus(function() {
		var targetSrc = $(this).attr("data-src");
		var targetEl = $(this).attr("data-el");
		$(this).val( $(targetEl).attr("src") );
	});

	$(".inputLinkSrc").blur(function() {
		var targetSrc = $(this).attr("data-src");
		var targetEl = $(this).attr("data-el");
		$(targetEl).attr( targetSrc, $(this).val() );
	});

	$(".inputVidSrc").focus(function() {
		var targetSrc = $(this).attr("data-src");
		var targetEl = $(this).attr("data-el");
		$(this).val( $(targetEl).attr("src") );
	});

	$(".inputVidSrc").blur(function() {
		var targetSrc = $(this).attr("data-src");
		var targetEl = $(this).attr("data-el");
		$(targetEl).attr( targetSrc, $(this).val() );
	});

	$(".inputArrowColor").focus(function() {
		var targetSrc = $(this).attr("data-src");
		var targetEl = $(this).attr("data-el");
		$(this).val( $(targetSrc) );
	});

	$(".inputArrowColor").blur(function() {
		var targetSrc = $(this).attr("data-src");
		var targetEl = $(this).attr("data-el");
		var curClass = $(targetEl).attr("class");
		$(targetEl).attr( targetSrc, curClass + ' ' + $(this).val() );
	});

	//extra function to always cap the editable area to 960px
	$("#overallPadding").blur(function() {
		$("#editableArea").outerWidth(960);
	});

	$("#addBackground").blur(function() {
		$("#editableArea").css("background", "url(" + $(this).val() + ") no-repeat");
	});

	$("#addZone").click(function() {
		$("#editableArea").append('<div class="zone"><h2>new zone</h2><p>lipsum orem.</p></div>');
		$(".zone:last").css("z-index", "106");

		registerZones($(".zone"));
	});

	$("#createZone").click(function() {
		var selectedEl = $('.zoneType:checked').val();
		
		if(selectedEl == "normal") {
			$("#editableArea").append('<div class="zone"><h2>new zone</h2><p>lipsum orem.</p></div>');
			$(".zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeIn('slow');
			$("#guiActiveZoneVideo").fadeOut('slow');
			$("#guiActiveZoneLink").fadeOut('slow');
		}

		if (selectedEl == "video") {
			$("#editableArea").append('<div class="zone"><div class="insertVideo"></div></div>');
			insertVideoParams();
			$(".zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeOut('slow');
			$("#guiActiveZoneLink").fadeOut('slow');
			$("#guiActiveZoneVideo").fadeIn('slow').css('visibility', 'visible');
		}

		if (selectedEl == "anchor") {
			$("#editableArea").append('<a class="zone" src="" rel="">Click here to edit link</a>');
			$(".zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeOut('slow');
			$("#guiActiveZoneLink").fadeIn('slow').css('visibility', 'visible');
			$("#guiActiveZoneVideo").fadeOut('slow');
		}

		if (selectedEl == "heading") {
			$("#editableArea").append('<div class="zone"><h2>new zone</h2></div>');
			$(".zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeIn('slow');
			$("#guiActiveZoneVideo").fadeOut('slow');
			$("#guiActiveZoneLink").fadeOut('slow');
		}

		if (selectedEl == "list") {
			$("#editableArea").append('<div class="zone"><ul class=""><li>Edit me</li><li>Edit me</li><li>Edit me</li></ul></div>');
			$(".zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeIn('slow');
			$("#guiActiveZoneLink").fadeOut('slow');
			$("#guiActiveZoneVideo").fadeOut('slow');
		}

		registerZones($(".zone"));
	});

	$("#removeZone").click(function() {
		$(".zone.moving").remove(); 
	});
}); //end: form functionality


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