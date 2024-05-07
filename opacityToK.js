// Get the active document
var doc = app.activeDocument;

// Loop through all the selected objects
for (var i = 0; i < doc.selection.length; i++) {
    var selectedObject = doc.selection[i];
    
    // Check if the selected object is a pathItem
    if (selectedObject.typename == "PathItem") {
        // Set CMYK black value equal to opacity
        var color = selectedObject.fillColor;
        if (color instanceof CMYKColor) {
            color.black = selectedObject.opacity;
            selectedObject.fillColor = color;
        }
        
        // Set opacity back to 100%
        selectedObject.opacity = 100;
    }
}
