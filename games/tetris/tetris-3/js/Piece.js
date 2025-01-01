class Piece {

	constructor(type, playfield, x, y) {
	  // cells of this piece
	  this.type = type;
	  this.cells = types[type];
	  this.size = this.cells.length; // assumed square matrix

	  // drawing sizes
	  this.cellSize = playfield.cellSize;
	  this.offset = playfield.borderSize;

	  // position of top-left piece relative to playfield
	  this.x = x === undefined ? floor((playfield.cols - this.size) / 2) : x;
	  this.y = y || 0;

	  // gravity
	  this.dropInterval = 1000; // in ms
	  this.dropBuffer = 0; // time since last drop

	  // whether this is a ghost piece
	  this.isghost = false;
	}

	update(time) {
	  this.dropBuffer += time;
	}

	timeToFall() {
	  return this.dropBuffer > this.dropInterval;
	}

	resetBuffer() {
	  this.dropBuffer = 0;
	}

	copy(piece) {
	  this.x = piece.x;
	  this.y = piece.y;
	  this.cells = piece.cells;
	}

	show() {
	  // for each non-null cell in this piece, fill in
	  // the specified color and draw the rectangle
	  for (let row = 0; row < this.size; row++) {
		for (let col = 0; col < this.size; col++) {
		  if (this.cells[row][col]) {
			let x = this.x + col;
			let y = this.y + row;

			let cs = this.cellSize;
			let off = this.offset;

			fill(this.isghost ? '#bbb' : this.cells[row][col])
			rect(off + cs * x, off + cs * y, cs-1, cs-1);
		  }
		}
	  }
	}

	moveDown() {
	  this.y++;
	}

	moveRight() {
	  this.x++;
	}

	moveLeft() {
	  this.x--;
	}

	moveUp() {
	  this.y--;
	}

	//================================
	// Rotate functions
	//================================

	// rotate clockwise
	rotateCW() {
	  let newCells = [];

	  for (let col = 0; col < this.size; col++) {
		let newRow = [];
		for (let row = this.size - 1; row >= 0; row--) {
		  newRow.push(this.cells[row][col]);
		}
		newCells.push(newRow);
	  }
	  this.cells = newCells;
	}

	// rotate counter-clockwise
	rotateCCW() {
	  let newCells = [];
	  for (let col = this.size - 1; col >= 0; col--) {
		let newRow = [];
		for (let row = 0; row < this.size; row++) {
		  newRow.push(this.cells[row][col]);
		}
		newCells.push(newRow);
	  }
	  this.cells = newCells;
	}

	//================================
	// End of rotate functions
	//================================
  }

  // Updated colors for each Tetris piece (Tetris 99 colors)
  let types = {
	O: [
	  ['#FFFF00', '#FFFF00'],
	  ['#FFFF00', '#FFFF00']
	],

	J: [
	  ['#0000FF', null , null ],
	  ['#0000FF', '#0000FF', '#0000FF'],
	  [ null , null , null ]
	],

	L: [
	  [ null , null , '#FFA500'],
	  ['#FFA500', '#FFA500', '#FFA500'],
	  [ null , null , null ]
	],

	S: [
	  [ null , '#00FF00', '#00FF00'],
	  ['#00FF00', '#00FF00', null ],
	  [ null , null , null ]
	],

	Z: [
	  ['#FF0000', '#FF0000', null ],
	  [ null , '#FF0000', '#FF0000'],
	  [ null , null , null ]
	],

	T: [
	  [ null , '#800080', null ],
	  ['#800080', '#800080', '#800080'],
	  [ null , null , null ]
	],

	I: [
	  [ null , null , null , null ],
	  ['#00FFFF', '#00FFFF', '#00FFFF', '#00FFFF'],
	  [ null , null , null , null ],
	  [ null , null , null , null ]
	]
  }
