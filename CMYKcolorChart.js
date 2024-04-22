// Prompt for CMYK values
var cyan = parseFloat(prompt("Enter Cyan value (0-100):"));
var magenta = parseFloat(prompt("Enter Magenta value (0-100):"));
var yellow = parseFloat(prompt("Enter Yellow value (0-100):"));
var black = parseFloat(prompt("Enter Black value (0-100):"));

// Create a new document
var doc = app.documents.add();

// Set CMYK color
var color = new CMYKColor();
color.cyan = cyan;
color.magenta = magenta;
color.yellow = yellow;
color.black = black;

// Calculate square position and size
var squareSize = 144; // 2 inches = 144 points
var artboard = doc.artboards[0];
var centerX = artboard.artboardRect[2] / 2;
var centerY = artboard.artboardRect[3] / 2;
var left = centerX - squareSize / 2;
var top = centerY + squareSize / 2;
var right = left + squareSize;
var bottom = top - squareSize;

// Create square
var square = doc.pathItems.rectangle(top, left, squareSize, squareSize);
square.fillColor = color;

// Create text label
var labelText = "CMYK (" + cyan + ", " + magenta + ", " + yellow + ", " + black + ")";
var textX = centerX;
var textY = centerY - squareSize / 2 + 5; // Position at the bottom, inside edge
var textFrame = doc.textFrames.add();
textFrame.contents = labelText;
textFrame.textRange.characterAttributes.fillColor = textColor;
textFrame.position = [textX, textY];
textFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
