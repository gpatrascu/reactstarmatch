import React, { useEffect, useState } from "react";
import { PlayAgain } from "./PlayAgain";
import { PlayNumber } from "./PlayerNumber";
import { utils } from "./utils";

const StarDisplay = ({ stars = 0 }) => {
  return (
    <>
      {utils.range(1, stars).map(starId => (
        <div key={starId} className="star"/>
      ))}
    </>
  );
};

interface IGameProps {
  startNewGame: () => any
}

export const Game = ({ startNewGame }: IGameProps) => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNumbers, setAvailableNumbers] = useState<number[]>(
    utils.range(1, 9)
  );
  const [candidateNumbers, setCandidateNumbers] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (secondsLeft <= 0 || availableNumbers.length === 0) {
      return;
    }

    const timerId = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  });

  const gameIsWon = availableNumbers.length === 0;

  const gameIsLost = secondsLeft <= 0;

  const gameStatus = gameIsWon ? "win" : gameIsLost ? "lost" : "active";

  const getState = (num: number) => {
    if (!availableNumbers.includes(num)) {
      return "used";
    }

    if (!candidateNumbers.includes(num)) {
      return "available";
    }

    if (utils.sum(candidateNumbers) > stars) {
      return "wrong";
    }

    return "candidate";
  };

  const resetGame = () => {
    startNewGame();
  };

  const onNumberClick = (num: number, state = "available") => {
    if (state === "used") {
      return;
    }

    if (gameStatus !== "active") {
      return;
    }

    const newCandidates =
      state === "available"
        ? candidateNumbers.concat(num)
        : candidateNumbers.filter(value => value !== num);

    if (utils.sum(newCandidates) === stars) {
      const newAvailableNums = availableNumbers.filter(
        value => !newCandidates.includes(value)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNumbers(newAvailableNums);
      setCandidateNumbers([]);
    } else {
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
          {gameStatus !== "active" ? (
            <PlayAgain onClick={resetGame} status={gameStatus}/>
          ) : (
            <StarDisplay stars={stars}/>
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(num => (
            <PlayNumber
              key={num}
              num={num}
              state={getState(num)}
              onClick={onNumberClick}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

