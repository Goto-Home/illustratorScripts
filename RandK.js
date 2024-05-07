var aDoc = app.activeDocument;
var aSel = aDoc.selection;
var nSel = aSel.length;

var kMin = Number(prompt("min K value (0-100)", 0));
var kMax = Number(prompt("max K value (0-100)", 100));

if (kMin > kMax) {
    var temp = kMin;
    kMin = kMax;
    kMax = temp;
}

if (kMin < 0) {
    kMin = 0;
}

if (kMax > 100) {
    kMax = 100;
}

for (var i = 0; i < nSel; i++) {
    // Generate a random K value within the specified range
    var randomK = Math.floor(Math.random() * (kMax - kMin + 1)) + kMin;
    
    // Set the K value of the selected object
    aSel[i].fillColor.black = randomK;
}
