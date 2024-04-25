
	var w; // window
	var p; // panel
	var g; // group
	
	var w = new Window("dialog", "CMYK Palette", undefined);
	
	p = w.add("panel");
	gInput = p.add("group");
	g = p.add("group");

	// g.orientation = "column";
	
	gInput.add("statictext", undefined, "C:");// Add labels for input fields
	var cInput = gInput.add("edittext", undefined, "0"); // Add input fields for CMYK values
	cInput.preferredSize.width = 60; // Set width of the input box

	gInput.add("statictext", undefined, "M:"); // Add labels for input fields
    var mInput = gInput.add("edittext", undefined, "0"); // Add input fields for CMYK values
	mInput.preferredSize.width = 60; // Set width of the input box

	// Add Submit or Cancel buttons
	var btnSubmit = g.add("button", undefined, "Submit");
	var btnCancel = g.add("button", undefined, "Cancel");
	
	// UI EVENT HANDLERS
	
	btnSubmit.onClick = function() {
		w.close(1);
	};
	
	btnCancel.onClick = function () {
		w.close(0);
	};

	// SHOW THE WINDOW
	
	// w.show();
	
	if(w.show() == 1) {
		alert("OK was clicked")
	}
	
