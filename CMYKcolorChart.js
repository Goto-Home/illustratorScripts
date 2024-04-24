// Get the active document
var doc = app.activeDocument;

// Get the active artboard
var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
var artboardRect = artboard.artboardRect;

// Prompt for valid CMYK values || "or" sets them to 0 if NaN
var cyanInput = parseFloat(prompt("Enter Cyan value (0-100):")) || 0;
var magentaInput = parseFloat(prompt("Enter Magenta value (0-100):")) || 0;
var yellowInput = parseFloat(prompt("Enter Yellow value (0-100):")) || 0;
var blackInput = parseFloat(prompt("Enter Black value (0-100):")) || 0;

// Validate and adjust parsed values
var cyan = Math.min(Math.max(cyanInput, 0), 100);
var magenta = Math.min(Math.max(magentaInput, 0), 100);
var yellow = Math.min(Math.max(yellowInput, 0), 100);
var black = Math.min(Math.max(blackInput, 0), 100);

// Set CMYK color for the origin square
var originColor = new CMYKColor();
originColor.cyan = cyan;
originColor.magenta = magenta;
originColor.yellow = yellow;
originColor.black = black;

// Store original CMYK values
var originalCyan = cyan;
var originalMagenta = magenta;
var originalYellow = yellow;
var originalBlack = black;

// Prompt for color selection
var colorSelection = prompt("Enter the color to adjust (cyan, magenta, yellow, black):").toLowerCase(); 

// Prompt for CMYK step value
var stepSize = parseFloat(prompt("Enter CMYK step value (0-10):"));
if (isNaN(stepSize) || stepSize < 0 || stepSize > 10) {
    stepSize = 5; // Default stepSize if invalid input
    alert("Step value must be between 0 and 10. Defaulting to 5.");
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

// Adjusted CMYK values based on color selection and step size
var adjustedCyan = originalCyan;
var adjustedMagenta = originalMagenta;
var adjustedYellow = originalYellow;
var adjustedBlack = originalBlack;

switch (colorSelection) {
    case "cyan":
    case "c":
        adjustedCyan = cyan;
        break;
    case "magenta":
    case "m":
        adjustedMagenta = magenta;
        break;
    case "yellow":
    case "y":
        adjustedYellow = yellow;
        break;
    case "black":
    case "b":
    case "k":
        adjustedBlack = black;
        break;
    default:
        break;
}

// Calculate square size
var squareSize = 144; // 2 inches = 144 points

// Create an array to store the squares
var squares = [];

// Create origin square
var centerX = (artboardRect[2] - artboardRect[0]) / 2 + artboardRect[0];
var centerY = (artboardRect[3] - artboardRect[1]) / 2 + artboardRect[1];
var leftOrigin = centerX - squareSize / 2;
var topOrigin = centerY + squareSize / 2;

// Create origin square location
var originSquare = doc.pathItems.rectangle(topOrigin, leftOrigin, squareSize, squareSize);
originSquare.fillColor = originColor;
originSquare.stroked = false;

// Create text label for origin square
var labelText = "CMYK (" + originalCyan + ", " + originalMagenta + ", " + originalYellow + ", " + originalBlack + ")";
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

    // Create a unique CMYKColor object for each square
    var colorLeft = new CMYKColor();
    colorLeft.cyan = adjustedCyan;
    colorLeft.magenta = adjustedMagenta;
    colorLeft.yellow = adjustedYellow;
    colorLeft.black = adjustedBlack;

    // Create the square with its own unique color
    var squareLeft = doc.pathItems.rectangle(topOrigin, left, squareSize, squareSize);
    squareLeft.fillColor = colorLeft;
    squareLeft.stroked = false;
    
    // Create text label for left square
    var labelTextLeft = "CMYK (" + adjustedCyan + ", " + adjustedMagenta + ", " + adjustedYellow + ", " + adjustedBlack + ")";
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
 
    // Adjusted CMYK values for right squares
    var adjustedCyanRight = originalCyan;
    var adjustedMagentaRight = originalMagenta;
    var adjustedYellowRight = originalYellow;
    var adjustedBlackRight = originalBlack;

    switch (colorSelection) {
        case "cyan":
        case "c":
            adjustedCyanRight += j * stepSize; // Increase cyan by step size
            break;
        case "magenta":
        case "m":
            adjustedMagentaRight += j * stepSize; // Increase magenta by step size
            break;
        case "yellow":
        case "y":
            adjustedYellowRight += j * stepSize; // Increase yellow by step size
            break;
        case "black":
        case "b":
        case "k":
            adjustedBlackRight += j * stepSize; // Increase black by step size
            break;
        default:
            break;
    }

    // Create a unique CMYKColor object for each square
    var colorRight = new CMYKColor();
    colorRight.cyan = adjustedCyanRight;
    colorRight.magenta = adjustedMagentaRight;
    colorRight.yellow = adjustedYellowRight;
    colorRight.black = adjustedBlackRight;

    // Create the square with its own unique color
    var squareRight = doc.pathItems.rectangle(topOrigin, left, squareSize, squareSize);
    squareRight.fillColor = colorRight;
    squareRight.stroked = false;

    // Create text label for right square
    var labelTextRight = "CMYK (" + adjustedCyanRight + ", " + adjustedMagentaRight + ", " + adjustedYellowRight + ", " + adjustedBlackRight + ")";
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
