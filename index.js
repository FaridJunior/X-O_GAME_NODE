const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let game = {
  state: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  nextPlayer: 'x',
  started: false,
  winner: null,
};

function printBoard(state) {
  printLine();
  printRow(state.slice(0, 3));
  printRow(state.slice(3, 6));
  printRow(state.slice(6, 9));
  printLine();

  function printRow(ar) {
    print('\x1b[36m%s\x1b[0m', `| ${ar[0]},   ${ar[1]},  ${ar[2]}  |`);
  }
  function printLine(n = 13) {
    print('\x1b[35m%s\x1b[0m', ` ${'-'.repeat(n)} `);
  }
}

function print(...args) {
  console.log(...args);
}

function handleUserInput(input) {
  if ((input == 'y' || input == 'Y') && !game.started) {
    startTheGame();
  } else if (!game.started) {
    askUserToStartTheGame();
  } else if (0 < parseInt(input) < 10) {
    handlePlayersMove(input);
    askUsersForNextMove();
  }
}

function askUsersForNextMove() {
  rl.question(`Current Player: ${game.nextPlayer}, input a box number! `, handleUserInput);
}

function startTheGame() {
  game = reducer(game, { type: 'START_THE_GAME' });
  printBoard(game.state);
  askUsersForNextMove();
}

function askUserToStartTheGame() {
  rl.question('Want to start the game? ', handleUserInput);
}

function handlePlayersMove(input) {
  handleGameChange(parseInt(input));
  printBoard(game.state);
  game.winner = calculateWinner(game.state);
  if (game.winner) {
    print('\x1b[32m%s\x1b[0m', `player ${game.winner} is the Winner.................`);
    rl.close();
    return;
  }
}

function handleGameChange(number) {
  if (game.nextPlayer == 'X' || game.nextPlayer == 'x') {
    game = reducer(game, { type: 'PLAYER_X_MOVE', payload: number });
  } else if (game.nextPlayer == 'O' || game.nextPlayer == 'o') {
    game = reducer(game, { type: 'PLAYER_O_MOVE', payload: number });
  }
}

function reducer(game, action) {
  if (action.type == 'START_THE_GAME') {
    return { ...game, started: true };
  } else if (action.type == 'PLAYER_X_MOVE') {
    return {
      ...game,
      state: game.state.map((value) => (value === action.payload ? 'X' : value)),
      nextPlayer: 'O',
    };
  } else if (action.type == 'PLAYER_O_MOVE') {
    return {
      ...game,
      state: game.state.map((value) => (value === action.payload ? 'O' : value)),
      nextPlayer: 'X',
    };
  } else {
    return game;
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return lines.reduce((res, [a, b, c]) => {
    if (res) return res;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }, null);
}

rl.on('close', function () {
  console.log('\nBYE BYE !!! :) ');
  process.exit(0);
});

// **************** main
handleUserInput(); // starting point of the game!
