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


$("a").click(function(event) {
	event.preventDefault();
});

//
// register modules, attaching functionality to thier components
//
function registerModule(el) {
	var tabEl = $(el).children(".tab");
	var modID = $(el).attr("id");
	var modNum = modID.substr(modID.indexOf("module") + 6);

	$(function () {
		$(".module").removeClass("activeMod");
		$("#"+ modID).addClass("activeMod");
	});

	$("#"+ modID).click(function() {
		$(".module").removeClass("activeMod");
		currentMod = "#"+ modID;
		$(this).addClass("activeMod");
	});

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
		$(".movInfo").html("top:" + el.css('top') + " left:" + el.css('left') );
        $(".hBars").css("height", el.outerHeight()-2 );
        $(".hBars").css("top", el.position().top);
        $(".vBars").css("width", el.outerWidth()-2 );
        $(".vBars").css("left", el.position().left );
	}

	//zones can become draggable, on mouse click
	$(el).mousedown( function() {
		if(ctlDown) {
			//prepare zone (editble, draggable, etc)
			$(".zone").removeClass("moving");
			$(".zone").removeClass("draggable").css("z-index","100").attr("contenteditable","false");
			$(this).addClass("draggable").css("z-index","105").attr("contenteditable","true");
			$(".draggable").draggit(".draggable");
			var targetEl = $(this).attr("data-type");
			if (targetEl == "normal") {
				$("#guiActiveZoneLink").fadeOut("slow");
				$("#guiActiveZoneVideo").fadeOut("slow");
				$("#guiActiveZone").fadeIn('slow');
			}
			if (targetEl == "video") {
				$("#guiActiveZoneLink").fadeOut("slow");
				$("#guiActiveZone").fadeOut("slow");
				$("#guiActiveZoneVideo").fadeIn("slow");
			}
			if (targetEl == "anchor") {
				$("#guiActiveZone").fadeOut("slow");
				$("#guiActiveZoneVideo").fadeOut("slow");
				$("#guiActiveZoneLink").fadeIn("slow");
			}
			if (targetEl == "list") {
				$("#guiActiveZoneLink").fadeOut("slow");
				$("#guiActiveZoneVideo").fadeOut("slow");
				$("#guiActiveZone").fadeIn("slow");
			}
			//$("#guiActiveZone").show();

			//prepare guidebars for this zone
			$(".zone").addClass("highlighted");
			$(this).parent().append( $(".hBars") );
		    $(this).parent().append( $(".vBars") );
			$(".hBars").addClass("moving");
	        $(".vBars").addClass("moving");
	        $(this).prepend( $(".movInfo") );
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
		$("#editorGui").append( $(".movInfo").empty() );
		$(".zone").removeClass("draggable").css("z-index","100");
		$(".zone").removeClass("highlighted");
		$(".hBars").removeClass("moving");
        $(".vBars").removeClass("moving");
	});

	//allow all content editable elements to self parse thier contents into html
	$(el).blur( function() {
		$(this).children().each( function() { $(this).not('ul').html( $(this).text() ) });
	});

	$(el).focus( function() {
		$(this).children().each( function() { $(this).not('ul').text( $(this).html() ) });
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
        var conPos = $(el).parent().position();

        padTop = parseInt( $(el).parent().css("padding-top").replace("px", "") );
        padRight = parseInt( $(el).parent().css("padding-right").replace("px", "") );
        padBottom = parseInt( $(el).parent().css("padding-bottom").replace("px", "") );
        padLeft = parseInt( $(el).parent().css("padding-left").replace("px", "") );

        outBoundsX = parentPos.left + conW - $(el).outerWidth();
        outBoundsY = parentPos.top  + conH - $(el).outerHeight() - conPos.top;

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
		$(this).val( $(targetEl).attr("href") );
	});

	$(".inputLinkSrc").blur(function() {
		var targetSrc = $(this).attr("data-src");
		var targetEl = $(this).attr("data-el");
		$(targetEl).attr( targetSrc, $(this).val() );
	});
// Video Zone
	$(".inputVidPath").focus(function() {
		var targetSrc = $(this).attr("data-vidpath");
		var targetEl = $(this).attr("data-el");
		$(this).val( $(targetEl).attr("data-vidpath") );
	});

	$(".inputVidPath").blur(function() {
		//var targetSrc = $(this).attr("data-vidpath");
		var targetEl = $(this).attr("data-el");
		$(targetEl).attr("data-vidpath", $(this).val() );
	});

	$(".inputVidWidth").focus(function() {
		var targetSrc = $(this).attr("data-vidwidth");
		var targetEl = $(this).attr("data-el");
		$(this).val( $(targetEl).attr("data-vidwidth") );
	});

	$(".inputVidWidth").blur(function() {
		//var targetSrc = $(this).attr("data-vidwidth");
		var targetEl = $(this).attr("data-el");
		$(targetEl).attr("data-vidwidth", $(this).val() );
	});

	$(".inputVidHeight").focus(function() {
		var targetSrc = $(this).attr("data-vidheight");
		var targetEl = $(this).attr("data-el");
		$(this).val( $(targetEl).attr("data-vidheight") );
	});

	$(".inputVidHeight").blur(function() {
		//var targetSrc = $(this).attr("data-vidheight");
		var targetEl = $(this).attr("data-el");
		$(targetEl).attr( "data-vidheight", $(this).val() );
	});

	$(".inputVidPlaceHolder").focus(function() {
		var targetSrc = $(this).attr("data-imgplaceholder");
		var targetEl = $(this).attr("data-el");
		$(this).val( $(targetEl).attr("data-imgplaceholder") );
	});

	$(".inputVidPlaceHolder").blur(function() {
		var targetSrc = $(this).attr("data-imgplaceholder");
		var targetEl = $(this).attr("data-el");
		$(targetEl).attr( "data-imgplaceholder", $(this).val() );
	});


	$(".inputVidSubmit").click(function(){
		$(".zone.moving").removeClass("placeholderImg");
		insertVideoParams($(".zone.moving"));
	});

	$(".inputArrowColor").focus(function() {
		$(this).val("");
		var targetSrc = $(this).attr("data-src");//class
		var targetEl = $(this).attr("data-el");//.zone.moving
		var targetElClasses = $(targetEl).attr('class');
		var defaultClasses = ['zone','moving','trackImpression'];
		$(defaultClasses).each(function(index) {
			if(targetElClasses.indexOf(defaultClasses[index]) > -1) {
				targetElClasses = targetElClasses.replace(defaultClasses[index], "");
			}
		});
		$(this).val( targetElClasses );
	});

	$(".inputArrowColor").blur(function() {
		var targetSrc = $(this).attr("data-src"); //class
		var targetEl = $(this).attr("data-el"); //.zone.moving
		$(targetEl).attr( targetSrc, 'zone moving' + ' ' + $(this).val() );
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
		$("#editableArea").append('<div class="module"><div class="tab"><h3>' + tabTitle + '</h3><input class="inputCss" name="moduleHeight" type="text" class="text" value="" data-el="#'+tabTitle+'" data-css="height"/><a class="up" href="javascript://void();">^</a> <a class="down" href="javascript://void();">v</a> <a class="close" href="javascript://void();">X</a></div>');
		$(".module:last").attr("id", tabTitle);
		$(".zone:last").css("z-index", "106");

		registerZones($(".zone"));
		registerModule("#" + tabTitle);
		currentMod = ("#" + tabTitle);
	});

	$("#createZone").click(function() {
		if ($('.module').length < 1) {
			$('#addModule').click();
		}

		var selectedEl = $('.zoneType:checked').val();

		if(selectedEl == "normal") {
			$(currentMod).append('<div class="zone" data-type="normal"><h2>New heading</h2><p>An update to me would be good.</p></div>');
			$(currentMod + " .zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeIn('slow');
			$("#guiActiveZoneVideo").fadeOut('slow');
			$("#guiActiveZoneLink").fadeOut('slow');
		}

		if (selectedEl == "video") {
			$(currentMod).append('<div class="zone placeholderImg vidZone" data-vidpath="" data-vidwidth="640" data-vidheight="390" data-imgplaceholder=""><div id="insertVideo" class="innerVidZone"></div></div>');
			$(currentMod + " .zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeOut('slow');
			$("#guiActiveZoneLink").fadeOut('slow');
			$("#guiActiveZoneVideo").fadeIn('slow').css('visibility', 'visible');
		}

		if (selectedEl == "anchor") {
			$(currentMod).append('<a class="zone" href="" rel="" data-type="anchor">Click here to edit link</a>');
			$(currentMod + " .zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeOut('slow');
			$("#guiActiveZoneLink").fadeIn('slow').css('visibility', 'visible');
			$("#guiActiveZoneVideo").fadeOut('slow');
		}

		if (selectedEl == "heading") {
			$(currentMod).append('<div class="zone" data-type="normal"><h2>New heading</h2></div>');
			$(currentMod + " .zone:last").css("z-index", "106");
			$("#guiActiveZone").fadeIn('slow');
			$("#guiActiveZoneVideo").fadeOut('slow');
			$("#guiActiveZoneLink").fadeOut('slow');
		}

		if (selectedEl == "list") {
			$(currentMod).append('<div class="zone" data-type="list"><ul class="mod-bullets"><li><span class="list-item">Edit me</span></li><li><span class="list-item">Edit me</span></li><li><span class="list-item">Edit me</span></li></ul></div>');
			$(currentMod + " .zone:last").css("z-index", "106");
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
// Set Video Params
//
	function insertVideoParams(activeVidZone) {

		$(activeVidZone).css("background-image", "url(" + $(activeVidZone).attr("data-imgplaceholder") +")");
		$(activeVidZone).css('background-repeat', 'no-repeat');
		var vidParams = {
            allowScriptAccess: "always",
            scale: "noscale",
            wmode: "transparent",
            bgcolor: "#000000",
            quality: "high",
            allowFullScreen: "true"
		};

        var flashVars = {
        	movieName: $(activeVidZone).attr("data-vidpath"),
           	autoPlay: "false",
            startNum: "0"
        };

        swfobject.embedSWF("http://store.sony.com/wcsstore/SonyStyleStorefrontAssetStore/flashfiles/swfs/video_player_v2.swf", $(".zone.moving div").attr("id"), $(activeVidZone).attr("data-vidwidth"), $(activeVidZone).attr("data-vidheight"), "9.0.0", null, flashVars, vidParams);
	}


$("#export").click(function(){

	$("#exportArea").html($("#editableArea").html());
	$("#exportArea").attr("style", $("#editableArea").attr("style"));
	$("#exportArea").css("display", "none");
	$("#exportArea .tab").remove();

	$("#exportArea .hBars").remove();
	$("#exportArea .vBars").remove();
	$("#exportArea div").removeClass("activeMod");
	$("#exportArea div").removeClass("draggable");
	$("#exportArea a").removeClass("activeMod");
	$("#exportArea a").removeClass("draggable");
	$("#exportArea ul").removeClass("activeMod");
	$("#exportArea ul").removeClass("draggable");
	$("#exportArea div.module").css("border", "none");
	$("#exportArea div.module").css("position", "relative");

	$(".zone").removeAttr("contenteditable");



	$("#exportArea .vidZone").each(function(){
		// go through each vidzone and write the script tags to the source
		// Empty the inner section first
/*
		$(this).html("<div id=\"insertVideo\" class=\"innerVidZone\"></div>");
		var scriptTags = "var vidParams = { allowScriptAccess: \"always\", scale: \"noscale\", wmode: \"transparent\", bgcolor: \"#000000\", quality: \"high\", allowFullScreen: \"true\" };"
		scriptTags += "var flashVars = { movieName: \""+ $(this).attr("data-vidpath") +"\",autoPlay: \"false\",startNum: \"0\" };"
        scriptTags += "swfobject.embedSWF(\"http://store.sony.com/wcsstore/SonyStyleStorefrontAssetStore/flashfiles/swfs/video_player_v2.swf\", \"insertVideo\", " + $(this).attr("data-vidwidth") +", "+$(this).attr("data-vidheight")+", \"9.0.0\", null, flashVars, vidParams);";

var newScript = document.createElement('script');
newScript.setAttribute('type', 'text/javascript');
var textNode = document.createTextNode(scriptTe);
newScript.appendChild(textNode);
document.getElementsByTagName('head')[0].appendChild(newScript);
*/
		$(this).removeAttr("data-vidwidth");
		$(this).removeAttr("data-vidheight");
		$(this).removeAttr("data-vidpath");
		$(this).removeAttr("data-imgplaceholder");

	});

	$("#exportArea div").removeClass("moving");
	var print = $("#printExport");
	print.text($("#printExport").html()).dialog({modal: true, resizeable: true, minWidth: 500});

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