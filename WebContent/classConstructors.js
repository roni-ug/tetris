

class Sprite {
	constructor(name){
		this.image = new Image();
		this.spriteImagePath = "images/";
		this.image.src = this.spriteImagePath + name + ".png";
	}
	draw(canvas, x, y) {
		canvas.drawImage(this.image, x, y);
	}
}

class generalElement {
	constructor(xLocation, yLocation) {
		this.x = xLocation;
		this.y = yLocation;
		this.appearsInScreen = MAIN_GAME_SCREEN;
	}
	update() {}
	draw() {}
}

class imageElement extends generalElement {
	constructor(xLocation, yLocation, imgName) {
		super(xLocation, yLocation);
		this.imgName = imgName;
		this.sprite = new Sprite(imgName);
	}
	draw() {
		this.sprite.draw(canvas, this.x, this.y);
	}
}


class textElement extends generalElement {
	constructor(xLocation, yLocation, textObj) {
		super(xLocation, yLocation);
		this.textColor = "Cyan";
		this.textObj = textObj;
	}
	draw() {
		canvas.fillStyle = this.textColor;
		canvas.fillText(this.textObj.val, this.x, this.y);
	}
}


class multipleSpritesElement extends generalElement {
	constructor(xLocation, yLocation, imgNames) {
		super(xLocation, yLocation);
		this.shape = [];
		this.imageNames = imgNames;
		this.sprite = [];

		for (let i = 0; i < imgNames.length; i++) {
			this.sprite[i] = new Sprite(imgNames[i]);
		}
	}
	draw() {
		for (let i = 0; i < this.shape.length; i++) {
			for (let j = 0; j < this.shape[i].length; j++) {
				if (this.shape[i][j] != 0) {
					let colorIndex = this.shape[i][j] - 1;
					this.sprite[colorIndex].draw(canvas, STARTING_PX_BOARD_X + (BLOCK_WIDTH) * j + this.x, STARTING_PX_BOARD_Y + (BLOCK_WIDTH) * i + this.y);
				}
			}
		}
	}
}

class DroppingElement extends multipleSpritesElement {
	constructor(xLocation, yLocation, rand, imgNames) {
		super(xLocation, yLocation, imgNames);
		this.active = true;
		switch (rand) {
			case 0:
				this.shape[0] = [0, 0, 0];
				this.shape[1] = [1, 1, 0];
				this.shape[2] = [0, 1, 1];
				break;

			case 1:
				this.shape[0] = [0, 0, 0];
				this.shape[1] = [2, 2, 0];
				this.shape[2] = [2, 2, 0];
				break;
			case 2:
				this.shape[0] = [0, 0, 0];
				this.shape[1] = [0, 0, 3];
				this.shape[2] = [3, 3, 3];
				break;
			case 3:
				this.shape[0] = [0, 0, 0];
				this.shape[1] = [0, 4, 0];
				this.shape[2] = [4, 4, 4];
				break;
			case 4:
				this.shape[0] = [0, 0, 0, 0];
				this.shape[1] = [0, 0, 0, 0];
				this.shape[2] = [0, 0, 0, 0];
				this.shape[3] = [5, 5, 5, 5];
				break;
			case 5:
				this.shape[0] = [0, 0, 0];
				this.shape[1] = [0, 6, 6];
				this.shape[2] = [6, 6, 0];
				break;
			case 6:
				this.shape[0] = [0, 0, 0];
				this.shape[1] = [7, 0, 0];
				this.shape[2] = [7, 7, 7];
				break;
		}
	}
	update() {
		if (this.active) {
			this.y += BLOCK_WIDTH;
		}

		if (!canElementMove(elementData, 0, 1)) {
			addMatrixToGameMatrix(elementData);
			this.active = false;
			if (SCORE.val < 99999)
				SCORE.val += 2;
		}
	}
}



class gameMatrixElement extends multipleSpritesElement {
	constructor(xLocation, yLocation, imgNames) {
		super(xLocation, yLocation, imgNames);
		for (let i = 0; i < NUM_ROWS; i++) {
			this.shape[i] = [];
			for (let j = 0; j < NUM_COLS; j++) {
				this.shape[i][j] = 0;
			}
		}
	}
	update() {
		let hitBreak = false;

		for (let j = 0; j < NUM_ROWS; j++) {
			hitBreak = false;
			for (let i = 0; i < NUM_COLS; i++) {
				if (this.shape[j][i] == 0) {
					hitBreak = true;
					break;
				}
			}
			if (!hitBreak) {
				deleteRow(elementData, j);
				if (LINES.val < 99999) {
					LINES.val++;
				}
			}
		}
	}
}

class elementStorage {
	constructor() {
		this.boardBackGround = new imageElement(STARTING_PX_BOARD_X, STARTING_PX_BOARD_Y, "boardBackground");
		this.gameMatrix = new gameMatrixElement(0, 0, imageNames);
		this.droppingElement = new DroppingElement(BLOCK_WIDTH * (NUM_COLS / 2), 0, Math.round(Math.random() * (NUMBER_OF_SHAPES - 1)), imageNames);
		this.nextElementBox = new imageElement(STARTING_PX_BOARD_X + 340, STARTING_PX_BOARD_Y + 30, "nextElementBox");
		this.nextDroppingElement = new DroppingElement(400, 70,  Math.round(Math.random() * (NUMBER_OF_SHAPES - 1)), imageNames);
		this.nextDroppingElement.active = false;
		this.scoreBox = new imageElement(330, 50, "scoreBox");
		this.scoreTextElement = new textElement(this.scoreBox.x + 30, this.scoreBox.y + 50, SCORE);
		this.linesBox = new imageElement(330, 150, "linesBox");
		this.linesTextElement = new textElement(this.linesBox.x + 30, this.linesBox.y + 50, LINES);
		this.endGameScreen = new imageElement(STARTING_PX_BOARD_X, STARTING_PX_BOARD_Y, "endGameScreen");
		this.endGameScreen.appearsInScreen = END_SCREEN;
		this.newGameButton = new imageElement(STARTING_PX_BOARD_X + 120, STARTING_PX_BOARD_Y + 380, "newGameButton");
		this.newGameButton.appearsInScreen = END_SCREEN;
		this.newGameButton.height = 70;
		this.newGameButton.width = 110;


	}
}

class objValue{
	constructor(value){
		this.val = value;
	}
}