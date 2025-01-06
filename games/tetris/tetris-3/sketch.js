const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Tetromino shapes
const PIECES = [
    [ // I - 4x4
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [ // L - 3x3
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [ // J - 3x3
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [ // O - 2x2 (special case)
        [1, 1],
        [1, 1]
    ],
    [ // S - 3x3
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [ // T - 3x3
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [ // Z - 3x3
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
];

const COLORS = ['#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'];

// Modify board initialization to store color indices
let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));

let piece = {
    pos: {x: 0, y: 0},
    shape: null,
    color: null
};

let nextPiece = {
    shape: null,
    color: null
};

let holdPiece = {
    shape: null,
    color: null
};
let canHold = true;

let score = 0;
const POINTS_PER_LINE = 100;

// Wall kick data (SRS - Super Rotation System)
const WALL_KICK_DATA = {
    'JLSTZ': [ // for J, L, S, T, Z pieces
        [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], // 0->R
        [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],     // R->2
        [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],    // 2->L
        [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]   // L->0
    ],
    'I': [ // for I piece
        [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],   // 0->R
        [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],   // R->2
        [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],   // 2->L
        [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]    // L->0
    ]
};

let rotationState = 0; // 0: spawn, 1: right, 2: 180, 3: left

function getKickData(pieceType) {
    return pieceType === 'I' ? WALL_KICK_DATA['I'] : WALL_KICK_DATA['JLSTZ'];
}

function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function reverseRows(matrix) {
    return matrix.map(row => [...row].reverse());
}

function createPiece() {
    if (nextPiece.shape === null) {
        const pieceIndex = Math.floor(Math.random() * PIECES.length);
        nextPiece.shape = PIECES[pieceIndex];
        nextPiece.color = COLORS[pieceIndex];
    }
    
    piece.shape = nextPiece.shape;
    piece.color = nextPiece.color;
    piece.pos.x = Math.floor(BOARD_WIDTH / 2 - piece.shape[0].length / 2);
    piece.pos.y = 0;

    // Generate new next piece
    const pieceIndex = Math.floor(Math.random() * PIECES.length);
    nextPiece.shape = PIECES[pieceIndex];
    nextPiece.color = COLORS[pieceIndex];

    rotationState = 0; // Reset rotation state for new piece
    canHold = true;
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
        ctx.stroke();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawBoard();
    drawGhostPiece();
    drawPiece();
    updateSidePanel();
}

function drawPiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillStyle = piece.color;
                ctx.fillRect(
                    (piece.pos.x + x) * BLOCK_SIZE,
                    (piece.pos.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
                ctx.strokeStyle = 'black';
                ctx.strokeRect(
                    (piece.pos.x + x) * BLOCK_SIZE,
                    (piece.pos.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
            }
        });
    });
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = COLORS[value - 1];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function drawNextPiece() {
    // Draw preview box
    const previewX = (BOARD_WIDTH + 1) * BLOCK_SIZE;
    const previewY = BLOCK_SIZE;
    const boxSize = 5 * BLOCK_SIZE;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(previewX, previewY, boxSize, boxSize);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(previewX, previewY, boxSize, boxSize);

    // Draw the next piece
    if (nextPiece.shape) {
        const offsetX = previewX + (boxSize - nextPiece.shape[0].length * BLOCK_SIZE) / 2;
        const offsetY = previewY + (boxSize - nextPiece.shape.length * BLOCK_SIZE) / 2;

        nextPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    ctx.fillStyle = nextPiece.color;
                    ctx.fillRect(
                        offsetX + x * BLOCK_SIZE,
                        offsetY + y * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(
                        offsetX + x * BLOCK_SIZE,
                        offsetY + y * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                }
            });
        });
    }
}

// Add these constants near the top with other constants
const LINE_CLEAR_SCORES = {
    1: 100,   // Single
    2: 300,   // Double
    3: 500,   // Triple
    4: 800    // Tetris
};
let level = 1;
let totalLinesCleared = 0;
const LINES_PER_LEVEL = 10;
let dropScore = 0;

// Add these constants near the top with other constants
const LOCK_DELAY = 500;
const DROP_SPEED = 1000;
let lockDelayTimer = 0;
let dropCounter = 0;
let lastTime = 0;
let isLocking = false;

// Add these variables near the top with other global variables
let gameActive = true;

// Add this function near other initialization functions
function resetGame() {
    board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    score = 0;
    level = 1;
    totalLinesCleared = 0;
    dropScore = 0;
    gameActive = true;
    holdPiece = {
        shape: null,
        color: null
    };
    nextPiece = {
        shape: null,
        color: null
    };
    createPiece();
    draw();
}

// Replace the update function
function update(deltaTime) {
    dropCounter += deltaTime;
    const dropInterval = Math.max(50, DROP_SPEED - (level - 1) * 50);

    if (dropCounter > dropInterval) {
        piece.pos.y++;
        if (checkCollision()) {
            piece.pos.y--;
            if (!isLocking) {
                isLocking = true;
                lockDelayTimer = 0;
            }
        } else {
            isLocking = false;
            lockDelayTimer = 0;
        }
        dropCounter = 0;
    }

    if (isLocking) {
        lockDelayTimer += deltaTime;
        if (lockDelayTimer >= LOCK_DELAY) {
            mergePiece();
            createPiece();
            isLocking = false;
            lockDelayTimer = 0;
        }
    }
}

// Update movement functions
function moveLeft() {
    piece.pos.x--;
    if (checkCollision()) {
        piece.pos.x++;
    } else if (isLocking) {
        lockDelayTimer = 0;
    }
}

function moveRight() {
    piece.pos.x++;
    if (checkCollision()) {
        piece.pos.x--;
    } else if (isLocking) {
        lockDelayTimer = 0;
    }
}

function moveDown() {
    piece.pos.y++;
    if (checkCollision()) {
        piece.pos.y--;
        if (!isLocking) {
            isLocking = true;
            lockDelayTimer = 0;
        }
    } else {
        dropScore += 1;
        if (isLocking) {
            isLocking = false;
            lockDelayTimer = 0;
        }
    }
}

// Add this helper function at the top with other functions
function rotateMatrix(matrix) {
    const N = matrix.length;
    const result = new Array(N).fill().map(() => new Array(N).fill(0));
    
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            result[j][N - 1 - i] = matrix[i][j];
        }
    }
    return result;
}

// Replace ALL rotation-related functions with just this one simple rotate function
function rotate() {
    const originalShape = piece.shape;
    const originalX = piece.pos.x;
    const originalY = piece.pos.y;

    piece.shape = rotateMatrix(piece.shape);

    if (checkCollision()) {
        piece.pos.x--;
        if (checkCollision()) {
            piece.pos.x += 2;
            if (checkCollision()) {
                piece.shape = originalShape;
                piece.pos.x = originalX;
                piece.pos.y = originalY;
            }
        }
    }

    if (!checkCollision()) {
        lockDelayTimer = 0;
    }
}

// Update event listeners to be simpler
document.addEventListener('keydown', event => {
    switch(event.keyCode) {
        case 37: // Left
            moveLeft();
            break;
        case 39: // Right
            moveRight();
            break;
        case 40: // Down
            moveDown();
            break;
        case 38: // Up
            rotate(); // This should now work properly
            break;
        case 32: // Space
            hardDrop();
            break;
        case 67: // c
            holdCurrentPiece();
            break;
    }
});

// Remove the keyup event listener since we're not using DAS anymore

// ...existing code...

// Update gameLoop function
function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    if (gameActive) {
        update(deltaTime);
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// Update moveDown to include soft drop scoring
function moveDown() {
    piece.pos.y++;
    if (checkCollision()) {
        piece.pos.y--;
        mergePiece();
        createPiece();
    } else {
        dropScore += 1; // Add 1 point per cell for soft drop
    }
}

function checkCollision(p = piece) {
    return p.shape.some((row, dy) => {
        return row.some((value, dx) => {
            if (value !== 0) {
                const newX = p.pos.x + dx;
                const newY = p.pos.y + dy;
                return (
                    newX < 0 || 
                    newX >= BOARD_WIDTH ||
                    newY >= BOARD_HEIGHT ||
                    (board[newY] && board[newY][newX] !== 0)
                );
            }
            return false;
        });
    });
}

// Update hardDrop to include hard drop scoring
function hardDrop() {
    let dropDistance = 0;
    while (!checkCollision()) {
        piece.pos.y++;
        dropDistance++;
    }
    piece.pos.y--;
    dropScore += dropDistance * 2; // Add 2 points per cell for hard drop
    mergePiece();
    createPiece();
}

// Update clearLines function
function clearLines() {
    let linesCleared = 0;
    outer: for (let y = board.length - 1; y >= 0; y--) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        linesCleared++;
        y++;
    }
    
    if (linesCleared > 0) {
        // Add line clear score multiplied by level
        score += LINE_CLEAR_SCORES[linesCleared] * level;
        // Add drop score
        score += dropScore;
        dropScore = 0;
        
        // Update total lines and level
        totalLinesCleared += linesCleared;
        level = Math.floor(totalLinesCleared / LINES_PER_LEVEL) + 1;
        
        updateSidePanel();
    }
    return linesCleared;
}

function mergePiece() {
    const colorIndex = COLORS.indexOf(piece.color);
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + piece.pos.y][x + piece.pos.x] = colorIndex + 1; // +1 because 0 is empty
            }
        });
    });
    clearLines(); // Call clearLines after merging a piece
}

function getDropPosition() {
    let dropPos = { ...piece.pos };
    while (!checkCollision({ ...piece, pos: dropPos })) {
        dropPos.y++;
    }
    dropPos.y--;
    return dropPos;
}

function drawGhostPiece() {
    const dropPos = getDropPosition();
    ctx.globalAlpha = 0.3;
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = piece.color;
                ctx.fillRect(
                    (dropPos.x + x) * BLOCK_SIZE,
                    (dropPos.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
                ctx.strokeStyle = 'white';
                ctx.strokeRect(
                    (dropPos.x + x) * BLOCK_SIZE,
                    (dropPos.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE,
                    BLOCK_SIZE
                );
            }
        });
    });
    ctx.globalAlpha = 1;
}

// Update updateSidePanel to show level
function updateSidePanel() {
    const previewX = (BOARD_WIDTH + 1) * BLOCK_SIZE;
    const boxSize = 5 * BLOCK_SIZE;
    
    // Clear side panel area
    ctx.fillStyle = '#34495e';
    ctx.fillRect(previewX, 0, boxSize, canvas.height);

    // Draw next piece preview
    drawNextPiece();
    
    // Draw hold piece
    drawHoldPiece();

    // Draw score (moved down a bit)
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Score:', previewX + boxSize/2, 13 * BLOCK_SIZE);
    ctx.fillText(score, previewX + boxSize/2, 14 * BLOCK_SIZE);
    
    // Draw level
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Level:', previewX + boxSize/2, 15 * BLOCK_SIZE);
    ctx.fillText(level, previewX + boxSize/2, 16 * BLOCK_SIZE);
    
    // Draw lines
    ctx.fillText('Lines:', previewX + boxSize/2, 17 * BLOCK_SIZE);
    ctx.fillText(totalLinesCleared, previewX + boxSize/2, 18 * BLOCK_SIZE);

    // Draw restart button
    const buttonX = previewX + boxSize/4;
    const buttonY = 19 * BLOCK_SIZE;
    const buttonWidth = boxSize/2;
    const buttonHeight = BLOCK_SIZE;
    
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Restart', buttonX + buttonWidth/2, buttonY + buttonHeight*0.7);
}

function holdCurrentPiece() {
    if (!canHold) return;
    
    if (holdPiece.shape === null) {
        holdPiece.shape = piece.shape;
        holdPiece.color = piece.color;
        createPiece();
    } else {
        const tempShape = piece.shape;
        const tempColor = piece.color;
        piece.shape = holdPiece.shape;
        piece.color = holdPiece.color;
        holdPiece.shape = tempShape;
        holdPiece.color = tempColor;
        
        // Reset position
        piece.pos.x = Math.floor(BOARD_WIDTH / 2 - piece.shape[0].length / 2);
        piece.pos.y = 0;
    }
    canHold = false;
}

function drawHoldPiece() {
    const holdX = (BOARD_WIDTH + 1) * BLOCK_SIZE;
    const holdY = 7 * BLOCK_SIZE;
    const boxSize = 5 * BLOCK_SIZE;
    
    // Draw hold box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(holdX, holdY, boxSize, boxSize);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(holdX, holdY, boxSize, boxSize);
    
    // Draw "HOLD" text
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HOLD', holdX + boxSize/2, holdY - 10);

    // Draw the held piece
    if (holdPiece.shape) {
        const offsetX = holdX + (boxSize - holdPiece.shape[0].length * BLOCK_SIZE) / 2;
        const offsetY = holdY + (boxSize - holdPiece.shape.length * BLOCK_SIZE) / 2;

        holdPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    ctx.fillStyle = canHold ? holdPiece.color : '#666666';
                    ctx.fillRect(
                        offsetX + x * BLOCK_SIZE,
                        offsetY + y * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(
                        offsetX + x * BLOCK_SIZE,
                        offsetY + y * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                }
            });
        });
    }
}

// Add click handler for restart button
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const buttonX = (BOARD_WIDTH + 1) * BLOCK_SIZE + 5 * BLOCK_SIZE/4;
    const buttonY = 19 * BLOCK_SIZE;
    const buttonWidth = 5 * BLOCK_SIZE/2;
    const buttonHeight = BLOCK_SIZE;
    
    if (clickX >= buttonX && clickX <= buttonX + buttonWidth &&
        clickY >= buttonY && clickY <= buttonY + buttonHeight) {
        resetGame();
    }
});

// Add keydown handler for restart
document.addEventListener('keydown', event => {
    if (event.key === 'r') {
        resetGame();
    }
});

createPiece();
gameLoop();