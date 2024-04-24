
	var w; // window
	var p; // panel
	var g; // group
	
	w = new Window("dialog", "TITLE", undefined);
	w.orientation = "column";

	p = w.add("panel");
	g = p.add("group");
	var btnOk = g.add("button", undefined, "OK");
	var btnCancel = g.add("button", undefined, "Cancel");
	
	// UI EVENT HANDLERS
	
	btnOk.onClick = function() {
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
	
