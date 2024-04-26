#target illustrator
#targetengine main

var w = new Window("palette", "CMYK Palette"); 

// Add a panel to the window with specified dimensions
var c = w.add("panel", undefined, undefined, {borderStyle: "none"});
c.size = [200, 100]; // Set width to 200 and height to 100

// Add a dummy element to control the panel's width
var btnClose = c.add("button", undefined, "Close");

// Define onClick event handler for the Close button
btnClose.onClick = function() {
    w.close(); // Close the window when the button is clicked
}; 

// Show the window
w.show();
