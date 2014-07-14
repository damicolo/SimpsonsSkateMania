// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.windowsphone = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.windowsphone.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	window.windowsPhoneRuntime = null;
	window.windowsPhoneInst = null;

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	window["tombstoned"] = false;
	window["isTrial"] = false;
	window["deviceMusicPlaying"] = false;

	instanceProto.onCreate = function()
	{
		window.windowsPhoneRuntime = this.runtime;
		window.windowsPhoneInst = this;
		this.isWindowsPhone = window['C2IsWinPhone8'];

		this.isTrial = (this.properties[0] !== 0);

		this.IAPProducts = {};

		var self = this;

		if (this.isWindowsPhone) {
			setTimeout(function(){
				window["external"]["notify"]("checkLicense," + self.isTrial);
				window["external"]["notify"]("isTombstoned");
				window["external"]["notify"]("gameLoaded");
			},0);
		}
	};

	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function (glw)
	{
	};

	// Global functions to call conditions even when minified

	window["wp_call_OnBack"] = function () 
	{
		window.windowsPhoneRuntime.trigger(cr.plugins_.windowsphone.prototype.cnds.OnBack, window.windowsPhoneInst);
	}

	window["wp_call_IAPPurchaseSuccess"] = function (productid_) 
	{
		self.IAPProducts[productid_]["Purchased"] = "True";
		window.windowsPhoneRuntime.trigger(cr.plugins_.windowsphone.prototype.cnds.IAPPurchaseSuccess, window.windowsPhoneInst);
	}

	window["wp_call_IAPPurchaseFail"] = function () 
	{
		window.windowsPhoneRuntime.trigger(cr.plugins_.windowsphone.prototype.cnds.IAPPurchaseFail, window.windowsPhoneInst);
	}

	window["wp_call_OnStoreListing"] = function (productsJSON_) 
	{	
		var productsJSONRemap = {};
		for (var i in productsJSON_) {
			productsJSONRemap[productsJSON_[i]["Key"]] = productsJSON_[i]["Value"];
		}

		self.IAPProducts = productsJSONRemap;

		window.windowsPhoneRuntime.trigger(cr.plugins_.windowsphone.prototype.cnds.OnStoreListing, window.windowsPhoneInst);
	}

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// Is Windows Phone
	Cnds.prototype.IsWindowsPhone = function ()
	{
		if (this.isWindowsPhone) {
			return true;
		} else {
			return false;
		}
	};

	Cnds.prototype.OnBack = function ()
	{
		return true;
	};

	Cnds.prototype.IsTombstoned = function ()
	{
		if (window["tombstoned"]) {
			window["tombstoned"] = false;
			return true;
		} else {
			return false;
		}
	};

	Cnds.prototype.IsTrial = function ()
	{
		return window["isTrial"];
	};

	Cnds.prototype.IAPPurchaseSuccess = function ()
	{
		return true;
	};

	Cnds.prototype.IAPPurchaseFail = function ()
	{
		return true;
	};

	Cnds.prototype.HasProduct = function (productid_)
	{
		try {
			if (self.IAPProducts[productid_]["Purchased"] === "True") {
				return true;
			} else {
				return false;
			}
		} catch(e) {
			return false;
		}
	};

	Cnds.prototype.OnStoreListing = function ()
	{
		return true;
	};

	Cnds.prototype.IsDeviceMusicPlaying = function ()
	{
		return window["deviceMusicPlaying"];
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions

	window.run_action = function (action_) 
	{
		if (window['C2IsWinPhone8'])
			setTimeout(function(){
				window["external"]["notify"](action_);
			},0);
	}

	function Acts() {};

	Acts.prototype.QuitApp = function ()
	{
		window.run_action("quitApp")
	};

	Acts.prototype.VibrateWP = function (duration_)
	{
		window.run_action("vibrate, " + duration_)
	};

	Acts.prototype.FlippedTileUpdate = function (title_, backTitle_, backContent_, wideBackContent_, count_, smallBackgroundImage_, backgroundImage_, backBackgroundImage_, wideBackgroundImage_, wideBackBackgroundImage_)
	{
		window.run_action(
			"flippedTileUpdate, " + 
			title_ + ", " + 
			backTitle_ + ", " + 
			backContent_ + ", " + 
			wideBackContent_ + ", " + 
			count_ + ", " + 
			smallBackgroundImage_ + ", " + 
			backgroundImage_ + ", " + 
			backBackgroundImage_ + ", " + 
			wideBackgroundImage_ + ", " + 
			wideBackBackgroundImage_
		)
	};

	Acts.prototype.PlayWPSound = function (fileName_, loop_, volume_, tag_)
	{
		window.run_action("playSound, " + fileName_ + ", " + loop_ + ", " + volume_ + ", " + tag_)
	};

	Acts.prototype.PlayWPMusic = function (fileName_, loop_, volume_)
	{
		window.run_action("playMusic, " + fileName_ + ", " + loop_ + ", " + volume_)
	};

	Acts.prototype.StopSound = function (tag_)
	{
		window.run_action("stopSound, " + tag_)
	};

	Acts.prototype.StopWPMusic = function ()
	{
		window.run_action("stopMusic")
	};

	/* Purchases */

	Acts.prototype.RequestTrialStatus = function ()
	{
		window.run_action("requestTrialStatus")
	};

	Acts.prototype.PurchaseApp = function ()
	{
		window.run_action("purchaseApp")
	};

	Acts.prototype.PurchaseProduct = function (productID_)
	{
		window.run_action("purchaseProduct," + productID_)
	};

	Acts.prototype.RequestStoreListing = function ()
	{
		window.run_action("requestStoreListing")
	};

	/* Tombstoning */

	Acts.prototype.RequestTombstoneStatus = function ()
	{
		window.run_action("requestTombstoneStatus")
	};

	/* Rating */

	Acts.prototype.RateApp = function ()
	{
		window.run_action("rateApp")
	};

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.ProductName = function (ret, productId_)	
	{
		if (this.isWindowsPhone && self.IAPProducts[productId_])
		{
			ret.set_string(self.IAPProducts[productId_]["Name"]);
		}
		else
			ret.set_string("");	
	};

	Exps.prototype.ProductDescription = function (ret, productId_)	
	{
		if (this.isWindowsPhone && self.IAPProducts[productId_])
		{
			ret.set_string(self.IAPProducts[productId_]["Description"]);
		}
		else
			ret.set_string("");	
	};

	Exps.prototype.ProductFormattedPrice = function (ret, productId_)	
	{
		if (this.isWindowsPhone && self.IAPProducts[productId_])
		{
			ret.set_string(self.IAPProducts[productId_]["FormattedPrice"]);
		}
		else
			ret.set_string("");	
	};

	Exps.prototype.ProductTag = function (ret, productId_)	
	{
		if (this.isWindowsPhone && self.IAPProducts[productId_])
		{
			ret.set_string(self.IAPProducts[productId_]["Tag"]);
		}
		else
			ret.set_string("");	
	};

	
	pluginProto.exps = new Exps();

}());