// Create a temporary canvas element
var canvas = document.createElement("canvas");
// Get the 2D rendering context
var context = canvas.getContext("2d");

// Create a function to generate a canvas fingerprint
function generateCanvasFingerprint() {
  // Set the canvas dimensions
  canvas.width = 200;
  canvas.height = 30;

  // Generate a unique text string
  var text = "Canvas fingerprint";

  // Set the canvas font and color
  context.font = "12px Arial";
  context.fillStyle = "#f00";

  // Draw the text on the canvas
  context.fillText(text, 10, 20);

  // Get the base64-encoded image data
  var imageData = canvas.toDataURL();

  // Calculate the hash of the image data
  var hash = hashCode(imageData);

  // Return the canvas fingerprint
  return hash;
}

// Function to calculate the hash code
function hashCode(str) {
  var hash = 0;
  if (str.length === 0) return hash;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Check if the canvas fingerprint is different on page load
var initialCanvasFingerprint = generateCanvasFingerprint();

window.addEventListener("load", function() {
  var currentCanvasFingerprint = generateCanvasFingerprint();
  if (currentCanvasFingerprint !== initialCanvasFingerprint) {
    window.alert("Canvas fingerprinting detected!");
    // Perform actions when canvas fingerprinting is detected
  } else {
    window.alert("No canvas fingerprinting detected.");
    // Perform actions when canvas fingerprinting is not detected
  }
});