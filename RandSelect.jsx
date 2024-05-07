// Create main window
var mainPanelWindow = new Window('dialog', 'Random Selection', undefined);
mainPanelWindow.orientation = 'column';
mainPanelWindow.alignChildren = ['fill', 'fill'];

// Panel for selection method
var selectionMethodSelect = mainPanelWindow.add('panel', undefined, 'Selection Method:');
selectionMethodSelect.orientation = 'column';
selectionMethodSelect.alignChildren = ['fill', 'fill'];
var selMethodPercentageRadio = selectionMethodSelect.add('radiobutton', undefined, 'Percentage');
var selMethodCountRadio = selectionMethodSelect.add('radiobutton', undefined, 'Count');
selMethodPercentageRadio.value = true; // Default to percentage selection

// Panel for value input
var valueInputTextField = mainPanelWindow.add('panel', undefined, 'Value:');
valueInputTextField.orientation = 'row';
valueInputTextField.alignChildren = ['fill', 'fill'];
var selectionValue = valueInputTextField.add('edittext', undefined, 50);

// Buttons
var cancelAndOkButtons = mainPanelWindow.add('group');
cancelAndOkButtons.alignChildren = ['fill', 'fill'];
cancelAndOkButtons.margins = [0, 0, 0, 0];
var cancel = cancelAndOkButtons.add('button', undefined, 'Cancel');
cancel.helpTip = 'Press Esc to Close';
cancel.onClick = function() { mainPanelWindow.close(); }
var ok = cancelAndOkButtons.add('button', undefined, 'OK');
ok.helpTip = 'Press Enter to Run';
ok.onClick = function() { randomizeSelection(); mainPanelWindow.close(); };
ok.active = true;

// Function to randomize selection
function randomizeSelection() {
	// Check if there's an active document
	if (app.documents.length === 0) {
		alert("Error: No currently active document.");
		mainPanelWindow.close();
		return;
	}

	var objects = app.activeDocument.selection;

	// Check if there are enough objects selected
	if (objects.length < 2) {
		alert("Error: Please select at least two items. If more than two items are selected, make sure they're ungrouped.");
		return;
	}

	var selectionMethod = selMethodPercentageRadio.value ? 'percentage' : 'count';
	var value = parseFloat(selectionValue.text)
	if (isNaN(value)) {
		alert('Error: Could not parse entered value.');
		return;
	}

	var numberOfObjectsInFinalSelection = calculateNumberOfObjectsToSelect(objects.length, selectionMethod, value);

	if (numberOfObjectsInFinalSelection <= 0) { 
		app.activeDocument.selection = [];
		return;
	}

	if (numberOfObjectsInFinalSelection >= objects.length) {
		return;
	}

	var whatToDo = selectOrDeselect(objects.length, numberOfObjectsInFinalSelection);
	var deselect = whatToDo.deselect;
	var howManyTimes = whatToDo.number;

	var selectionIndexList = randomizedIndexListFischerYates(objects.length);
	if (!deselect) app.activeDocument.selection = [];

	for (i = 0; i < howManyTimes; i++) {
		var j = selectionIndexList[i];
		if (objects[j] !== undefined) {
			objects[j].selected = !deselect;
		}
	}
}

// Function to calculate number of objects to select
function calculateNumberOfObjectsToSelect(selectionLength, selectionMethod, value) {
	var numberOfObjectsToSelect = selectionMethod === 'percentage' 
		? Math.round(selectionLength * value / 100)
		: value

	if (numberOfObjectsToSelect <= 0) return 0;
	if (numberOfObjectsToSelect >= selectionLength) return selectionLength;

	return numberOfObjectsToSelect;
}

// Function to determine whether to select or deselect objects
function selectOrDeselect(selectionLength, numObjToSelect) {
	var deselect = false;
	var modeTippingPoint = 0.6;
	var remainingSelectionPercentage = numObjToSelect / selectionLength;
	if (remainingSelectionPercentage <= modeTippingPoint) {
		var numberOfItemsToOperateOn = numObjToSelect;
	} else {
		var numberOfItemsToOperateOn = selectionLength - numObjToSelect;
		deselect = true;
	}

	return { deselect: deselect, number: numberOfItemsToOperateOn };
}

// Function to shuffle array
function shuffleArray(array) {
	var curId = array.length;
	while (0 !== curId) {
		var randId = Math.floor(Math.random() * curId);
		curId -= 1;
		var tmp = array[curId];
		array[curId] = array[randId];
		array[randId] = tmp;
	}
	return array;
}

// Function to generate randomized index list
function randomizedIndexListFischerYates(length) {
	var randomizedArray = new Array();
	for (var i = 0; i < length; i++) {
		randomizedArray.push(i);
	}
	return shuffleArray(randomizedArray);
}

// Show window
mainPanelWindow.center();
mainPanelWindow.show();
