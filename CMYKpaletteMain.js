// CMYKpaletteMain.js
#target illustrator
#targetengine main

#include "paletteFunction.js"

// Get the active document
var doc = app.activeDocument;

// Get the active artboard
var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
var artboardRect = artboard.artboardRect;

var w; // window
var p; // panel
var gInput; // CMYK inputs
var rbInput; // Radio Button input
var stepInput; // Step % input
var lrInput; // How many steps left(down) and right(up) 
var sgd; // Text color fill group
var g; // group

var w = new Window("dialog", "CMYK Palette", undefined);

p = w.add("panel");
gInput = p.add("group");
rbInput = p.add("group");
stepInput = p.add("group");
lInput = p.add("group");
rInput = p.add("group");
sgd = p.add("group");
c = w.add("panel");
g = c.add("group");

gInput.add("statictext", undefined, "C:");
var cInput = gInput.add("edittext", undefined, "0");
cInput.preferredSize.width = 60;

gInput.add("statictext", undefined, "M:");
var mInput = gInput.add("edittext", undefined, "0");
mInput.preferredSize.width = 60;

gInput.add("statictext", undefined, "Y:");
var yInput = gInput.add("edittext", undefined, "0");
yInput.preferredSize.width = 60;

gInput.add("statictext", undefined, "K:");
var kInput = gInput.add("edittext", undefined, "0");
kInput.preferredSize.width = 60;

// Radio-buttons for which CMYK to step
var cRadioButton = rbInput.add("radiobutton", undefined, "Cyan");
var mRadioButton = rbInput.add("radiobutton", undefined, "Magenta");
var yRadioButton = rbInput.add("radiobutton", undefined, "Yellow");
var kRadioButton = rbInput.add("radiobutton", undefined, "Black");
// Set the first radio button to be selected by default
cRadioButton.value = true;

// Enter your step value for the CMYK values
stepInput.add("statictext", undefined, "Enter CMYK step value (0-10):");
var stepSizeInput = stepInput.add("edittext", undefined, "5");
stepSizeInput.preferredSize.width = 60;

// Enter the number of steps to increase or decrease CMYK values
	// Steps to the left
	lInput.add("statictext", undefined, "How many steps down (0-10):");
	var leftInput = lInput.add("edittext", undefined, "2");
	leftInput.preferredSize.width = 60;
	// Steps to the right
	rInput.add("statictext", undefined, "How many steps up (0-10):");
	var rightInput = rInput.add("edittext", undefined, "2");
	rightInput.preferredSize.width = 60;

// Select how you want the CMYK text values to appear
var blackText = sgd.add("radiobutton", undefined, "Black Text");
var clearText = sgd.add("radiobutton", undefined, "Clear Text");
blackText.value = true;

// Add Submit or Cancel buttons
var btnSubmit = g.add("button", undefined, "Create");
var btnClose = g.add("button", undefined, "Close");

btnSubmit.onClick = function() {
    createSquares();
};

btnClose.onClick = function () {
	w.close();
};

// SHOW THE WINDOW
w.show()
