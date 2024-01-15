var winner=1;
var draw=0;
let xscore = 0, oscore = 0;
let humanPlayed = 0
var audio = new Audio("Touch_Sound_Effect_(Private_Only)(128k).mp3");
var audio_win = new Audio("win_sound(128k).mp3");
var audio_lose = new Audio("mixkit-retro-arcade-lose-2027.wav");
var all_full=0;
var turn= "x";
let firstTurn = "x"
let fc = 0
let huPlayer = "x", aiPlayer = "o";
let orgBoard = [ "0", "1", "2", "3", "4", "5", "6", "7", "8"]

const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]     ];
function turn_change(){
  if (turn=="x"){
    var trno =  document.getElementById("turn");
    trno.innerHTML = " X (You)";
    trno.style.color = "#02e7f7";
  }
  else{
    var trnt = document.getElementById("turn");
    trnt.innerHTML = " O (Computer)";
    trnt.style.color="yellow";
    draw_check(turn);
    if (draw){
      firstTurn = turn
      audio_lose.play()
      document.getElementById("mid").innerHTML = "Draw";
      document.getElementById("mid").style.color = "red";
      return;
    }
    playAI()
  }
}

const playAI = () => {
  let newBoard = orgBoard.map((val) => {
    return document.getElementById(val).innerText === "" ? val : document.getElementById(val).innerText
  })

  var bestSpot = minimax(newBoard, turn);
  change(parseInt(bestSpot["index"]))
}


function change(i){
  if(winner){
    var tile = document.getElementsByClassName("tile")[i];
    if(tile.innerHTML != "x" && tile.innerHTML != "o"){
      if (turn=="x"){
        tile.innerHTML = turn;
        tile.style.color = "#02e7f7";
        turn = "o";
        turn_change();
        audio.play();
        audio.playbackRate = 4.0;
      }
      else{
        tile.innerHTML = turn;
        tile.style.color = "yellow";
        turn = "x";
        turn_change();
        audio.play();
        audio.playbackRate = 4.0;
      }
    }
    draw_check(turn);
    if (draw){
      firstTurn = turn
      audio_lose.play()
      document.getElementById("mid").innerHTML = "Draw";
      document.getElementById("mid").style.color = "red";
    }
    win_check(turn);
  }
}


function win_check(){
  var tile_info=document.getElementsByClassName("tile");
  for(var j=0;j<8;j++){
    const a = winningCombinations[j][0];
    const b = winningCombinations[j][1];
    const c = winningCombinations[j][2];
    if (tile_info[a].innerHTML=="x" && tile_info[b].innerHTML=="x" && tile_info[c].innerHTML=="x"){
      firstTurn = turn
      document.getElementById("mid").innerHTML="X wins";
      document.getElementById("mid").style.color="#02e7f7";
      tile_info[a].style.color="#33fb33";
      tile_info[b].style.color="#33fb33";
      tile_info[c].style.color="#33fb33";
      tile_info[a].style.backgroundColor="#0b3d06";
      tile_info[b].style.backgroundColor="#0b3d06";
      tile_info[c].style.backgroundColor="#0b3d06";
      xscore += 0.5
      document.getElementById("xscore").innerText = xscore
      audio_win.play();
      winner=0;
    }
    else if (tile_info[a].innerText=="o" && tile_info[b].innerText=="o" && tile_info[c].innerText=="o"){
      firstTurn = turn
      document.getElementById("mid").innerHTML="O wins";
      document.getElementById("mid").style.color="yellow";
      tile_info[a].style.color="#33fb33";
      tile_info[b].style.color="#33fb33";
      tile_info[c].style.color="#33fb33";
      tile_info[a].style.backgroundColor="#0b3d06";
      tile_info[b].style.backgroundColor="#0b3d06";
      tile_info[c].style.backgroundColor="#0b3d06";
      oscore += 0.5
      document.getElementById("oscore").innerText = oscore
      audio_win.play();
      winner=0;
    }
    
  }
}            

function draw_check(){
  var tile_info=document.getElementsByClassName("tile");
  for(var t=0;t<9;t++){
    if (tile_info[t].innerText=="x" || tile_info[t].innerText=="o"){
      draw=1;
    }
    else{
      draw=0;
      return false;
    }
  }
  return true;
}
            
function refresh(){
  var tile_info=document.getElementsByClassName("tile");
  for(var k=0;k<9;k++){
    document.getElementsByClassName("tile")[k].innerHTML=" ";
    document.getElementById("mid").style.color="#fff";
    tile_info[k].style.backgroundColor="#000";
  }
  winner=1;
  document.getElementById("mid").innerHTML="Play";
  if (turn == "o"){
    playAI()
  }
}
  
function emptyIndexies(board){
  return  board.filter(s => s != "O" && s != "X");
}

function winning(board, player){
  if (
         (board[0] == player && board[1] == player && board[2] == player) ||
         (board[3] == player && board[4] == player && board[5] == player) ||
         (board[6] == player && board[7] == player && board[8] == player) ||
         (board[0] == player && board[3] == player && board[6] == player) ||
         (board[1] == player && board[4] == player && board[7] == player) ||
         (board[2] == player && board[5] == player && board[8] == player) ||
         (board[0] == player && board[4] == player && board[8] == player) ||
         (board[2] == player && board[4] == player && board[6] == player)
         ) {
         return true;
     } else {
         return false;
     }
 }

function minimax(newBoard, player){
  //add one to function calls
  fc++;
  
  //available spots
  var availSpots = newBoard.filter((val) => {
    if (val != "X" && val != "O" && val != "x" && val != "o"){
      return val;
    }
  });

  // checks for the terminal states such as win, lose, and tie and returning a value accordingly
  if (winning(newBoard, huPlayer)){
     return {score:-10};
  }
	else if (winning(newBoard, aiPlayer)){
    return {score:10};
	}
  else if (availSpots.length === 0){
  	return {score:0};
  }

// an array to collect all the objects
  var moves = [];

  // loop through available spots
  for (var i = 0; i < availSpots.length; i++){
    //create an object for each and store the index of that spot that was stored as a number in the object's index key
    var move = {};
  	move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    //if collect the score resulted from calling minimax on the opponent of the current player
    if (player == aiPlayer){
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    }
    else{
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    //reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }

// if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if(player === aiPlayer){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{

// else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

// return the chosen move (object) from the array to the higher depth
  return moves[bestMove];
}

turn_change();
