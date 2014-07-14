// Copyright © Microsoft Corporation.  The use of this code (the “software”) is governed by the Microsoft Sample license terms found at https://github.com/atxryan/Windows-8-Advertising-Scirra-Plugin/blob/master/LICENSE.txt.

function GetPluginSettings() {
	return {
		"name":			"Windows 8 Advertising",
		"id":			"win8advertising",
		"version":		"1.0",
		"description":	"Advertising",
		"author":		"Ryan Joy",
		"help url":		"http://ryanjoy.com/2013/05/introducing-a-windows-store-advertising-plugin-for-scirra-construct-2/",
		"category":		"Platform specific",
		"type":			"world",			// appears in layout
		"rotatable":	false,
		"flags":		pf_position_aces | pf_size_aces | pf_nosize
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
				
AddCondition(0, cf_trigger, "On clicked", "Advertising", "On clicked", "Triggered when the advertisement is clicked.", "OnClicked");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

AddComboParamOption("Invisible");
AddComboParamOption("Visible");
AddComboParam("Visibility", "Choose whether to hide or show the advertisement.");
AddAction(2, af_none, "Set visible", "Appearance", "Set <b>{0}</b>", "Hide or show the advertisement.", "SetVisible");

AddComboParamOption("Disabled");
AddComboParamOption("Enabled");
AddComboParam("Mode", "Choose whether to enable or disable the advertisement.");
AddAction(3, af_none, "Set enabled", "Advertising", "Set <b>{0}</b>", "Disable or enable the advertisement.", "SetEnabled");

AddAction(4, af_none, "Set focused", "Advertising", "Set focused", "Set the input focus to the advertisement.", "SetFocus");

AddStringParam("Property name", "A CSS property name to set on the control.", "\"color\"");
AddStringParam("Value", "A string to assign as the value for this CSS property.", "\"red\"");
AddAction(5, af_none, "Set CSS style", "Appearance", "Set CSS style {0} to {1}", "Set a CSS style on the control.", "SetCSSStyle");

AddAction(6, af_none, "Refresh ad", "Advertising", "Refresh ad", "When automatic ad refresh is disabled, a call to this method directs the AdControl to show the next ad when a new one becomes available.", "RefreshAd");


////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

ACESDone(); 

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,	"Application ID",		
									"d25517cb-12d4-4699-8bdc-52040c712cab",			
									"Application ID from Microsoft pubCenter"),
	new cr.Property(ept_text,	"Ad Unit ID",		
									"10043107",			
									"Ad Unit ID from Microsoft pubCenter"),
	new cr.Property(ept_combo,	"Size",		
									"250x250",		
									"Choose the ad display size.", 
									"728x90|500x130|300x250|292x60|250x250|250x125|160x600"),
	new cr.Property(ept_text,	"Element ID (optional)",		
									"",			
									"An ID for the control allowing it to be styled with CSS from the page HTML."),
	new cr.Property(ept_combo,	"Initial visibility",	
									"Visible",	
									"Choose whether the ad is visible on startup.", 
									"Invisible|Visible"),
	new cr.Property(ept_combo,	"Enabled",				
									"Yes",		
									"Choose whether the ad is enabled or disabled on startup.", 
									"No|Yes"),
	new cr.Property(ept_combo,  "Refresh enabled?", 
									"Yes", 
									"Enables or disables automatic rotation of advertisements.", 
									"No|Yes")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType() {
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType() {
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance) {
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type) {
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	this.just_inserted = false;
	this.font = null;
}

IDEInstance.prototype.OnCreate = function() {
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function() {
	this.instance.SetSize(new cr.vector2(250, 250));
}

IDEInstance.prototype.OnDoubleClicked = function() {
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name) {
	if (property_name === "Size") {
		var size = this.properties["Size"].split("x")
		this.instance.SetSize(new cr.vector2(size[0], size[1]));
	}
}

IDEInstance.prototype.OnRendererInit = function(renderer) {
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer) {
		
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);

	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();

	renderer.Fill(quad, cr.RGB(224, 224, 224));
	renderer.Outline(quad, cr.RGB(0, 0, 0));
	
	cr.quad.prototype.offset.call(quad, 0, 2);

	this.font.DrawText("Advertisement",
						quad,
						cr.RGB(0, 0, 0),
						ha_center);
}

IDEInstance.prototype.OnRendererReleased = function(renderer) {
	this.font = null;
}