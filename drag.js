    
// Get the label element
const scrollLabel = document.getElementById('scrollLabel');
let labelHidden = false;

// Detect scrollbar interaction
let isDragging = false;
window.addEventListener('mousedown', () => {
    isDragging = true;
});

window.addEventListener('mousemove', () => {
    if (isDragging && !labelHidden) {
        // Hide the label after interaction
        scrollLabel.classList.add('hidden');
        labelHidden = true;
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});