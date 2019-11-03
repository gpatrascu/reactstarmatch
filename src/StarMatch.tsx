import React, {FC, useState} from 'react';
import './App.css';

const StarDisplay = ({stars = 0}) =>{  
    return (
            <>
              {utils.range(1, stars).map(starId =>
                  <div key={starId} className="star"/>)}
            </>
    )
};
const StarMatch: FC = () => {
  const [stars, setStars] = useState(utils.random(1,9));
  const [availableNumbers, setAvailableNumbers] = useState<number[]>(utils.range(1,9));
  const [candidateNumbers, setCandidateNumbers] = useState<number[]>([]);

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
  }
  
  const onNumberClick = (number: number, state = "available") => {
      if (state === "used"){
          return;
      }
      
      const newCandidates = candidateNumbers.concat(number);
      
      if (utils.sum(newCandidates) === stars){
          const newAvailableNums = availableNumbers
              .filter(value => !candidateNumbers.includes(value))
              .filter(value => value !== number);
          setStars(utils.randomSumIn(newAvailableNums, 9));
          setAvailableNumbers(newAvailableNums);
          setCandidateNumbers([]);
      }
      else{
          setCandidateNumbers(newCandidates);
      }
      
  }
  
  return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="left">
            <StarDisplay stars={stars}/>
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
        <div className="timer">Time Remaining: 10</div>
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


