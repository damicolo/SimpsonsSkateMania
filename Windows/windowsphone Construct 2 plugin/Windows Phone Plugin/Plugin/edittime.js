function GetPluginSettings()
{
	return {
		"name":			"Windows Phone",		// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"windowsphone",			// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Adds Windows Phone functionality",
		"author":		"Henry Hoffman",
		"help url":		"",
		"category":		"Platform specific",	// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
				
AddCondition(0, cf_none, "Is Windows Phone app", "Windows Phone", "Is Windows Phone app", "True if the game is currently running as a Windows Phone app.", "IsWindowsPhone");
AddCondition(1, cf_none, "Is device music playing", "Windows Phone Audio", "Is device music playing", "True if the user is currently playing their own music through the media player.", "IsDeviceMusicPlaying");
AddCondition(2, cf_trigger, "On back", "Windows Phone", "On back", "Triggered when user presses back button on the phone", "OnBack");
AddCondition(3, cf_deprecated, "On app activated", "Windows Phone", "On app activated", "Triggered when application is activated", "OnAppActivated");
AddCondition(4, cf_deprecated, "On app deactivated", "Windows Phone", "On app deactivated", "Triggered when application is deactivated", "OnAppDeactivated");
AddCondition(5, cf_fake_trigger, "Is activated from tombstone", "Windows Phone", "Is activated from tombstone", "When application is launched from a tombstoned state", "IsTombstoned");


AddCondition(6, cf_none, "Is trial", "Purchases", "Is trial", "True if the app is on a trial license and the trial has not expired.", "IsTrial");
AddCondition(7, cf_trigger, "IAP purchase success", "Purchases", "IAP purchase success", "Triggered when an IAP is successfully purchased.", "IAPPurchaseSuccess");
AddCondition(8, cf_trigger, "IAP purchase fail", "Purchases", "IAP purchase fail", "Triggered when an IAP was not completed because a customer cancelled it or an error occurred.", "IAPPurchaseFail");
AddCondition(9, cf_deprecated, "IAP already owned", "Purchases", "IAP already owned", "Triggered when a customer attempts to make an IAP of a product they already own", "IAPAlreadyOwned");
AddStringParam("Product ID", "A case-sensitive string of the product ID to test if purchased.");
AddCondition(10, cf_none, "Has product", "Purchases", "Has purchased {0}", "Test if the user has purchased a specific product.", "HasProduct");
AddCondition(11, cf_trigger, "On store listing received", "Purchases", "On store listing received", "Triggered after 'Request store listing' when the store listing expressions can be used.", "OnStoreListing");




////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddStringParam("Text", "The text in the message box");
AddAction(0, af_deprecated, "Show message box", "Windows Phone", "Show message box", "Shows a native Windows Phone message box", "ShowMessageBox");
AddAction(1, af_none, "Quit", "Windows Phone", "Quit", "Exits the application", "QuitApp");
AddNumberParam("Vibrate", "Vibrates the Windows Phone device for a number of seconds");
AddAction(2, af_none, "Vibrate Windows Phone", "Windows Phone", "Vibrate Windows Phone for {0} seconds", "Vibrates the Windows Phone", "VibrateWP");

/* Live tiles */

AddStringParam("Title", "The title text to display on the front of the tile (leave blank for none)", "\"\"");
AddStringParam("Rear title", "The title text to display on the rear of the tile (leave blank for none)", "\"\"");
AddStringParam("Rear content", "The content text to display on the rear of the tile (leave blank for none)", "\"\"");
AddStringParam("Wide rear content", "The content text to display on the rear of the tile (leave blank for none)", "\"\"");
AddNumberParam("Count", "Displays a numerical counter in the corner of the tile (leave blank for none)");
AddStringParam("Small background image", "The uri to the 159x159 small front background image (leave blank for none)", "\"\"");
AddStringParam("Background image", "The uri to the 336x336 front background image (leave blank for none)", "\"\"");
AddStringParam("Rear Background image", "The uri to the 336x336 rear background image (leave blank for none)", "\"\"");
AddStringParam("Wide Background image", "The uri to the 691x336 wide front background image (leave blank for none)", "\"\"");
AddStringParam("Rear wide Background image", "The uri to the 691x336 wide rear background image (leave blank for none)", "\"\"");

AddAction(3, 0, "Update Flipped Tile", "Windows Phone", "Update the flipped tile with title <b>{0}</b>, rear title <b>{1}</b>, rear content <b>{2}</b>, wide rear content <b>{3}</b>, count <b>{4}</b>, small background image <b>{5}</b>, background image <b>{6}</b>, rear background image <b>{7}</b>, wide background image <b>{8}</b> and rear wide background image <b>{9}</b>", "Update Flipped Tile", "FlippedTileUpdate");

/* Audio */

AddStringParam("Audio file URI", "A string with the URI of the WAV file to play (e.g. \"media/sound.wav\"). Make sure you manually copy the WAV to the exported directory.");
AddComboParamOption("not looping");
AddComboParamOption("looping");
AddComboParam("Loop", "Whether or not to initially play the sound in a loop (repeating).", 0, 3);
AddNumberParam("Volume", "The attenuation in decibels (dB).  0 is original volume, -10 dB is about half as loud, etc.", "0", 4);
AddStringParam("Tag (optional)", "A tag, which can be anything you like, to use to reference this sound in future.", "\"\"", 1);
AddAction(4, 0, "Play sound (by WAV URI)", "Windows Phone Audio", "Play <b>{0}</b> {1} at {2} dB (tag <i>{3}</i>)", "Play an audio file using a string for the exported wav file URI.", "PlayWPSound");

AddStringParam("Audio file URI", "A string with the URI of the WAV file to play (e.g. \"media/music.wav\"). Make sure you manually copy the WAV to the exported directory.");
AddComboParamOption("not looping");
AddComboParamOption("looping");
AddComboParam("Loop", "Whether or not to initially play the sound in a loop (repeating).", 0, 3);
AddNumberParam("Volume", "The attenuation in decibels (dB).  0 is original volume, -10 dB is about half as loud, etc.", "0", 4);
AddAction(5, 0, "Play music (by WAV URI)", "Windows Phone Audio", "Play <b>{0}</b> {1} at {2} dB (tag <i>{3}</i>)", "Play an audio file using a string for the exported wav file URI.", "PlayWPMusic");

AddAction(6, 0, "Stop all music", "Windows Phone Audio", "Stop all music", "Stops all music currently playing on the Windows Phone", "StopWPMusic");

/* Purchases */

AddAction(7, af_none, "Purchase app", "Purchases", "Prompt to purchase app", "Prompt the user to start the process of purchasing the app.", "PurchaseApp");
AddStringParam("Product ID", "A case-sensitive string of the product ID to purchase.");
AddAction(8, af_none, "Purchase product", "Purchases", "Prompt to purchase product {0}", "Prompt the user to start the process of purchasing a product in this app.", "PurchaseProduct");
AddAction(9, af_none, "Request store listing", "Purchases", "Request store listing", "Retrieves information about products in the store, triggering 'On store listing received'.", "RequestStoreListing");

AddAction(10, af_none, "Request trial status", "Purchases", "Request trial status", "Sends a request to the app to determine if it's a trial, triggering 'Is Trial'.", "RequestTrialStatus");

AddAction(11, af_deprecated, "Request tombstoned status", "Windows Phone", "Request tombstoned status", "Sends a request to the app to determine if returning froma  tombstoned state, triggering 'Is Tombstoned'", "RequestTombstoneStatus");
AddAction(12, af_none, "Rate App", "Windows Phone", "Rate App", "Launch the Store and then display the review page for the current app", "RateApp");

AddStringParam("Tag", "The tag identifying the sound to stop.");
AddAction(13, 0, "Stop", "Windows Phone Audio", "Stop <b>{0}</b>", "Stop a sound from playing.", "StopSound");


////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example

AddStringParam("ProductID", "The ID of the product to retrieve from.");
AddExpression(0, ef_return_string, "", "Store listing", "ProductName", "Get the name of a product from its ID.");

AddStringParam("ProductID", "The ID of the product to retrieve from.");
AddExpression(1, ef_return_string, "", "Store listing", "ProductDescription", "Get the description of a product from its ID.");

AddStringParam("ProductID", "The ID of the product to retrieve from.");
AddExpression(2, ef_return_string, "", "Store listing", "ProductFormattedPrice", "Get the formatted price of a product from its ID.");

AddStringParam("ProductID", "The ID of the product to retrieve from.");
AddExpression(3, ef_return_string, "", "Store listing", "ProductTag", "Get the tag of a product from its ID.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	new cr.Property(ept_combo, "Trial Mode", "No", "Set to 'Yes' if your game has a trial mode.", "No|Yes"),
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}