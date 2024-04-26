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
var lInput; // How many steps left(down)
var rInput; // How many steps right(up) 
var sgd; // Select, Group, Deselect 
var c; // panel for create/close button
var g; // group

var w = new Window("dialog", "CMYK Palette", undefined);

p = w.add("panel");
gInput = p.add("group");
rbInput = p.add("group");
stepInput = p.add("group");
lInput = p.add("group");
rInput = p.add("group");
sGD = w.add("panel");
sgd = sGD.add("group");
c = w.add("panel");
g = c.add("group");

gInput.add("statictext", undefined, "C:");// Add labels for input fields
var cInput = gInput.add("edittext", undefined, "0"); // Add input fields for CMYK values
cInput.preferredSize.width = 60; // Set width of the input box

gInput.add("statictext", undefined, "M:"); // Add labels for input fields
var mInput = gInput.add("edittext", undefined, "0"); // Add input fields for CMYK values
mInput.preferredSize.width = 60; // Set width of the input box

gInput.add("statictext", undefined, "Y:"); // Add labels for input fields
var yInput = gInput.add("edittext", undefined, "0"); // Add input fields for CMYK values
yInput.preferredSize.width = 60; // Set width of the input box

gInput.add("statictext", undefined, "K:"); // Add labels for input fields
var kInput = gInput.add("edittext", undefined, "0"); // Add input fields for CMYK values
kInput.preferredSize.width = 60; // Set width of the input box

// Add radio buttons for CMYK selections
var cRadioButton = rbInput.add("radiobutton", undefined, "Cyan");
var mRadioButton = rbInput.add("radiobutton", undefined, "Magenta");
var yRadioButton = rbInput.add("radiobutton", undefined, "Yellow");
var kRadioButton = rbInput.add("radiobutton", undefined, "Black");

// Set the first radio button to be selected by default
cRadioButton.value = true;

// Enter your Step value for the CMYK values
stepInput.add("statictext", undefined, "Enter CMYK step value (0-10):");// Add labels for input fields
var stepSizeInput = stepInput.add("edittext", undefined, "5"); // Add input fields for CMYK values
stepSizeInput.preferredSize.width = 60; // Set width of the input box


// Enter the number of steps to increase or decrease CMYK values
lInput.add("statictext", undefined, "How many steps down (0-10):");// Add labels for input fields
var leftInput = lInput.add("edittext", undefined, "2"); // Add input fields for CMYK values
leftInput.preferredSize.width = 60; // Set width of the input box

rInput.add("statictext", undefined, "How many steps up (0-10):");// Add labels for input fields
var rightInput = rInput.add("edittext", undefined, "2"); // Add input fields for CMYK values
rightInput.preferredSize.width = 60; // Set width of the input box

// Group of buttons that Select everything visible on the artboard, Group 
var btnSelectAll = sgd.add("button", undefined, "Select All");
var btnGroup = sgd.add("button", undefined, "Group");
var btnDeselect = sgd.add("button", undefined, "Deselect All");

// Add Submit or Cancel buttons
var btnSubmit = g.add("button", undefined, "Create");
var btnClose = g.add("button", undefined, "Close");

// UI EVENT HANDLERS
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
			
			// Create text label for left square
			var labelTextLeft = "CMYK (" + adjustedCyanLeft + ", " + adjustedMagentaLeft + ", " + adjustedYellowLeft + ", " + adjustedBlackLeft + ")";
			var textXLeft = left + squareSize / 2;
			var textFrameLeft = doc.textFrames.add();
			textFrameLeft.contents = labelTextLeft;
			textFrameLeft.textRange.characterAttributes.fillColor = colorLeft;
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

		// Deselect all items
		doc.selection = null;

		// Select just the far left square and textFrame at the end
		originSquare.selected = true;
		textFrame.selected = true;

		// Replace "Your Action Name" with the name of your recorded action
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
		}
	
	
};

btnSelectAll.onClick = function () {
	selectAllItems(doc);
};

btnGroup.onClick = function () {
    groupSelectedItems(doc);
};

btnDeselect.onClick = function () {
	deselectAllItems(doc);
};

btnClose.onClick = function () {
	w.close();
};

// Function to select all items on the document
function selectAllItems(document) {
    // Deselect all items first
    document.selection = null;
    // Loop through all page items
    for (var i = 0; i < document.pageItems.length; i++) {
        var currentItem = document.pageItems[i];
        // Check if the item is visible
        if (!currentItem.hidden) {
            currentItem.selected = true;
        }
    }
}

// Function to group selected items
function groupSelectedItems(document) {
    // Check if there are any selected items
    if (document.selection.length > 1) {
        // Create a group
        var group = document.groupItems.add();
        // Add selected items to the group
        for (var i = 0; i < document.selection.length; i++) {
            var currentItem = document.selection[i];
            currentItem.move(group, ElementPlacement.PLACEATEND);
        }
    }
}

// Function to deselect all items on the document
function deselectAllItems(document) {
    // Deselect all items
    document.selection = null;
}

// SHOW THE WINDOW
w.show()
