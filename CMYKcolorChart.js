// Get the active document
var doc = app.activeDocument;

// Get the active artboard
var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
var artboardRect = artboard.artboardRect;

// Prompt for CMYK values
var cyan = parseFloat(prompt("Enter Cyan value (0-100):"));
var magenta = parseFloat(prompt("Enter Magenta value (0-100):"));
var yellow = parseFloat(prompt("Enter Yellow value (0-100):"));
var black = parseFloat(prompt("Enter Black value (0-100):"));

// Prompt for color selection
var colorSelection = prompt("Enter the color to adjust (cyan, magenta, yellow, black):");

// Convert colorSelection to lowercase for case-insensitive comparison
colorSelection = colorSelection.toLowerCase();

// Prompt for CMYK step value
var stepSize = parseFloat(prompt("Enter CMYK step value (0-10):"));

if (isNaN(stepSize)) {
    stepSize = 5; // Default step size
} else if (stepSize < 0 || stepSize > 10) {
    alert("Step value must be between 0 and 10. Defaulting to 5.");
    stepSize = 5; // Default step size
}

// Adjust the selected color value based on user input
switch (colorSelection) {
    case "cyan":
	case "c":
        cyan += stepSize;
        break;
    case "magenta":
	case "m":
        magenta += stepSize;
        break;
    case "yellow":
	case "y":
        yellow += stepSize;
        break;
    case "black":
	case "b":
	case "k":
        black += stepSize;
        break;
    default:
        // Handle invalid color selection
        alert("Invalid color selection. Please choose from cyan, magenta, yellow, or black.");
        // Exit the script or handle the error accordingly
        break;
}

// Check if any of the colors are NaN and set them to 0 if true
if (isNaN(cyan)) {
    cyan = 0;
}
if (isNaN(magenta)) {
    magenta = 0;
}
if (isNaN(yellow)) {
    yellow = 0;
}
if (isNaN(black)) {
    black = 0;
}

// Set CMYK color for the origin square
var originColor = new CMYKColor();
originColor.cyan = cyan;
originColor.magenta = magenta;
originColor.yellow = yellow;
originColor.black = black;

// Calculate square size
var squareSize = 144; // 2 inches = 144 points

// Create an array to store the squares
var squares = [];

// Create origin square
var centerX = (artboardRect[2] - artboardRect[0]) / 2 + artboardRect[0];
var centerY = (artboardRect[3] - artboardRect[1]) / 2 + artboardRect[1];
var leftOrigin = centerX - squareSize / 2;
var topOrigin = centerY + squareSize / 2;

var originSquare = doc.pathItems.rectangle(topOrigin, leftOrigin, squareSize, squareSize);
originSquare.fillColor = originColor;
originSquare.stroked = false;

// Create text label for origin square
var labelText = "CMYK (" + cyan + ", " + magenta + ", " + yellow + ", " + black + ")";
var textX = centerX;
var textY = (centerY - squareSize / 2) + 14; // Position at the bottom, inside edge
var textFrame = doc.textFrames.add();
textFrame.contents = labelText;
textFrame.textRange.characterAttributes.fillColor = originColor;
textFrame.position = [textX, textY];
textFrame.textRange.paragraphAttributes.justification = Justification.CENTER;

// Create squares to the left
for (var i = 1; i <= 2; i++) {
    var left = leftOrigin - (i * squareSize * 1.25); // 2.5 inches center to center
    var cyanLeft = Math.max(0, cyan - (i * stepSize)); // Decrease cyan by step size

    // Create a unique CMYKColor object for each square
    var colorLeft = new CMYKColor();
    colorLeft.cyan = cyanLeft;
    colorLeft.magenta = magenta;
    colorLeft.yellow = yellow;
    colorLeft.black = black;

    // Create the square with its own unique color
    var squareLeft = doc.pathItems.rectangle(topOrigin, left, squareSize, squareSize);
    squareLeft.fillColor = colorLeft;
    squareLeft.stroked = false;
    
    // Create text label for left square
    var labelTextLeft = "CMYK (" + cyanLeft + ", " + magenta + ", " + yellow + ", " + black + ")";
    var textXLeft = left + squareSize / 2;
    var textFrameLeft = doc.textFrames.add();
    textFrameLeft.contents = labelTextLeft;
    textFrameLeft.textRange.characterAttributes.fillColor = colorLeft;
    textFrameLeft.position = [textXLeft, textY];
    textFrameLeft.textRange.paragraphAttributes.justification = Justification.CENTER;

    squares.push({square: squareLeft, textFrame: textFrameLeft});
}

// Create squares to the right
for (var j = 1; j <= 2; j++) {
    var left = leftOrigin + (j * squareSize * 1.25); // 2.5 inches center to center
    var cyanRight = Math.min(100, cyan + (j * stepSize)); // Increase cyan by step size

    // Create a unique CMYKColor object for each square
    var colorRight = new CMYKColor();
    colorRight.cyan = cyanRight;
    colorRight.magenta = magenta;
    colorRight.yellow = yellow;
    colorRight.black = black;

    // Create the square with its own unique color
    var squareRight = doc.pathItems.rectangle(topOrigin, left, squareSize, squareSize);
    squareRight.fillColor = colorRight;
    squareRight.stroked = false;

    // Create text label for right square
    var labelTextRight = "CMYK (" + cyanRight + ", " + magenta + ", " + yellow + ", " + black + ")";
    var textXRight = left + squareSize / 2;
    var textFrameRight = doc.textFrames.add();
    textFrameRight.contents = labelTextRight;
    textFrameRight.textRange.characterAttributes.fillColor = colorRight;
    textFrameRight.position = [textXRight, textY];
    textFrameRight.textRange.paragraphAttributes.justification = Justification.CENTER;

    squares.push({square: squareRight, textFrame: textFrameRight});
}

// Select just the far left square and textFrame at the end
originSquare.selected = true;
textFrame.selected = true;

// Replace "Your Action Name" with the name of your recorded action
var actionName = "pathfinder-compoundShape";

// Call the doScript method to run the action
app.doScript(actionName, "Default Actions");

// Deselect all items
doc.selection = null;

// Loop through each square and text frame in the squares array, starting from index 1
for (var i = 0; i < squares.length; i++) {
    // Select the square and text frame
    squares[i].square.selected = true;
    squares[i].textFrame.selected = true;

    // Call the doScript method to run the action
    app.doScript(actionName, "Default Actions");

    // Deselect all items
    doc.selection = null;
}
