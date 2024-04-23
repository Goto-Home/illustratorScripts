// Prompt for CMYK values
var cyan = parseFloat(prompt("Enter Cyan value (0-100):"));
var magenta = parseFloat(prompt("Enter Magenta value (0-100):"));
var yellow = parseFloat(prompt("Enter Yellow value (0-100):"));
var black = parseFloat(prompt("Enter Black value (0-100):"));

// Get the active document
var doc = app.activeDocument;

// Get the active artboard
var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
var artboardRect = artboard.artboardRect;

// Set CMYK color
var color = new CMYKColor();
color.cyan = cyan;
color.magenta = magenta;
color.yellow = yellow;
color.black = black;

// Set text color
// var textColor = new CMYKColor();
// textColor.black = 100; // Black

// Calculate square position and size
var squareSize = 144; // 2 inches = 144 points
var centerX = (artboardRect[2] - artboardRect[0]) / 2 + artboardRect[0];
var centerY = (artboardRect[3] - artboardRect[1]) / 2 + artboardRect[1];
var left = centerX - squareSize / 2;
var top = centerY + squareSize / 2;
var right = left + squareSize;
var bottom = top - squareSize;

// Create square
var square = doc.pathItems.rectangle(top, left, squareSize, squareSize);
square.fillColor = color;
square.stroked = false;

// Create text label
var labelText = "CMYK (" + cyan + ", " + magenta + ", " + yellow + ", " + black + ")";
var textX = centerX;
var textY = (centerY - squareSize / 2) + 14; // Position at the bottom, inside edge
var textFrame = doc.textFrames.add();
textFrame.contents = labelText;
textFrame.textRange.characterAttributes.fillColor = color;
textFrame.position = [textX, textY];
textFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
