import React, { useState } from "react";
import "./App.css";
import { Game } from "./Game";

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  const incrementGameId = () => {setGameId(gameId + 1)};
  return <Game key={gameId} startNewGame={incrementGameId} />;
};

export default StarMatch;
