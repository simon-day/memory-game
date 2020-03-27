import React from 'react';
import { Animated } from 'react-animated-css';
import GameOver from './GameOver';

const GameSpace = props => {
  const wrongAnswerStyle = {
    color: 'red',
    fontWeight: 'bold',
    textTransform: 'lowercase'
  };

  const {
    livesLeft,
    wrongAnswer,
    currentWord,
    startGame,
    score,
    selectClick,
    startNew,
    isVisible
  } = props;

  if (livesLeft <= 0) {
    return <GameOver startNew={startNew} score={score} />;
  } else {
    return (
      <div>
        {!currentWord && (
          <button className="btn btn-success btn-lg" onClick={startGame}>
            Start Game
          </button>
        )}
        <Animated
          animationIn="bounceInLeft"
          animationOut="zoomOut"
          isVisible={isVisible}
          className="m-4"
        >
          <h2
            className="h1"
            style={
              wrongAnswer ? wrongAnswerStyle : { textTransform: 'lowercase' }
            }
          >
            {props.currentWord}
          </h2>
        </Animated>
        <div className="btn-group mb-10">
          <button
            className="btn btn-lg btn-secondary"
            value="seen"
            disabled={wrongAnswer || !isVisible}
            onClick={() => selectClick('seen')}
          >
            Seen
          </button>
          <button
            className="btn btn-lg btn-primary"
            value="new"
            disabled={wrongAnswer || !isVisible}
            onClick={() => selectClick('new')}
          >
            New
          </button>
        </div>
        <div>
          <h4 className="mt-20">SCORE: {score}</h4>
          {wrongAnswer && <p style={{ fontWeight: 'bold' }}>Wrong Answer!</p>}
          <p>Lives Left: {livesLeft}</p>
        </div>
      </div>
    );
  }
};

export default GameSpace;
