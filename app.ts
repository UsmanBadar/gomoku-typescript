// Variables to configure board size
let ROWS: number = 5;
let COLUMNS:number = 5;

// Variables to keep the track of state of game
let virtualBoard: string [][] = [];
let gameOver: boolean = false;
let currentPlayer: string = 'Black';

/*
This is a helper function for UI layout to display form
and waring msg if form validation fails.
User specifies the dimensions of the board using this form. 
params: null
return: void
*/
function userForm(): void{
    const form: HTMLFormElement= document.createElement('form');
    form.setAttribute('id', 'user-form');
    const rowLabel: HTMLElement = document.createElement('label');
    rowLabel.setAttribute('for', 'row-input');
    rowLabel.innerHTML = 'Rows: ';
    const rowInput: HTMLInputElement= document.createElement('input');
    rowInput.setAttribute('type', 'text');
    rowInput.setAttribute('id', 'row-input');
    rowInput.setAttribute('name', 'row-input');
    const colLabel: HTMLElement = document.createElement('label');
    colLabel.setAttribute('for', 'col-input');
    colLabel.innerHTML = 'Columns: ';
    const colInput: HTMLInputElement = document.createElement('input');
    colInput.setAttribute('type', 'text');
    colInput.setAttribute('id', 'col-input');
    colInput.setAttribute('name', 'col-input');
    const submitButton: HTMLInputElement = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', 'Submit');
    const warningMsg: HTMLElement = document.createElement('p');
    warningMsg.setAttribute('id', 'warning-msg');
    form.appendChild(rowLabel);
    form.appendChild(rowInput);
    form.appendChild(colLabel);
    form.appendChild(colInput);
    form.appendChild(submitButton);
    form.addEventListener('submit', handleFormSubmit);
    document.body.appendChild(form);
    document.body.appendChild(warningMsg);
}

/*
This function sets the UI elements on screen.
1: header 2: form 3: main(for game board display) 
4: Player turn and winner msg
params: null
return: void  
*/
function gameLayout(): void {
    const header: HTMLElement = document.createElement('header');
    header.setAttribute('id', 'header');
    header.innerHTML = 'GOMOKU';

    const main: HTMLElement = document.createElement('main');
    main.setAttribute('id', 'main');

    const playerMsg: HTMLElement = document.createElement('div');
    playerMsg.setAttribute('id', 'player-msg');
    const gameStatus: HTMLElement = document.createElement('p');
    gameStatus.setAttribute('id', 'game-status');
    gameStatus.innerHTML = `${currentPlayer} has turn`;
    const resetButton: HTMLElement = document.createElement('button');
    resetButton.setAttribute('id', 'reset');
    resetButton.innerHTML = 'Reset';
    resetButton.addEventListener('click', reset);
    playerMsg.appendChild(gameStatus);
    playerMsg.appendChild(resetButton);

    document.body.appendChild(header);
    userForm();
    document.body.appendChild(main);
    document.body.appendChild(playerMsg);
}

/*
This function makes the board appear on the screen along with the player
message to display whose turn and at the finish, winner. This also 
initializes the virtual board - 2D array for capturing the state of board.
params: rows, columns 
return: void
*/
function createBoard(rows:number, columns:number):void{
    gameLayout();
    const board: HTMLElement = document.createElement('div');
    board.setAttribute('id', `board`);
    board.classList.add('board');
    for(let rowNumber:number = 0; rowNumber < rows; rowNumber++) {
        virtualBoard[rowNumber]=[];
        let row: HTMLElement = document.createElement("div");
        row.classList.add('row');
        row.setAttribute('id', `${rowNumber}`);
        for(let colNumber: number = 0; colNumber < columns; colNumber++){
            virtualBoard[rowNumber][colNumber] = '-';
            let cube: HTMLElement = document.createElement("div");
            cube.classList.add('cube');
            cube.setAttribute('id', `${rowNumber}-${colNumber}`);
            cube.onclick = () => {
               handlePlayerClick(rowNumber, colNumber, virtualBoard);
            }
            row.appendChild(cube);
        }
        board.appendChild(row);
    }
    document.getElementById('main')!.appendChild(board);
}

/*
This function manages the player click on the board.
It makes clicked cube unavailable for the players, decides next turn
and game status whether game is to continue or announce winner.
params: row, cube and virtual board
return: void
*/
function handlePlayerClick(row: number, cube:number, virtualBoard: string[][]): void{
    const warningMsg: HTMLElement = document.getElementById('warning-msg')!;
    if(warningMsg.innerHTML != ''){warningMsg.innerHTML = '';}
    const clickedCube: HTMLElement = document.getElementById(`${row}-${cube}`)!;
    clickedCube.classList.add('clicked', currentPlayer.toLowerCase());
    console.log(clickedCube);
    (currentPlayer === 'Black')? virtualBoard[row][cube] = 'b' : virtualBoard[row][cube] = 'w';
    const gameResult: boolean | string = checkWinner(virtualBoard);
    if(gameResult == 'continue'){
        (currentPlayer == 'Black')? currentPlayer = 'White' : currentPlayer = 'Black';
        document.getElementById('game-status')!.innerHTML = `${currentPlayer} has turn`;
    }else{
        announceWinner(currentPlayer, gameResult);
    }
} 

/*
This function decides the whether there is a winner or game is a draw.
it checks in all four directions to check for a win.
'-' is for the empty cube, 'b' for a black cube and 'w' for a white cube.
if there is '-' present in the 2D array it means game should continue if there
is no winner.
params: board 2D array
return: string | boolean
*/
function checkWinner(board: string[][]): string | boolean{
    let emptyCube: number = 0;
    let height: number = board.length;
    let width: number= board[0].length;
    let result:boolean = false;


    for(let row:number = 0; row < height; row++) {
        for (let col: number = 0; col < width; col++){

            if(board[row][col] === '-'){emptyCube++;}
            // checking vertically
            if(row < height - 4){
                result = fiveInARow(board[row][col], board[row+1][col], 
                    board[row+2][col],board[row+3][col], board[row+4][col]);
                if(result === true){return true;}
            }
            // checking horizontally
            if(col < width - 4){
                result = fiveInARow(board[row][col], board[row][col+1], 
                    board[row][col+2], board[row][col+3], board[row][col+4]);
                    if(result === true){return true;}      
            }
            // checking diagonal right
            if(row < height - 4 && col < width - 4){
                result = fiveInARow(board[row][col], board[row+1][col+1],
                    board[row+2][col+2], board[row+3][col+3],board[row+4][col+4]);
                    if(result === true){return true;} 
            }
            // checking diagonal left
            if(row < height - 4){
                result = fiveInARow(board[row][col], board[row+1][col-1],
                    board[row+2][col-2], board[row+3][col-3],board[row+4][col-4]);
                    if(result === true){return true;}
            }
        }
    }
    if(emptyCube === 0){
        return 'draw';
    }else{
        return 'continue';
    }  
}

/*
This is a helper function for determining if there are five
elements in a row are similar
params: first, second, third, fourth, fifth
return boolean
*/
function fiveInARow(first:string, second:string, 
    third:string, fourth:string, fifth:string):boolean{
    return (first != '-') && (first === second) && 
    (first===third) && (first===fourth) && (first===fifth);
}

/*
This function announce the winner or draw game message
params: player,  result
return: void
*/
function announceWinner(player:string, result:string | boolean):void{
    const board: HTMLElement= document.getElementById('board')!;
    board!.classList.add('clicked');
    if(result === true){
        document.getElementById('game-status')!.innerHTML = `${player} has won!`;
    }else if(result === 'draw'){
        document.getElementById('game-status')!.innerHTML = 'The game is a draw!';
    }
}

/*
This function resets the game
paras: null
return: void
*/
function reset():void{
    const main: HTMLElement = document.getElementById('main')!;
    const playerMsg: HTMLElement = document.getElementById('player-msg')!;
    const form: HTMLElement = document.getElementById('user-form')!;
    const header: HTMLElement = document.getElementById('header')!;
    const warningMsg: HTMLElement = document.getElementById('warning-msg')!;
    document.body.removeChild(header);
    document.body.removeChild(form);
    document.body.removeChild(warningMsg);
    document.body.removeChild(main);
    document.body.removeChild(playerMsg);
    currentPlayer = 'Black';
    virtualBoard = [];
    gameOver = false;
    createBoard(ROWS, COLUMNS);
}

/*
This function handles the form submit event
params: event
return: void
*/
function handleFormSubmit(event:Event):void{
    event.preventDefault();
    const userRowsInput = document.getElementById('row-input') as HTMLInputElement;
    const userColInput = document.getElementById('col-input') as HTMLInputElement;
    const userRows:string = userRowsInput.value.trim();
    const userCols:string = userColInput.value.trim();
    const formValidated: boolean = formValidation(userRows, userCols)
    if(formValidated === false){
        const msg: string = 'Enter an integer value between 5 and 19 for Rows and Columns';
        document.getElementById('warning-msg')!.innerHTML = msg;
    }else{
        document.getElementById('warning-msg')!.innerHTML = '';
        ROWS = parseInt(userRows);
        COLUMNS= parseInt(userCols);
        reset();
    }  
}

/*
This function handles the form validation
params: userRows, userCols
return: void
*/

function formValidation(userRows:string, userCols:string):boolean{
    if((parseFloat(userRows) % 1 != 0 || parseFloat(userCols) % 1 != 0)){
         return false;
    }else if (!(parseInt(userRows) && parseInt(userCols))){
         return false;
    }else if((parseInt(userRows)> 19 || parseInt(userCols)> 19) ||(
         parseInt(userRows) < 5 || parseInt(userCols) < 5)){
         return false;
     }else{
         return true;
     }
 }
 
 
 createBoard(ROWS, COLUMNS);

