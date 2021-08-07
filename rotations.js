var functionToAnimate = null;
var degToAnimate = 0;
var countAnimate = 0;

var last = false;

//update references in 3d array
function switchRefs(refs, temps) {
	for (let i in refs) {
		refs[i].index = temps[i];
	}
}

//return ref indices (before rotation)
function setInitTemps(refs) {
	let initTemps = [];
	for (let i in refs) {
		initTemps[i] = refs[i].index;
	}
	return initTemps;
}

//return new ref indices (after rotation)
function setTemps(initTemps, deg, side) {
	switch (side) {
		case "FBUD":
			if(deg < 0){
				return [initTemps[2], initTemps[4], initTemps[7], initTemps[1], initTemps[6], initTemps[0], initTemps[3], initTemps[5]];
			} else {
				return [initTemps[5], initTemps[3], initTemps[0], initTemps[6], initTemps[1], initTemps[7], initTemps[4], initTemps[2]];
			}
		case "RL":
			if(deg > 0){
				return [initTemps[2], initTemps[4], initTemps[7], initTemps[1], initTemps[6], initTemps[0], initTemps[3], initTemps[5]];
			} else {
				return [initTemps[5], initTemps[3], initTemps[0], initTemps[6], initTemps[1], initTemps[7], initTemps[4], initTemps[2]];
			}
	}
}

function updateFaceRefs(refs, deg, face) {
	let initTemps = [];
	let temps;

	initTemps = setInitTemps(refs);
	temps = setTemps(initTemps, deg, face);
	switchRefs(refs, temps);
}

//for center ref indeces shift
function shiftArray(array, side) {
	switch (side) {
		case "L":
			return [array[1], array[2], array[3], array[0]];
		case "R":
			return [array[3], array[0], array[1], array[2]];
	}
}

function rotateFace(rotation){
	if(functionToAnimate === null){
		if (selectedFace.i === 0) {
			functionToAnimate = rightFace;
			switch(rotation) {
				case "R":
					degToAnimate = -90;
					break;
				case "L":
					degToAnimate = 90; 
			}
		} else if (selectedFace.i === 2) {
			functionToAnimate = leftFace;
			switch(rotation) {
				case "R":
					degToAnimate = 90;
					break;
				case "L":
					degToAnimate = -90;
			}
		} else {
			if (selectedFace.j === 0) {
				functionToAnimate = frontFace;
				switch(rotation) {
					case "R":
						degToAnimate = -90;
						break;
					case "L":
						degToAnimate = 90;
				}
			} else if (selectedFace.j === 2) {
				functionToAnimate = backFace;
				switch(rotation) {
					case "R":
						degToAnimate = 90;
						break;
					case "L":
						degToAnimate = -90;
				}
			} else {
				if (selectedFace.k === 0) {
					functionToAnimate = downFace;
					switch(rotation) {
						case "R":
							degToAnimate = 90;
							break;
						case "L":
							degToAnimate = -90;
					}
				} else if (selectedFace.k === 2) {
					functionToAnimate = upFace;
					switch(rotation) {
						case "R":
							degToAnimate = -90;
							break;
						case "L":
							degToAnimate = 90;
					}
				}
			}
		}
		lastUpdateTime = (new Date).getTime();
	}
}

function rotate(refs, deg, face) {
	if (face === "R" || face === "L" || face === "F" || face === "B" || face === "U" || face === "D") { //rotate face
		if (face === "R" || face === "L") {
			for (let i in refs) { //all cubes but center one
				updateQuaternion(refs[i].index, deg, 0, 0);
			}
			if (face === "R") { //central cube
				updateQuaternion(wmRef[0][1][1].index, deg, 0, 0);
			} else {
				updateQuaternion(wmRef[2][1][1].index, deg, 0, 0);
			}
		} else if (face === "F" || face === "B") {
			for (let i in refs) {
				updateQuaternion(refs[i].index, 0, 0, deg);
			}
			if (face === "F") {
				updateQuaternion(wmRef[1][0][1].index, 0, 0, deg);
			} else {
				updateQuaternion(wmRef[1][2][1].index, 0, 0, deg);
			}
		} else {
			for (let i in refs) {
				updateQuaternion(refs[i].index, 0, deg, 0);
			}
			if (face === "U") {
				updateQuaternion(wmRef[1][1][2].index, 0, deg, 0);
			} else {
				updateQuaternion(wmRef[1][1][0].index, 0, deg, 0);
			}
		}
	} else { //middle moves
		if (face === "MH") {
			for (let i in refs) {
				updateQuaternion(refs[i].index, 0, deg, 0);
			}
		} else if (face === "MVFB") {
			for (let i in refs) {
				updateQuaternion(refs[i].index, deg, 0, 0);
			}
		} else if (face === "MVRL") {
			for (let i in refs) {
				updateQuaternion(refs[i].index, 0, 0, deg);
			}
		}
	}
}

function rightFace(deg) {
	let refs = [wmRef[0][0][0], wmRef[0][0][1], wmRef[0][0][2], wmRef[0][1][0], wmRef[0][1][2], wmRef[0][2][0], wmRef[0][2][1], wmRef[0][2][2]];
	rotate(refs, deg, "R");
	
	if (last) {
		updateFaceRefs(refs, deg, "RL");
	}
}

function leftFace(deg) {
	let refs = [wmRef[2][0][0], wmRef[2][0][1], wmRef[2][0][2], wmRef[2][1][0], wmRef[2][1][2], wmRef[2][2][0], wmRef[2][2][1], wmRef[2][2][2]];
	rotate(refs, deg, "L");

	if (last) {
		updateFaceRefs(refs, deg, "RL");
	}
}

function frontFace(deg) {
	let refs = [wmRef[0][0][0], wmRef[0][0][1], wmRef[0][0][2], wmRef[1][0][0], wmRef[1][0][2], wmRef[2][0][0], wmRef[2][0][1], wmRef[2][0][2]];
	rotate(refs, deg, "F");

	if (last) {
		updateFaceRefs(refs, deg, "FBUD");
	}
}

function backFace(deg) {
	let refs = [wmRef[0][2][0], wmRef[0][2][1], wmRef[0][2][2], wmRef[1][2][0], wmRef[1][2][2], wmRef[2][2][0], wmRef[2][2][1], wmRef[2][2][2]];
	rotate(refs, deg, "B");

	if (last) {
		updateFaceRefs(refs, deg, "FBUD");
	}
}

function downFace(deg) {
	let refs = [wmRef[0][0][0], wmRef[0][1][0], wmRef[0][2][0], wmRef[1][0][0], wmRef[1][2][0], wmRef[2][0][0], wmRef[2][1][0], wmRef[2][2][0]];
	rotate(refs, deg, "D");

	if (last) {
		updateFaceRefs(refs, deg, "FBUD");
	}
}

function upFace(deg) {
	let refs = [wmRef[0][0][2], wmRef[0][1][2], wmRef[0][2][2], wmRef[1][0][2], wmRef[1][2][2], wmRef[2][0][2], wmRef[2][1][2], wmRef[2][2][2]];
	rotate(refs, deg, "U");

	if (last) {
		updateFaceRefs(refs, deg, "FBUD");
	}
}

function rotateMiddle(rotation){
	if(functionToAnimate === null){
		if (selectedFace.i === 0) {
			switch(rotation) {
				case "R":
					functionToAnimate = rotateMiddleHorizontal;
					degToAnimate = 90;
					break;
				case "L":
					functionToAnimate = rotateMiddleHorizontal;
					degToAnimate = -90;
					break;
				case "U":
					functionToAnimate = rotateMiddleVerticalRightLeft;
					degToAnimate = 90;
					break;
				case "D":
					functionToAnimate = rotateMiddleVerticalRightLeft;
					degToAnimate = -90;
			}
		} else if (selectedFace.i === 2) {
			switch(rotation) {
				case "R":
					functionToAnimate = rotateMiddleHorizontal;
					degToAnimate = 90;
					break;
				case "L":
					functionToAnimate = rotateMiddleHorizontal;
					degToAnimate = -90;
					break;
				case "U":
					functionToAnimate = rotateMiddleVerticalRightLeft;
					degToAnimate = -90;
					break;
				case "D":
					functionToAnimate = rotateMiddleVerticalRightLeft;
					degToAnimate = 90;
					break;
			}
		} else {
			if (selectedFace.j === 0) {
				switch(rotation) {
					case "R":
						functionToAnimate = rotateMiddleHorizontal;
						degToAnimate = 90;
						break;
					case "L":
						functionToAnimate = rotateMiddleHorizontal;
						degToAnimate = -90;
						break;
					case "U":
						functionToAnimate = rotateMiddleVerticalFrontBack;
						degToAnimate = -90;
						break;
					case "D":
						functionToAnimate = rotateMiddleVerticalFrontBack;
						degToAnimate = 90;
						break;
				}
			} else if (selectedFace.j === 2) {
				switch(rotation) {
					case "R":
						functionToAnimate = rotateMiddleHorizontal;
						degToAnimate = 90;
						break;
					case "L":
						functionToAnimate = rotateMiddleHorizontal;
						degToAnimate = -90;
						break;
					case "U":
						functionToAnimate = rotateMiddleVerticalFrontBack;
						degToAnimate = 90;
						break;
					case "D":
						functionToAnimate = rotateMiddleVerticalFrontBack;
						degToAnimate = -90;
						break;
				}
			} else {
				if (selectedFace.k === 0) {
					switch(rotation) {
						case "R":
							functionToAnimate = rotateMiddleVerticalRightLeft;
							degToAnimate = -90;
							break;
						case "L":
							functionToAnimate = rotateMiddleVerticalRightLeft;
							degToAnimate = 90;
							break;
						case "U":
							functionToAnimate = rotateMiddleVerticalFrontBack;
							degToAnimate = -90;
							break;
						case "D":
							functionToAnimate = rotateMiddleVerticalFrontBack;
							degToAnimate = 90;
							break;
					}
				} else if (selectedFace.k === 2) {
					switch(rotation) {
						case "R":
							functionToAnimate = rotateMiddleVerticalRightLeft;
							degToAnimate = -90;
							break;
						case "L":
							functionToAnimate = rotateMiddleVerticalRightLeft;
							degToAnimate = 90;
							break;
						case "U":
							functionToAnimate = rotateMiddleVerticalFrontBack;
							degToAnimate = -90;
							break;
						case "D":
							functionToAnimate = rotateMiddleVerticalFrontBack;
							degToAnimate = 90;
							break;
					}
				}
			}
		}
		lastUpdateTime = (new Date).getTime();
	}
}

function rotateMiddleHorizontal(deg) {
	let allRefs = [wmRef[0][0][1], wmRef[0][1][1], wmRef[0][2][1], wmRef[1][0][1], wmRef[1][2][1], wmRef[2][0][1], wmRef[2][1][1], wmRef[2][2][1]];
	rotate(allRefs, deg, "MH");

	if (last) {
		let front, right, back, left;

		front = wmRef[1][0][1];
		right = wmRef[0][1][1];
		back = wmRef[1][2][1];
		left = wmRef[2][1][1];

		let centers = [front, right, back, left];
		let refs = [wmRef[0][0][1], wmRef[0][2][1], wmRef[2][2][1], wmRef[2][0][1]];
		let initTemps = setInitTemps(refs);
		let temps;

		if(deg > 0){
			//right
			for (let i in centers) {
				moveCenterMiddleHorizontal(getCoordFromCol(centers[i].color), "R");
			}

			// switch centers
			wmRef[1][0][1] = left;
			wmRef[0][1][1] = front;
			wmRef[1][2][1] = right;
			wmRef[2][1][1] = back;

			temps = shiftArray(initTemps, "R");
		} else {
			//left
			for (let i in centers) {
				moveCenterMiddleHorizontal(getCoordFromCol(centers[i].color), "L");
			}

			// switch centers
			wmRef[1][0][1] = right;
			wmRef[0][1][1] = back;
			wmRef[1][2][1] = left;
			wmRef[2][1][1] = front;

			temps = shiftArray(initTemps, "L");
		}
		switchRefs(refs, temps);
	}
}

function moveCenterMiddleHorizontal(coords, direction) {
	if (direction === "R") {
		if (coords.i === 1 && coords.j === 0) {
			coords.i = 0;
			coords.j = 1;
		} else if (coords.i === 0 && coords.j === 1) {
			coords.i = 1;
			coords.j = 2;
		} else if (coords.i === 1 && coords.j === 2) {
			coords.i = 2;
			coords.j = 1;
		} else {
			coords.i = 1;
			coords.j = 0;
		}
	} else {
		if (coords.i === 0 && coords.j === 1) {
			coords.i = 1;
			coords.j = 0;
		} else if (coords.i === 1 && coords.j === 2) {
			coords.i = 0;
			coords.j = 1;
		} else if (coords.i === 2 && coords.j === 1) {
			coords.i = 1;
			coords.j = 2;
		} else {
			coords.i = 2;
			coords.j = 1;
		}
	}
}

function rotateMiddleVerticalFrontBack(deg) {
	let allRefs = [wmRef[1][0][0], wmRef[1][0][1], wmRef[1][0][2], wmRef[1][1][0], wmRef[1][1][2], wmRef[1][2][0], wmRef[1][2][1], wmRef[1][2][2]];
	rotate(allRefs, deg, "MVFB");

	if (last) {
		let front, up, back, down;

		// centers
		front = wmRef[1][0][1];
		up = wmRef[1][1][2];
		back = wmRef[1][2][1];
		down = wmRef[1][1][0];

		let centers = [front, up, back, down];
		let refs = [wmRef[1][0][0], wmRef[1][0][2], wmRef[1][2][2], wmRef[1][2][0]];
		let initTemps = [wmRef[1][0][0].index, wmRef[1][0][2].index, wmRef[1][2][2].index, wmRef[1][2][0].index];
		let temps;

		if(deg > 0){
			//up
			for (let i in centers) {
				moveCenterMiddleVerticalFrontBack(getCoordFromCol(centers[i].color), "D");
			}

			// switch centers
			wmRef[1][1][0] = front;
			wmRef[1][2][1] = down;
			wmRef[1][1][2] = back;
			wmRef[1][0][1] = up;

			temps = shiftArray(initTemps, "L");
		} else {
			//down
			for (let i in centers) {
				moveCenterMiddleVerticalFrontBack(getCoordFromCol(centers[i].color), "U");
			}

			// switch centers
			wmRef[1][1][0] = back;
			wmRef[1][2][1] = up;
			wmRef[1][1][2] = front;
			wmRef[1][0][1] = down;

			temps = shiftArray(initTemps, "R");
		}
		switchRefs(refs, temps);
	}
}

function moveCenterMiddleVerticalFrontBack(coords, direction) {
	if (direction === "U") {
		if (coords.k === 1 && coords.j === 0) {
			coords.k = 2;
			coords.j = 1;
		} else if (coords.k === 0 && coords.j === 1) {
			coords.k = 1;
			coords.j = 0;
		} else if (coords.k === 1 && coords.j === 2) {
			coords.k = 0;
			coords.j = 1;
		} else {
			coords.k = 1;
			coords.j = 2;
		}
	} else {
		if (coords.k === 0 && coords.j === 1) {
			coords.k = 1;
			coords.j = 2;
		} else if (coords.k === 1 && coords.j === 2) {
			coords.k = 2;
			coords.j = 1;
		} else if (coords.k === 2 && coords.j === 1) {
			coords.k = 1;
			coords.j = 0;
		} else {
			coords.k = 0;
			coords.j = 1;
		}
	}
}

function rotateMiddleVerticalRightLeft(deg) {
	let allRefs = [wmRef[0][1][0], wmRef[0][1][1], wmRef[0][1][2], wmRef[1][1][0], wmRef[1][1][2], wmRef[2][1][0], wmRef[2][1][1], wmRef[2][1][2]];
	rotate(allRefs, deg, "MVRL");

	if (last) {
		let right, up, left, down;

		// centers
		right = wmRef[0][1][1];
		up = wmRef[1][1][2];
		left = wmRef[2][1][1];
		down = wmRef[1][1][0];

		let centers = [right, up, left, down];
		let refs = [wmRef[0][1][2], wmRef[2][1][2], wmRef[2][1][0], wmRef[0][1][0]];
		let initTemps = [wmRef[0][1][2].index, wmRef[2][1][2].index, wmRef[2][1][0].index, wmRef[0][1][0].index];
		let temps;

		if(deg > 0){
			//up
			for (let i in centers) {
				moveCenterMiddleVerticalRightLeft(getCoordFromCol(centers[i].color), "U");
			}

			// switch centers
			wmRef[1][1][2] = right;
			wmRef[2][1][1] = up;
			wmRef[1][1][0] = left;
			wmRef[0][1][1] = down;

			temps = shiftArray(initTemps, "R");
		} else {
			//down
			for (let i in centers) {
				moveCenterMiddleVerticalRightLeft(getCoordFromCol(centers[i].color), "D");
			}

			// switch centers
			wmRef[1][1][0] = right;
			wmRef[2][1][1] = down;
			wmRef[1][1][2] = left;
			wmRef[0][1][1] = up;

			temps = shiftArray(initTemps, "L");
		}
		switchRefs(refs, temps);
	}
}

function moveCenterMiddleVerticalRightLeft(coords, direction){
	if (direction === "U") {
		if (coords.k === 1 && coords.i === 0) {
			coords.k = 2;
			coords.i = 1;
		} else if (coords.k === 0 && coords.i === 1) {
			coords.k = 1;
			coords.i = 0;
		} else if (coords.k === 1 && coords.i === 2) {
			coords.k = 0;
			coords.i = 1;
		} else {
			coords.k = 1;
			coords.i = 2;
		}
	} else {
		if (coords.k === 0 && coords.i === 1) {
			coords.k = 1;
			coords.i = 2;
		} else if (coords.k === 1 && coords.i === 2) {
			coords.k = 2;
			coords.i = 1;
		} else if (coords.k === 2 && coords.i === 1) {
			coords.k = 1;
			coords.i = 0;
		} else {
			coords.k = 0;
			coords.i = 1;
		}
	}
}
	