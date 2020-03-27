import React from 'react';

const GameOver = props => (
  <div>
    <h1>GAME OVER!</h1>
    <p>
      Final score: <strong>{props.score}</strong>
    </p>
    <button className="btn btn-lg btn-primary" onClick={props.startNew}>
      Play Again?
    </button>
  </div>
);

export default GameOver;
