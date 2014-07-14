// Copyright © Microsoft Corporation.  The use of this code (the “software”) is governed by the Microsoft Sample license terms found at https://github.com/atxryan/Windows-8-Advertising-Scirra-Plugin/blob/master/LICENSE.txt.

// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.win8advertising = function(runtime) {
	this.runtime = runtime;
};

(function () {
	/////////////////////////////////////
	var pluginProto = cr.plugins_.win8advertising.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function() {
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type) {
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function() {

		this.isWindows8 = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);
		if (!this.isWindows8) {
			cr.logexport("[Construct 2] Windows 8 Advertising plugin not supported on this platform - the object will not be created");
			return;
		}

		var adSizes = ["728x90", "500x130", "300x250", "290x60", "250x250", "250x125", "160x600"];
		var applicationId = this.properties[0];
		var adUnitId = this.properties[1];
		var size = adSizes[ this.properties[2] ].split("x");
		var elemId = this.properties[3];
		var isVisible = this.properties[4] === 0 ? false : true;
		var isEnabled = this.properties[5] === 0 ? false : true;
		var isAutoRefreshEnabled = this.properties[6] === 0 ? false : true;
		var adControl;


		/*Sampe AdControl
		  <div data-win-control="MicrosoftNSJS.Advertising.AdControl" 
		    data-win-options="{adUnitId:'129642', applicationId:'a679d69a-f905-4160-8947-91fe8f5a57f4', isAutoRefreshEnabled:false}" 
		    style="width: 250px; height: 250px; z-index: 1;">
		  </div>
		*/

		// Create the element and append to the document
		this.elem = document.createElement("div");							
		this.elem.id = elemId;
		jQuery(this.elem).attr("data-win-control", "MicrosoftNSJS.Advertising.AdControl");
		jQuery(this.elem).css("width", size[0] + "px");
		jQuery(this.elem).css("height", size[1] + "px");
		jQuery(this.elem).css("z-index", 1);
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
		
		// Instantiate the AdControl
		// See: http://msdn.microsoft.com/en-us/library/advertising-windows-examples-javascript(v=msads.10).aspx
		adControl = new MicrosoftNSJS.Advertising.AdControl(this.elem, { applicationId: applicationId, adUnitId: adUnitId});
		adControl.isAutoRefreshEnabled = isAutoRefreshEnabled;
				
		if (!isVisible) {
			jQuery(this.elem).hide();
			this.visible = false;
		}
		
		this.elem.onclick = (function (self) {
			return function(e) {
				e.stopPropagation();
				self.runtime.trigger(cr.plugins_.Button.prototype.cnds.OnClicked, self);
			};
		})(this);
		
		// Prevent touches reaching the canvas
		this.elem.addEventListener("touchstart", function (e) {
			e.stopPropagation();
		}, false);
		
		this.elem.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		}, false);
		
		this.elem.addEventListener("touchend", function (e) {
			e.stopPropagation();
		}, false);
		
		// Prevent clicks being blocked
		jQuery(this.elem).mousedown(function (e) {
			e.stopPropagation();
		});
		
		jQuery(this.elem).mouseup(function (e) {
			e.stopPropagation();
		});
		
		// Prevent key presses being blocked by the Keyboard object
		jQuery(this.elem).keydown(function (e) {
			e.stopPropagation();
		});
		
		jQuery(this.elem).keyup(function (e) {
			e.stopPropagation();
		});
			
		this.updatePosition();
		
		this.runtime.tickMe(this);

		// Kick off another processAll() method to ensure the 
		// AdControl is constructed.
		WinJS.UI.processAll().done(function () {
			// Do nothing for now. 
        	//var control = this.elem.winControl; 
    	});
	};
	
	instanceProto.onDestroy = function () {
		if (this.runtime.isDomFree)
			return;
		
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function () {
		this.updatePosition();
	};
	
	instanceProto.updatePosition = function () {
		if (this.runtime.isDomFree)
			return;
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height) {
			jQuery(this.elem).hide();
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;
			
		jQuery(this.elem).show();
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
		
		if (this.autoFontSize)
			jQuery(this.elem).css("font-size", (this.layer.getScale() - 0.2) + "em");
	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx) {
	};
	
	instanceProto.drawGL = function(glw) {
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.OnClicked = function () {
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.SetVisible = function (vis) {
		if (this.runtime.isDomFree)
			return;
		
		this.visible = (vis !== 0);
	};
	
	Acts.prototype.SetEnabled = function (en) {
		if (this.runtime.isDomFree)
			return;
		
		this.inputElem.disabled = (en === 0);
	};
	
	Acts.prototype.SetCSSStyle = function (p, v) {
		if (this.runtime.isDomFree)
			return;
			
		jQuery(this.elem).css(p, v);
	};

	Acts.prototype.RefreshAd = function () {
		// TODO: Check for IsAutoRefreshEnabled property first!

		if (this.runtime.isDomFree)
			return;
		
		//refresh();
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

}());