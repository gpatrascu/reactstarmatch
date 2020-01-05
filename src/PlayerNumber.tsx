import React from "react";

interface IPlayNumberProps {
  num: number,
  state: string,
  onClick: (num: number, state: string) => any;
}

export const PlayNumber = ({
                             num,
                             state,
                             onClick
                           }: IPlayNumberProps) => {

  const click = () => onClick(num, state);

  return (
    <button
      className="number"
      style={{ backgroundColor: colors[state] }}
      onClick={click}
    >
      {num}
    </button>
  );
};

interface IData {
  [key: string]: string;
}

// Color Theme
const colors: IData = {
  available: "lightgray",
  candidate: "deepskyblue",
  used: "lightgreen",
  wrong: "lightcoral"
};