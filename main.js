#target illustrator
#targetengine main

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

// Main window function
btnSubmit.onClick = function() {
		
	var cyanInput = parseInt(cInput.text);
	var magentaInput = parseInt(mInput.text);
	var yellowInput = parseInt(yInput.text);
	var blackInput = parseInt(kInput.text);
	var stepLeft = parseInt(leftInput.text);
	var stepRight = parseInt(rightInput.text);
			
	// Validate and adjust parsed values
	var cyan = Math.min(Math.max(cyanInput, 0), 100);
	var magenta = Math.min(Math.max(magentaInput, 0), 100);
	var yellow = Math.min(Math.max(yellowInput, 0), 100);
	var black = Math.min(Math.max(blackInput, 0), 100);
	var leftStep = Math.min(Math.max(stepLeft, 0), 10);
	var rightStep = Math.min(Math.max(stepRight, 0), 10);

	// Store original CMYK values
	var originalCyan = cyan;
	var originalMagenta = magenta;
	var originalYellow = yellow;
	var originalBlack = black;

	// Retrieve the selected radio button for color selection
	var colorSelection;
	if (cRadioButton.value) {
		colorSelection = "cyan";
	} else if (mRadioButton.value) {
		colorSelection = "magenta";
	} else if (yRadioButton.value) {
		colorSelection = "yellow";
	} else if (kRadioButton.value) {
		colorSelection = "black";
	}

	// Prompt for CMYK step value
	var stepSize = parseInt(stepSizeInput.text);
	if (isNaN(stepSize) || stepSize < 0 || stepSize > 10) {
		stepSize = 5; // Default stepSize if invalid input
		alert("Step value must be between 0 and 10. Defaulting to 5.");
	}

	// Set CMYK color for the origin square
	var originColor = new CMYKColor();
	originColor.cyan = originalCyan;
	originColor.magenta = originalMagenta;
	originColor.yellow = originalYellow;
	originColor.black = originalBlack;

	// Set text color
	var textColor = new CMYKColor();
	textColor.black = 100;

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

	// Text fill color selector
	var textOColor;
	if (blackText.value) {
		textOColor = textColor;
	} else if (clearText.value) {
		textOColor = originColor;
	}

	// Create text label for origin square
	var labelText = "(" + originalCyan + ", " + originalMagenta + ", " + originalYellow + ", " + originalBlack + ")";
	var textX = centerX;
	var textY = (centerY - squareSize / 2) + 14; // Position at the bottom, inside edge
	var textFrame = doc.textFrames.add();
	textFrame.contents = labelText;
	textFrame.textRange.characterAttributes.fillColor = textOColor;
	textFrame.position = [textX, textY];
	textFrame.textRange.paragraphAttributes.justification = Justification.CENTER;

	// Create squares to the left
	for (var i = 1; i <= leftStep; i++) {
			var left = leftOrigin - (i * squareSize * 1.25); // 2.5 inches center to center

				// Adjusted CMYK values based on color selection and step size
			var adjustedCyanLeft = originalCyan;
			var adjustedMagentaLeft = originalMagenta;
			var adjustedYellowLeft = originalYellow;
			var adjustedBlackLeft = originalBlack;

			switch (colorSelection) {
				case "cyan":
					adjustedCyanLeft -= i * stepSize;
					adjustedCyanLeft = Math.min(Math.max(adjustedCyanLeft, 0), 100);
					break;
				case "magenta":
					adjustedMagentaLeft -= i * stepSize;
					adjustedMagentaLeft = Math.min(Math.max(adjustedMagentaLeft, 0), 100);
					break;
				case "yellow":
					adjustedYellowLeft -= i * stepSize;
					adjustedYellowLeft = Math.min(Math.max(adjustedYellowLeft, 0), 100);
					break;
				case "black":
					adjustedBlackLeft -= i * stepSize;
					adjustedBlackLeft = Math.min(Math.max(adjustedBlackLeft, 0), 100);
					break;
				default:
					break;
			}

			// Create a unique CMYKColor object for each square
			var colorLeft = new CMYKColor();
			colorLeft.cyan = adjustedCyanLeft;
			colorLeft.magenta = adjustedMagentaLeft;
			colorLeft.yellow = adjustedYellowLeft;
			colorLeft.black = adjustedBlackLeft;

			// Create the square with its own unique color
			var squareLeft = doc.pathItems.rectangle(topOrigin, left, squareSize, squareSize);
			squareLeft.fillColor = colorLeft;
			squareLeft.stroked = false;

			// Text fill color selector
			var textLColor;
			if (blackText.value) {
				textLColor = textColor;
			} else if (clearText.value) {
				textLColor = colorLeft;
			}
			
			// Create text label for left square
			var labelTextLeft = "(" + adjustedCyanLeft + ", " + adjustedMagentaLeft + ", " + adjustedYellowLeft + ", " + adjustedBlackLeft + ")";
			var textXLeft = left + squareSize / 2;
			var textFrameLeft = doc.textFrames.add();
			textFrameLeft.contents = labelTextLeft;
			textFrameLeft.textRange.characterAttributes.fillColor = textLColor;
			textFrameLeft.position = [textXLeft, textY];
			textFrameLeft.textRange.paragraphAttributes.justification = Justification.CENTER;

			squares.push({square: squareLeft, textFrame: textFrameLeft});
	}

	// Create squares to the right
	for (var j = 1; j <= rightStep; j++) {
			var left = leftOrigin + (j * squareSize * 1.25); // 2.5 inches center to center

			// Adjusted CMYK values for right squares
			var adjustedCyanRight = originalCyan;
			var adjustedMagentaRight = originalMagenta;
			var adjustedYellowRight = originalYellow;
			var adjustedBlackRight = originalBlack;

			switch (colorSelection) {
				case "cyan":
					adjustedCyanRight += j * stepSize; // Increase cyan by step size
					adjustedCyanRight = Math.min(Math.max(adjustedCyanRight, 0), 100);
					break;
				case "magenta":
					adjustedMagentaRight += j * stepSize; // Increase magenta by step size
					adjustedMagentaRight = Math.min(Math.max(adjustedMagentaRight, 0), 100);
					break;
				case "yellow":
					adjustedYellowRight += j * stepSize; // Increase yellow by step size
					adjustedYellowRight = Math.min(Math.max(adjustedYellowRight, 0), 100);
					break;
				case "black":
					adjustedBlackRight += j * stepSize; // Increase black by step size
					adjustedBlackRight = Math.min(Math.max(adjustedBlackRight, 0), 100);
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

			// Text fill color selector
			var textRColor
			if (blackText.value) {
				textRColor = textColor;
			} else if (clearText.value) {
				textRColor = colorRight;
			}

			// Create text label for right square
			var labelTextRight = "(" + adjustedCyanRight + ", " + adjustedMagentaRight + ", " + adjustedYellowRight + ", " + adjustedBlackRight + ")";
			var textXRight = left + squareSize / 2;
			var textFrameRight = doc.textFrames.add();
			textFrameRight.contents = labelTextRight;
			textFrameRight.textRange.characterAttributes.fillColor = textRColor;
			textFrameRight.position = [textXRight, textY];
			textFrameRight.textRange.paragraphAttributes.justification = Justification.CENTER;

			squares.push({square: squareRight, textFrame: textFrameRight});
	}

	// Text fill color selector
	if (blackText.value) {
		textGroup();
	} else if (clearText.value) {
		clearTextFX();
	}

	function textGroup() {
		// Deselect all items
		doc.selection = null;

		// Select just the far left square and textFrame at the end
		originSquare.selected = true;
		textFrame.selected = true;

		// Loop through each square and text frame in the squares array, starting from index 1
		for (var i = 0; i < squares.length; i++) {
			// Select the square and text frame
			squares[i].square.selected = true;
			squares[i].textFrame.selected = true;
		};

			// Replace "group" with the name of your recorded action
			const actionName = "group";
			// Call the doScript method to run the action
			app.doScript(actionName, "Default Actions");

			// Deselect all items
			doc.selection = null;
	}

	function clearTextFX() {
		// Deselect all items
		doc.selection = null;

		// Select just the far left square and textFrame at the end
		originSquare.selected = true;
		textFrame.selected = true;

		// Replace "pathfinder-compoundShape" with the name of your recorded action
		const actionName = "pathfinder-compoundShape";

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
		};
		// Select just the far left square and textFrame at the end
		originSquare.selected = true;
		textFrame.selected = true;
		
		// Loop through each square and text frame in the squares array, starting from index 1
		for (var i = 0; i < squares.length; i++) {
			// Select the square and text frame
			squares[i].square.selected = true;
			squares[i].textFrame.selected = true;
		};
		
			// Call the doScript method to run the action
			app.doScript("group", "Default Actions");
		
			// Deselect all items
			doc.selection = null;
	}
	
};

btnClose.onClick = function () {
	w.close();
};

// SHOW THE WINDOW
w.show()
