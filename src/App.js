import React, { Component } from 'react';
import axios from 'axios';
import GameSpace from './GameSpace';

class App extends Component {
  state = {
    wordLibrary: [],
    seenWords: [],
    currentWord: '',
    score: 0,
    wrongAnswer: false,
    isVisible: false,
    livesLeft: 5
  };

  handleFetchData = () => {
    axios
      .get(
        `https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=adjective&excludePartOfSpeech=family-name&minCorpusCount=120000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=11&sortBy=count&sortOrder=asc&limit=100&api_key=${
          process.env.REACT_APP_WORDNIK_KEY
        }`
      )
      .then(({ data }) => {
        this.setState(() => {
          return {
            wordLibrary: data,
            seenWords: [],
            currentWord: '',
            score: 0,
            wrongAnswer: false,
            isVisible: false,
            livesLeft: 5
          };
        });
      });
  };

  componentDidMount() {
    this.handleFetchData();
  }

  handleSelectionSeenOrNewWord = () => {
    if (this.state.seenWords.length < 5) {
      this.handleGetNewWord();
    } else {
      const randomNum = Math.random();
      if (randomNum < 0.7 - this.state.seenWords.length / 500) {
        this.handleGetNewWord();
      } else {
        this.handleGetSeenWord();
      }
    }
  };

  handleGetSeenWord = () => {
    const randomNum = Math.floor(Math.random() * this.state.seenWords.length);
    const randomWord = this.state.seenWords[randomNum];
    this.setState(prevState => {
      return {
        seenWords: prevState.seenWords.concat(randomWord),
        currentWord: randomWord,
        isVisible: true
      };
    });
  };

  handleGetNewWord = () => {
    const randomNum = Math.floor(Math.random() * this.state.wordLibrary.length);
    const randomWord = this.state.wordLibrary[randomNum];
    this.setState(prevState => {
      return {
        seenWords: prevState.seenWords.concat(randomWord.word),
        wordLibrary: prevState.wordLibrary.filter(
          item => item.word !== randomWord.word
        ),
        currentWord: randomWord.word,
        isVisible: true
      };
    });
  };

  handleWrongAnswer = () => {
    setTimeout(() => {
      this.handleSelectionSeenOrNewWord();
      this.setState(prevState => {
        return {
          wrongAnswer: false
        };
      });
    }, 900);
  };

  handleSeenRightAnswer = () => {
    setTimeout(() => {
      this.setState(prevState => {
        return {
          seenWords: prevState.seenWords.slice(0, -1),
          score: prevState.score + 1
        };
      });
      this.handleSelectionSeenOrNewWord();
      this.setState(prevState => {
        return {
          wrongAnswer: false
        };
      });
    }, 600);
  };

  handleNewRightAnswer = () => {
    setTimeout(() => {
      this.setState(prevState => {
        return {
          score: prevState.score + 1
        };
      });
      this.handleSelectionSeenOrNewWord();
      this.setState(prevState => {
        return {
          wrongAnswer: false
        };
      });
    }, 600);
  };

  handleSelection = value => {
    const { seenWords, currentWord } = this.state;

    this.setState(prevState => {
      return {
        isVisible: !prevState.isVisible
      };
    });

    if (
      value === 'seen' &&
      seenWords.indexOf(currentWord) !== seenWords.lastIndexOf(currentWord)
    ) {
      this.handleSeenRightAnswer();
    } else if (
      value === 'new' &&
      seenWords.indexOf(currentWord) === seenWords.lastIndexOf(currentWord)
    ) {
      this.handleNewRightAnswer();
    } else {
      this.handleWrongAnswer();
      this.setState(prevState => {
        return {
          livesLeft: prevState.livesLeft - 1,
          wrongAnswer: true
        };
      });
    }
  };

  render() {
    const {
      livesLeft,
      isVisible,
      currentWord,
      score,
      wrongAnswer
    } = this.state;
    return (
      <div className="container text-center col">
        <h1 className="display-3">Test Your Memory</h1>
        <p className="lead">
          Is it a new word or have you already seen it? Stretch your brain and
          see how long you can last!
        </p>
        <GameSpace
          startGame={this.handleGetNewWord}
          currentWord={currentWord}
          score={score}
          livesLeft={livesLeft}
          wrongAnswer={wrongAnswer}
          isVisible={isVisible}
          selectClick={this.handleSelection}
          startNew={this.handleFetchData}
        />
      </div>
    );
  }
}

export default App;
