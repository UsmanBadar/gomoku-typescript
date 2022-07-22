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
message to display whose turn and at the finish, winner. This also initializes
the virtual board - 2D array for capturing the state of board.
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
               playerClick(rowNumber, colNumber, virtualBoard);
            }
            row.appendChild(cube);
        }
        board.appendChild(row);
    }
    document.getElementById('main')!.appendChild(board);
}


