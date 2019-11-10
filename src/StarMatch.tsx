import React, {useState, useEffect} from 'react';
import './App.css';

const StarDisplay = ({stars = 0}) =>{  
    return (
            <>
              {utils.range(1, stars).map(starId =>
                  <div key={starId} className="star"/>)}
            </>
    )
};
 
const PlayAgain = ({onClick = () => {}, status = 'win' }) => {
    return (
        <div className = "game-done">
            <div className="message"
            style={{ color: status === "win"? 'green' : 'red'}} >
                {status === 'win'? "You won!" : "Game over. You lost!"}
            </div>
            <button onClick={onClick}>Play again</button>
        </div>
    );
};

const StarMatch = () => {
    const [gameId, setGameId] = useState(1);
    
    return (<Game key = {gameId} 
                  startNewGame = { () => setGameId(gameId + 1) } />);
}

const useGameState = ()=>{
    const [stars, setStars] = useState(utils.random(1,9));
    const [availableNumbers, setAvailableNumbers] = useState<number[]>(utils.range(1,9));
    const [candidateNumbers, setCandidateNumbers] = useState<number[]>([]);
    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect(()=> {
        if (secondsLeft <= 0){
            return;
        }

        const timerId = setTimeout( ()=> {
            setSecondsLeft(secondsLeft -1);
        }, 1000 );

        return ()=> clearTimeout(timerId);
    });
}

const Game = ({ startNewGame = () =>{} }) => {
  const [stars, setStars] = useState(utils.random(1,9));
  const [availableNumbers, setAvailableNumbers] = useState<number[]>(utils.range(1,9));
  const [candidateNumbers, setCandidateNumbers] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
  
  useEffect(()=> {
      if (secondsLeft <= 0){
          return;
      }
      
      const timerId = setTimeout( ()=> {
         setSecondsLeft(secondsLeft -1);
         }, 1000 ); 
      
     return ()=> clearTimeout(timerId); 
  });

  const gameIsWon = availableNumbers.length === 0;
  
  const gameIsLost = secondsLeft <= 0;
  
  const gameStatus = gameIsWon ? 'win' : gameIsLost ? 'lost' : 'active';
  
  const getState = (number : number) => {
      
      if (!availableNumbers.includes(number)){
          return 'used';
      }
      
      if (!candidateNumbers.includes(number)){
          return 'available';
      }
      
      if (utils.sum(candidateNumbers) > stars){
          return 'wrong';
      }

      return 'candidate'
  };
  
  const resetGame = () => {
      startNewGame();
  };
  
  const onNumberClick = (number: number, state = "available") => {
      if (state === "used"){
          return;
      }
      
      if (gameStatus !== 'active')
      {
          return;
      }

      const newCandidates = state === "available" 
          ? candidateNumbers.concat(number)
          : candidateNumbers.filter(value => value !== number);
      
      if (utils.sum(newCandidates) === stars){
          const newAvailableNums = availableNumbers
              .filter(value => !newCandidates.includes(value));
          setStars(utils.randomSumIn(newAvailableNums, 9));
          setAvailableNumbers(newAvailableNums);
          setCandidateNumbers([]);
      }
      else{
          setCandidateNumbers(newCandidates);
      }
      
  };
    return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="left">
              { gameStatus !== 'active'
                  ? (<PlayAgain onClick={resetGame} status={gameStatus}/>) 
                  : (<StarDisplay stars={stars}/>)
              }
          </div>
          <div className="right">
            {utils.range(1, 9).map(number =>
                <PlayNumber key={number} 
                            number={number}
                            state = {getState(number)}
                            onClick={onNumberClick}
                />) }
          </div>
        </div>
        <div className="timer">Time Remaining: {secondsLeft}</div>
      </div>
  );
};

const PlayNumber = ({number = 0, state='available', onClick = (number: number, state:string) => {}}) =>{
  return <button className="number"
                 style={{backgroundColor: colors[state]}}
                 onClick={() => onClick(number, state)}
  >
      {number}
          </button>
};

interface IData {
    [ key: string ]: string;
}

// Color Theme
const colors:IData = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
// @ts-ignore
const utils = {
  // Sum an array
  sum: (arr : number[]) => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min:number, max:number) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min:number, max:number) => min + Math.floor(max * Math.random()),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr:number[], max:number) => {
    const sets:number[][] = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length)];
  },
};

export default StarMatch;


