// Event listeners for difficulty buttons
document.getElementById('easy').addEventListener('click', () => startGame(2, 15, 'easy'));
document.getElementById('medium').addEventListener('click', () => startGame(3, 25, 'medium'));
document.getElementById('hard').addEventListener('click', () => startGame(4, 35, 'hard'));
document.getElementById('impossible').addEventListener('click', () => {
    const ballCount = localStorage.getItem('selectedDevice') === 'phone' ? 
        Math.floor(60 / 2) : // Reduce balls by 1.3x for phone
        60;                     // Original count for computer
    startGame(4, ballCount, 'impossible');
});

// Back to the main menu
document.querySelector('.overlay a').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'index.html';  // Navigate back to main menu
});

// Initialize the top runs list for each difficulty
['easy', 'medium', 'hard', 'impossible'].forEach(difficulty => updateTopRunsList(difficulty));

// Add device selection state
let selectedDevice = localStorage.getItem('selectedDevice') || 'computer';

// Device selection handling
function initDeviceSelection() {
    const computerBtn = document.getElementById('computerDevice');
    const phoneBtn = document.getElementById('phoneDevice');
    
    // Set initial state
    updateDeviceButtons();
    
    computerBtn.addEventListener('click', () => {
        selectedDevice = 'computer';
        localStorage.setItem('selectedDevice', selectedDevice);
        updateDeviceButtons();
        updateViewportScale(false);
    });
    
    phoneBtn.addEventListener('click', () => {
        selectedDevice = 'phone';
        localStorage.setItem('selectedDevice', selectedDevice);
        updateDeviceButtons();
        updateViewportScale(true);
    });

    // Set initial viewport scale based on stored device
    updateViewportScale(selectedDevice === 'phone');
}

function updateViewportScale(isMobile) {
    const viewport = document.querySelector('meta[name=viewport]');
    if (isMobile) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, orientation=landscape');
        checkOrientation();
    } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        hideRotationOverlay();
    }
}

function checkOrientation() {
    if (selectedDevice === 'phone') {
        if (window.innerHeight > window.innerWidth) {
            showRotationOverlay();
        } else {
            hideRotationOverlay();
        }
    }
}

function showRotationOverlay() {
    const overlay = document.querySelector('.rotation-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideRotationOverlay() {
    const overlay = document.querySelector('.rotation-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Add orientation change listener
window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 100);
});

window.addEventListener('resize', () => {
    if (selectedDevice === 'phone') {
        checkOrientation();
    }
});

function updateDeviceButtons() {
    const computerBtn = document.getElementById('computerDevice');
    const phoneBtn = document.getElementById('phoneDevice');
    
    computerBtn.classList.toggle('selected', selectedDevice === 'computer');
    phoneBtn.classList.toggle('selected', selectedDevice === 'phone');
}

// Initialize device selection
initDeviceSelection();
