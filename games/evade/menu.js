// Event listeners for difficulty buttons
document.getElementById('easy').addEventListener('click', () => startGame(2, 15, 'easy'));
document.getElementById('medium').addEventListener('click', () => startGame(3, 25, 'medium'));
document.getElementById('hard').addEventListener('click', () => startGame(4, 35, 'hard'));
document.getElementById('impossible').addEventListener('click', () => startGame(4, 60, 'impossible'));

// Back to the main menu
document.querySelector('.overlay a').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'index.html';  // Navigate back to main menu
});

// Initialize the top runs list for each difficulty
['easy', 'medium', 'hard', 'impossible'].forEach(difficulty => updateTopRunsList(difficulty));
