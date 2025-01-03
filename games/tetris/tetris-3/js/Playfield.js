class Playfield {
    constructor(w, h) {
		this.score = 0;
        // Colors
        this.foreground = [240]; // Empty cells color
        this.background = [50]; // Dark gray background

        // Dimensions and grid
        this.cols = w;
        this.rows = h;
        this.grid = [];
        this.resetGrid();

        // Drawing sizes
        this.cellSize = 21;
        this.borderSize = 3;

        // Gridline options
        this.gridlines = true;
        this.gridlinesColor = '#000'; // Black gridlines
    }

    addToGrid(piece) {
        for (let row = 0; row < piece.size; row++) {
            for (let col = 0; col < piece.size; col++) {
                if (piece.cells[row][col] != null) {
                    let gridRow = piece.y + row;
                    let gridCol = piece.x + col;

                    this.grid[gridRow][gridCol] = piece.cells[row][col];
                }
            }
        }
    }

    clearLines() {
		for (let row = this.rows - 1; row >= 0; row--) {
		  if (!this.grid[row].includes(this.foreground)) {
			this.grid.splice(row, 1);
			this.grid.unshift(new Array(this.cols).fill(this.foreground));
			this.score++;  // Increment score when a line is cleared
		  }
		}
	  }

    isValid(piece) {
        for (let row = 0; row < piece.size; row++) {
            for (let col = 0; col < piece.size; col++) {
                if (piece.cells[row][col] != null) {
                    let gridRow = piece.y + row;
                    let gridCol = piece.x + col;

                    if (
                        gridRow < 0 ||
                        gridRow >= this.rows ||
                        gridCol < 0 ||
                        gridCol >= this.cols ||
                        this.grid[gridRow][gridCol] != this.foreground
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    resetGrid() {
        this.grid = Array.from({ length: this.rows }, () =>
            new Array(this.cols).fill(this.foreground)
        );
    }

    show() {
        // Set background
        fill(this.background);
        noStroke();
        rect(0, 0, this.cols * this.cellSize + this.borderSize, this.rows * this.cellSize + this.borderSize);

        // Draw cells
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let cellColor = this.grid[row][col];

                // Alternate gray shades for empty cells
                if (cellColor === this.foreground) {
                    fill((row + col) % 2 === 0 ? 50 : 100); // Dark and light gray
                } else {
                    fill(cellColor);
                }

                let x = col * this.cellSize + this.borderSize / 2;
                let y = row * this.cellSize + this.borderSize / 2;

                rect(x, y, this.cellSize, this.cellSize);
            }
			fill(255);
   			textSize(16);
   			textAlign(RIGHT);
  			text("Score: " + this.score, width - 20, 20);
     }

        // Draw gridlines
        if (this.gridlines) {
            stroke(this.gridlinesColor);
            strokeWeight(1);

            // Horizontal lines
            for (let row = 0; row <= this.rows; row++) {
                let y = row * this.cellSize + this.borderSize / 2;
                line(this.borderSize / 2, y, this.cols * this.cellSize + this.borderSize / 2, y);
            }

            // Vertical lines
            for (let col = 0; col <= this.cols; col++) {
                let x = col * this.cellSize + this.borderSize / 2;
                line(x, this.borderSize / 2, x, this.rows * this.cellSize + this.borderSize / 2);
            }
        }
    }
}

