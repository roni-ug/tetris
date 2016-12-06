const CANVAS_WIDTH = 1300;
const CANVAS_HEIGHT = 630;
const FPS = 7;
const NUM_ROWS = 20;
const NUM_COLS = 10;
const NUMBER_OF_SHAPES = 7;
const imageNames = ["blockGreen", "blockBlue", "blockPurple", "blockOrange", "blockPink", "blockRed", "blockYellow"];
const BLOCK_WIDTH = 30;
const STARTING_PX_BOARD_X = 400;
const STARTING_PX_BOARD_Y = 20;

const OPENNING_SCREEN = 1;
const MAIN_GAME_SCREEN = 2;
const END_SCREEN = 3;

let SCORE = new objValue(0);
let LINES = new objValue(0);
let GAME_ACTIVE = true;
let refreshIntervalId;


const canvas = document.getElementById("canvas1").getContext("2d");



let elementData = gameInit();
document.onclick = handleGameResponseToMouseClick;
document.onkeydown = hadlePlayerResponseToKeyPressed;

function gameInit() {
	SCORE = new objValue(0);
	LINES = new objValue(0);
	GAME_ACTIVE = true;
	return new elementStorage();

};


refreshIntervalId = setInterval(gameLoop, 1000 / FPS);


function gameLoop() {
	update();
	draw();
	if (!GAME_ACTIVE) {
		clearInterval(refreshIntervalId);
		gameEndScreen();
	}
};


function gameEndScreen() {
	elementData.endGameScreen.draw();
	elementData.newGameButton.draw();
};

function update() {
	Object.keys(elementData).forEach(function (key) {
		elementData[key].update();
	});

	if (!elementData.droppingElement.active) {
		addNewDroppingElement();
		if (!canElementMove(elementData, 0, 1)) {
			GAME_ACTIVE = false;
		}
	}
};


function draw() {

	canvas.fillStyle = "BLACK";
	canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	Object.keys(elementData).forEach(function (key) {
		if (elementData[key].appearsInScreen === MAIN_GAME_SCREEN) {
			elementData[key].draw();
		}
	});

};

function addNewDroppingElement() {
	let rand= Math.round(Math.random()*(NUMBER_OF_SHAPES-1));
	elementData.droppingElement = elementData.nextDroppingElement;
	elementData.droppingElement.x = BLOCK_WIDTH * (NUM_COLS/2);	
	elementData.droppingElement.y = 0;
	elementData.droppingElement.active = true;
	elementData.nextDroppingElement = new DroppingElement(400,70,rand,imageNames);
	elementData.nextDroppingElement.active = false;
};	


function rotateElementShape(element) {
	let numberOfRows = element.shape.length;
	let numberOfCols = element.shape[0].length;
	let rotatedMatrix = [];
	for (let i = 0; i < numberOfCols; i++) {
		rotatedMatrix[i] = [];
		for (let j = 0; j < numberOfRows; j++) {
			rotatedMatrix[i][j] = element.shape[j][i];
		}
	}
	return rotatedMatrix;
};



function pxToMatrixCoords(x_px) {
	return Math.round((x_px) / BLOCK_WIDTH);

};


function addMatrixToGameMatrix(elementStorage) {
	let x_coord = pxToMatrixCoords(elementStorage.droppingElement.x);
	let y_coord = pxToMatrixCoords(elementStorage.droppingElement.y);

	for (let i = 0; i < elementStorage.droppingElement.shape.length; i++) {
		for (let j = 0; j < elementStorage.droppingElement.shape[0].length; j++) {
			if (elementStorage.droppingElement.shape[i][j] != 0)
				elementStorage.gameMatrix.shape[i + y_coord][j + x_coord] = elementStorage.droppingElement.shape[i][j];
		}
	}
};

function canRotate(elementStorage) {
	let x_coord = pxToMatrixCoords(elementStorage.droppingElement.x);
	let y_coord = pxToMatrixCoords(elementStorage.droppingElement.y);
	let tempRotatedSahpe = rotateElementShape(elementStorage.droppingElement);
	for (let i = 0; i < elementStorage.droppingElement.shape.length; i++) {
		for (let j = 0; j < elementStorage.droppingElement.shape[0].length; j++) {
			if ((tempRotatedSahpe[i][j] != 0) && (elementStorage.gameMatrix.shape[i + y_coord][j + x_coord] != 0)) {
				return false;
			}
		}
	}
	return true;
};


function canElementMove(elementStorage, x_direction, y_direction) {
	let x_coord = pxToMatrixCoords(elementStorage.droppingElement.x);
	let y_coord = pxToMatrixCoords(elementStorage.droppingElement.y);;
	const DOWN = 1;
	const LEFT = 1;
	const RIGTH = -1;
	let sourceX = elementStorage.droppingElement.x;
	let sourceY = elementStorage.droppingElement.y;
	let destinationX =  sourceX + (elementStorage.droppingElement.shape[0].length * BLOCK_WIDTH);
	let destinationY = sourceY + (elementStorage.droppingElement.shape.length * BLOCK_WIDTH);


	if (y_direction == DOWN && (destinationY > NUM_ROWS * BLOCK_WIDTH - 1)) {
		return false;
	}
	else if (x_direction == RIGTH && ( sourceX < BLOCK_WIDTH)) {
		return false;
	}
	else if (x_direction == LEFT &&  destinationX >= BLOCK_WIDTH * NUM_COLS) {
		return false;
	}

	for (let i = 0; i < elementStorage.droppingElement.shape.length; i++) {
		for (let j = 0; j < elementStorage.droppingElement.shape[0].length; j++) {
			let boardAtLocationEmpty = elementStorage.gameMatrix.shape[i + y_coord + y_direction][j + x_coord + x_direction];
			let droppingShapeEmpty  = elementStorage.droppingElement.shape[i][j];
			
			if (( droppingShapeEmpty != 0) && (boardAtLocationEmpty != 0)) {
				return false;
			}
		}
	}
	return true;

};


function deleteRow(elementStorage, rowNumber) {

	elementStorage.gameMatrix.shape.splice(rowNumber, 1);
	let zeroArray = Array.apply(null, Array(NUM_COLS)).map(Number.prototype.valueOf, 0);
	elementStorage.gameMatrix.shape.splice(0, 0, zeroArray);

};

// the listener that responses to mouse clicks
function handleGameResponseToMouseClick(event) {

	let canvasX = event.pageX;
	let canvasY = event.pageY;

	let afterButtonStartX = elementData.newGameButton.x ;
	let beforeButtonEndX = elementData.newGameButton.x + elementData.newGameButton.width;
	let afterButtonStartY = elementData.newGameButton.y;
	let beforeButtonEndY = elementData.newGameButton.y + elementData.newGameButton.height;
	
	if (!GAME_ACTIVE) {
		if (   (canvasX >= afterButtonStartX  &&   canvasX <= beforeButtonEndX )
			&& (canvasY >= afterButtonStartY  &&   canvasY <= beforeButtonEndY )) {
			canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			elementData = gameInit();
			refreshIntervalId = setInterval(gameLoop, 1000 / FPS);

		}
	}

};




// the listener that responds to key left and key right and moves player accordingly
function hadlePlayerResponseToKeyPressed(keyPressedEvent) {

	keyPressedEvent = keyPressedEvent || window.event;

	if (GAME_ACTIVE) {
		// left arrow
		if (keyPressedEvent.keyCode == '37') {
			//left is 0 on the y exis and -1 on the x
			if (canElementMove(elementData, -1, 0)) {
				elementData.droppingElement.x -= BLOCK_WIDTH;
			}
		}
		// right arrow
		else if (keyPressedEvent.keyCode == '39') {
			if (canElementMove(elementData, 1, 0)) {
				elementData.droppingElement.x += BLOCK_WIDTH;
			}

		}
		//space
		else if (keyPressedEvent.keyCode == '32') {
			if (canRotate(elementData)) {
				elementData.droppingElement.shape = rotateElementShape(elementData.droppingElement);
			}

		}

	}
};
