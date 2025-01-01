class Playfield {

	constructor(w, h) {
		// colors
		this.foreground = [240]; // empty cells color
		this.background = [50]; // dark gray background

		// dimensions and grid
		this.cols = w;
		this.rows = h;
		this.grid = [];
		this.resetGrid();

		// drawing sizes
		this.cellSize = 21;
		this.borderSize = 3;

		// whether or not gridlines are seen
		this.gridlines = true;
		this.gridlinesColor = '#000'; // Black gridlines
	}

	addToGrid(piece) {
		for (let row = 0; row < piece.size; row++) {
			for (let col = 0; col < piece.size; col++) {

				if (piece.cells[row][col] != null) {
					let gridRow = piece.y + row;
					let gridCol = piece.x + col;

					this.grid[gridRow][gridCol] =
						piece.cells[row][col];
				}

			}
		}
	}

	clearLines() {

		for (let row = this.rows-1; row >= 0; row--) {

			// if this row is full
			if (!this.grid[row].includes(this.foreground)) {
				// remove the row
				this.grid.splice(row, 1)
				// and add an empty row to the top
				this.grid.unshift(new Array(this.cols).fill(this.foreground));
			}

		}

	}

	isValid(piece) {

		for (let row = 0; row < piece.size; row++) {
			for (let col = 0; col < piece.size; col++) {

				if (piece.cells[row][col] != null) {

					let gridRow = piece.y + row;
					let gridCol = piece.x + col;

					if (gridRow < 0 || gridRow >= this.rows ||
							gridCol < 0 || gridCol >= this.cols ||
							this.grid[gridRow][gridCol] != this.foreground)
						return false;
				}

			}
		}

		return true;

	}

	resetGrid() {
		for (let i = 0; i < this.rows; i++) {
			this.grid[i] = new Array(this.cols).fill(this.foreground);
		}
	}

	show() {
		// Draw the rectangle behind all the cells for the border and background
		let bs = this.borderSize;
		let cs = this.cellSize;

		// Set the background color to dark gray
		fill(this.background);
		noStroke();

		// Draw a border around the entire playfield
		let offset = floor(bs / 2);
		rect(offset, offset, cs * this.cols + bs - 1, cs * this.rows + bs - 1);

		// Draw the grid cells with alternating colors
		for (let row = 0; row < this.grid.length; row++) {
			for (let col = 0; col < this.grid[row].length; col++) {
				let offset = this.borderSize;
				let cs = this.cellSize;

				// Check if this cell is occupied by a piece
				let cellColor = this.grid[row][col];
				if (cellColor !== this.foreground) {
					// If the cell has a color (meaning it's occupied by a piece), use that color
					fill(cellColor);
				} else {
					// Otherwise, alternate between dark gray and light gray
					if ((row + col) % 2 === 0) {
						fill(50); // Dark gray for alternating cells
					} else {
						fill(100); // Lighter gray for alternating cells
					}
				}

				// Fill the individual cells
				noStroke();
				rect(cs * col + offset, cs * row + offset, cs - 1, cs - 1);
			}
		}

		// Draw gridlines (black lines around the boxes)
		if (this.gridlines) {
			stroke(this.gridlinesColor);  // Black gridlines
			strokeWeight(1);

			// Draw horizontal gridlines
			for (let row = 0; row <= this.rows; row++) {
				line(0, row * this.cellSize, this.cols * this.cellSize, row * this.cellSize);
			}

			// Draw vertical gridlines
			for (let col = 0; col <= this.cols; col++) {
				line(col * this.cellSize, 0, col * this.cellSize, this.rows * this.cellSize);
			}
		}
	}
}
