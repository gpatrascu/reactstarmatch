import React from "react";

interface IPlayAgainClickPropsInterface {
  status: string,
  onClick: () => any
}

export const PlayAgain = ({ onClick, status }: IPlayAgainClickPropsInterface) => {
  return (
    <div className="game-done">
      <div
        className="message"
        style={{ color: status === "win" ? "green" : "red" }}
      >
        {status === "win" ? "You won!" : "Game over. You lost!"}
      </div>
      <button onClick={onClick}>Play again</button>
    </div>
  );
};