let numSelected = null;
let tileSelected = null;
let [minutes,seconds] = [0,0];
let errors = 0;
let timer;
let r_new = [0,1,2,3,4,5,6,7,8];
let c_new = [0,1,2,3,4,5,6,7,8];

let starterBoard = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
]

let starterSolution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]

let board = [];
let solution = [];

// window.onload = function() {
//     setGame();
// }

shuffleSudokuIndex(r_new,c_new);
solution = shuffleSudoku(starterSolution,r_new,c_new);
board = shuffleSudoku(starterBoard,r_new,c_new);
setGame();

console.info("board");
console.table(board);
console.info("solution");
console.table(solution);

function shuffleSudoku(starter,r,c){
  let arr = [];
  let tempArr = [];

  for (let i=0; i<9; i++){
    for (let j=0; j<9; j++){
      tempArr.push(starter[r[i]][c[j]]);
    }
    arr.push(tempArr);
    tempArr = [];
  }
  return arr;
}

function shuffleSudokuIndex(r,c){
  shuffleBlockIndex(r);
  shuffleBlockIndex(c);
  shuffleListIndex(r);
  shuffleListIndex(c);
}

function shuffleListIndex(array){
  // Fisher-Yates shuffle with sudoku rules
  // shuffle row/colum in the same block
  let max = array.length-1;
  for (let i = 0; i < 3; i++){
    let min = max - 3;
    for (let j = max; j > min; j--) {
      let k = Math.floor(Math.random() * (j - min) + min + 1);
      [array[j], array[k]] = [array[k], array[j]];
    }
    max = min;
  }
}

function shuffleBlockIndex(array){
  let r = generateRandList(0,2);
  // console.table(r);
  let m = 0;
  let tempArr = [];
  for (let j=0;j<9;j++){
    // console.info(array[j+(r[m]-m)*3]);
    tempArr.push(array[j+(r[m]-m)*3]);
    if ((j+1)%3 == 0) m++; 
  }
  replace(array,tempArr);
}

function replace(reference, array) {
  // replace array without losing reference
  // [].splice.apply(reference, [0, reference.length].concat(array));
  reference.splice(0, reference.length, ...array);
}

function generateRandList(st, end){
  let arr = [];
  while(arr.length < (end-st+1)){
    let temp = Math.floor(Math.random() * (end-st+1) + st);
    if(arr.indexOf(temp) === -1) arr.push(temp);
  }
  return arr;
}

// function randBlock(starterList){
//   let r = generateRandList(3);
//   let c = generateRandList(3);
//   let tempArr = [];
//   let arr = [];
//   console.table(r);
//   console.table(c);

//   let k = 0;
//   for (let i=0;i<9;i++){
//     let m = 0;
//     for (let j=0;j<9;j++){
//       console.info(starterList[i+(r[k]-k)*3][j+(c[m]-m)*3]);
//       tempArr.push(starterList[i+(r[k]-k)*3][j+(c[m]-m)*3]);
//       if ((j+1)%3 == 0) m++; 
//     }
//     arr.push(tempArr);
//     tempArr = [];
//     if ((i+1)%3 == 0) k++; 
//   }
  
//   console.table(arr);
//   return arr;
// }

// function shuffle(array,min,max){
//   for (let j = max; j > min; j--) {
//     let k = Math.floor(Math.random() * (j - min) + min + 1);
//     [array[j], array[k]] = [array[k], array[j]];
//   }
// }

function setGame() {
    // Digits 1-9
    timer = setInterval(displayTimer,1000);
    for (let i = 1; i <= 9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
    document.addEventListener("keydown",selectKey);
}

function selectKey(e){
  if (tileSelected){
    if (tileSelected.innerText != "") {
      return;
    }

    let coords = tileSelected.id.split("-"); //["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (solution[r][c] == e.key) {
      tileSelected.innerText = e.key;
    }
    else {
      seconds +=15;
    }
  }
}

function selectNumber(){
  if (tileSelected) {
    if (tileSelected.innerText != "") {
      return;
    }
    // "0-0" "0-1" .. "3-1"
    let coords = tileSelected.id.split("-"); //["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (solution[r][c] == this.id) {
      tileSelected.innerText = this.id;
    }
    else {
      seconds +=15;
    }
  }
}

function selectTile() {
  if (tileSelected != null) {
    tileSelected.classList.remove("tile-selected");
  }
  if (tileSelected == this){
    tileSelected.classList.remove("tile-selected");
    tileSelected = null;
  }else{
    tileSelected = this;
    tileSelected.classList.add("tile-selected");
  }
}

function displayTimer(){
  seconds+=1;
  if (minutes == 59 && seconds == 60){
    alert("Time out");
    clearInterval(timer);
  }
  if(seconds >= 60){
    seconds -= 60;
    minutes++;
  }
  let m = minutes < 10 ? `0${minutes}` : minutes;
  let s = seconds < 10 ? `0${seconds}` : seconds;
  document.getElementById("time_sec").innerHTML = s;
  document.getElementById("time_min").innerHTML = m;
  check();
}

function check(){
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      let tile_id = r.toString() + "-" + c.toString();;
      // console.info(tile_id);
      if(tile_id == '9-9' && document.getElementById(tile_id).innerText != ""){
        alert(`you win !! congratulation.....\nTime: ${minutes} minutes ${seconds} seconds`);
        clearInterval(timer);
        // selectRestart;
      }
      else if(document.getElementById(tile_id).innerText == ""){
        return;
      }
    }
  }
}

function toHome(){
  window.location.href="index.html";
}

function selectRestart(){
  window.location.reload();
}
