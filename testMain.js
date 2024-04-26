// mainScript.js
#target illustrator
#targetengine main

// #include "testFunction.js"

var ip = new File($.fileName); 
var scriptPath = ip.path;
function incScript(sn){ eval('#includepath ' + scriptPath + '\n#include ' + sn); }

incScript('testFunction.js');

// Create a new document if none exists
if (!documents.length) {
    var doc = app.documents.add();
} else {
    var doc = app.activeDocument;
}

// Create a new palette window
var w = new Window("dialog", "CMYK Palette"); 

// Add a panel to the window with specified dimensions
var c = w.add("panel", undefined, undefined, {borderStyle: "none"});
c.size = [200, 100]; // Set width to 200 and height to 100

// Add a dummy element to control the panel's width
var btnAlert = c.add("button", undefined, "Alert");
var btnClose = c.add("button", undefined, "Close");

// Define onClick event handler for the Alert button
btnAlert.onClick = function() {
    // Call the testAlert function from testFunction.js
    testAlert();
};

// Define onClick event handler for the Close button
btnClose.onClick = function() {
    w.close(); // Close the window when the button is clicked
}; 

// Show the window
w.show();
