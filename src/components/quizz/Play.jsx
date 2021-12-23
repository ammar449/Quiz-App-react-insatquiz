import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import questions from "../../questions.json";
import isEmpty from "../../utils/is-Empty";
import M from "materialize-css";

//import sounds

import corectNotifecation from "../../assests/sounds/correct-answer.mp3";
import wrongtNotifecation from "../../assests/sounds/wrong-answer-2.mp3";
import selectNotifecation from "../../assests/sounds/select.mp3";
import classNames from "classnames";

// try Json server calls instead of importing question from a file
class Play extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: questions,
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      answer: "",
      numberofQuestions: 0,
      numberOfAnsweredQuestions: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnwers: 0,
      hints: 5,
      previousRandomNumbers: [],
      fiftyFifty: 2,
      usedFiftyFifty: false,
      time: {},
      nextButtonDisabled: false,
      previuosButtonDisabled: true,
    };
    this.interval = null;
    this.wrongSound = React.createRef();
    this.correctSound = React.createRef();
    this.buttonSound = React.createRef();
  }
  componentDidMount() {
    const { questions, currentQuestion, nextQuestion, previousQuestion } =
      this.state;
    this.displayQusetions(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    );
    this.startTimerMethod();
  }

  displayQusetions = (
    questions,
    currentQuestion,
    nextQuestion,
    previousQuestion
  ) => {
    questions = this.state.questions;
    let { currentQuestionIndex } = this.state;
    if (!isEmpty(questions)) {
      // try is empt from same file instead of importing it
      questions = this.state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestionIndex - 1];
      const answer = currentQuestion.answer;
      this.setState(
        {
          currentQuestion,
          nextQuestion,
          previousQuestion,
          numberofQuestions: questions.length,
          answer,
          previousRandomNumbers: [],
        },
        () => {
          this.showOptions();
          this.handleDisableButton();
        }
      );
    }
  };

  // answering questions

  handleOPtionClick = (e) => {
    if (
      e.target.textContent.toLowerCase().trim() ===
      this.state.answer.toLowerCase().trim()
    ) {
      setTimeout(() => {
        this.correctAnswer();
      }, 1500);
      this.correctSound.current.play();
    } else {
      setTimeout(() => {
        this.wrongAnswer();
      }, 1500);
      this.wrongSound.current.play();
    }
  };

  correctAnswer = () => {
    M.toast({
      html: "Correct Answer",
      classes: "toast-valid",
      displayLength: 1500,
    });
    this.setState(
      (prevState) => ({
        score: prevState.score + 1,
        correctAnswers: prevState.correctAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }), // uploading next question

      // uploading next question
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endGameHandle();
        } else {
          this.displayQusetions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      }
    );
  };
  wrongAnswer = () => {
    navigator.vibrate(1000);
    M.toast({
      html: "Wrong Answer",
      classes: "toast-invalid",
      displayLength: 1500,
    });
    this.setState(
      (prevState) => ({
        score: prevState.score + 1,
        wrongAnwers: prevState.wrongAnwers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      // uploading next question
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endGameHandle();
        } else {
          this.displayQusetions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      }
    );
  };
  // navigate the questions:
  // navigate Question

  handleButtonClick = (e) => {
    switch (e.target.id) {
      case "next-button":
        this.handleNextButtonClick();
        break;
      case "previous-button":
        this.handlePreviousButtonClick();
        break;
      case "quit-button":
        this.handleQuitButtonClick();
        break;
      default:
        break;
    }
  };
  playButtonSound = () => {
    document.getElementById("select-sound").play();
  };
  handleNextButtonClick = () => {
    this.playButtonSound();
    if (this.state.nextQuestion !== undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
        }),
        () => {
          this.displayQusetions(
            this.state.state,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };

  handlePreviousButtonClick = () => {
    this.playButtonSound();
    if (this.state.previousQuestion !== undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
        }),
        () => {
          this.displayQusetions(
            this.state.state,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };
  handleQuitButtonClick = () => {
    this.playButtonSound();
    if (window.confirm("Are you sure you want to quit?")) {
      this.props.history.push("/");
    }
  };
  // life line functions :
  showOptions = () => {
    const options = Array.from(document.querySelectorAll(".option"));

    options.forEach((option) => {
      option.style.visibility = "visible";
    });
    this.setState({
      usedFiftyFifty: false,
    });
  };
  handleHints = () => {
    if (this.state.hints > 0) {
      const options = Array.from(document.querySelectorAll(".option"));
      let indexofAnswer;
      options.forEach((options, index) => {
        if (
          options.innerText.toLowerCase().trim() ===
          this.state.answer.toLowerCase().trim()
        ) {
          indexofAnswer = index;
        }
      });
      while (true) {
        let randomNumber = Math.round(Math.random() * 3);
        console.log(randomNumber);
        if (
          randomNumber !== indexofAnswer &&
          !this.state.previousRandomNumbers.includes(randomNumber)
        ) {
          options.forEach((option, index) => {
            if (index === randomNumber) {
              option.style.visibility = "hidden";

              this.setState((prevState) => ({
                hints: prevState.hints - 1,
                previousRandomNumbers:
                  prevState.previousRandomNumbers.concat(randomNumber),
              }));
            }
          });
          break;
        }
        if (this.state.previousRandomNumbers.length >= 3) break;
      }
    }
  };

  handleFiftyFifty = () => {
    if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
      const options = document.querySelectorAll(".option");
      console.log(options);
      const randomNumbers = [];
      let indexOfAnswer;

      options.forEach((option, index) => {
        // console.log(option.textContent.toLowerCase());
        // console.log(this.state.answer.toLowerCase());
        if (
          option.textContent.toLowerCase().trim() ===
          this.state.answer.toLowerCase().trim()
        ) {
          indexOfAnswer = index;
          console.log("this is the optoin text content" + option.textContent);
          console.log("this is index of Answer=> " + indexOfAnswer);
          console.log(
            "this is the answer => " + this.state.answer.toLowerCase()
          );
        }
      });
      let count = 0;
      do {
        let randomNumber = Math.floor(Math.random() * 3);
        console.log("Random number created=> " + randomNumber);
        if (randomNumber !== indexOfAnswer) {
          if (
            randomNumbers.length < 2 &&
            !randomNumbers.includes(randomNumber) &&
            !randomNumbers.includes(indexOfAnswer)
          ) {
            randomNumbers.push(randomNumber);
            count++;
          } else {
            while (true) {
              let newRandomNumber = Math.round(Math.random() * 3);
              if (
                !randomNumbers.includes(newRandomNumber) &&
                newRandomNumber !== indexOfAnswer
              ) {
                randomNumbers.push(newRandomNumber);
                count++;
                break;
              }
            }
          }
        }
      } while (count < 2);
      options.forEach((option, index) => {
        if (randomNumbers.includes(index)) {
          option.style.visibility = "hidden";
        }
      });
      this.setState((prevState) => ({
        fiftyFifty: prevState.fiftyFifty - 1,
        usedFiftyFifty: true,
      }));
      console.log(indexOfAnswer);

      console.log(randomNumbers);
    }
  };

  startTimerMethod = () => {
    const countDownTime = Date.now() + 220000;
    this.interval = setInterval(() => {
      const now = new Date();
      const distance = countDownTime - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 0) {
        clearInterval(this.interval);
        this.setState(
          {
            time: {
              minutes: 0,
              seconds: 0,
            },
          },
          () => {
            // alert("Quiz has ended!");
            // this.props.history.push("/");
            this.endGameHandle();
          }
        );
      } else {
        this.setState({
          time: {
            minutes,
            seconds,
          },
        });
      }
    }, 2000);
  };
  // change this component inot functional component
  // resum from vid nmber 10

  // disapling buttons
  handleDisableButton = () => {
    if (
      this.state.previousQuestion === undefined ||
      this.state.currentQuestionIndex === 0
    ) {
      this.setState({
        previuosButtonDisabled: true,
      });
    } else {
      this.setState({
        previuosButtonDisabled: false,
      });
    }
    if (
      this.state.nextQuestion === undefined ||
      this.state.currentQuestionIndex + 1 === this.state.numberofQuestions
    ) {
      this.setState({
        nextButtonDisabled: true,
      });
    } else {
      this.setState({
        nextButtonDisabled: false,
      });
    }
  };

  // ending Game
  endGameHandle = () => {
    alert("quiz has ended!");
    const { state } = this;
    const playerStats = {
      score: state.score,
      numberofQuestions: state.numberofQuestions,
      numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
      correctAnswers: state.correctAnswers,
      wrongAnwers: state.wrongAnwers,
      fiftyFiftyUsed: 2 - state.fiftyFifty,
      hintsused: 5 - state.hints,
    };
    console.log("this is playerstats");
    console.log(playerStats);
    setTimeout(() => {
      this.props.history.push("/play/quiz-summary", playerStats);
    }, 3000);
  };
  render() {
    const { currentQuestion } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>Quiz page</title>
        </Helmet>
        <Fragment>
          <audio
            ref={this.correctSound}
            id="correct-sound"
            src={corectNotifecation}
          ></audio>
          <audio
            ref={this.wrongSound}
            id="wrong-sound"
            src={wrongtNotifecation}
          ></audio>
          <audio id="select-sound" src={selectNotifecation}></audio>
        </Fragment>
        <div className="questions">
          {/* the question  */}
          <h2>Quiz Mode</h2>
          <div className="lifeline-container">
            <p>
              <span
                onClick={this.handleFiftyFifty}
                className="mdi mdi-set-center mdi-24px lifeline-icon"
              >
                <span className="lifeline">{this.state.fiftyFifty}</span>
              </span>
            </p>
            <p>
              <span
                onClick={this.handleHints}
                className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"
              >
                <span className="lifeline">{this.state.hints}</span>
              </span>
            </p>
          </div>

          <div className="lifeline-container">
            <p>
              <span>
                {this.state.currentQuestionIndex + 1} of{" "}
                {this.state.numberofQuestions}
              </span>
            </p>
            <p>
              <span className="lifeline">
                {this.state.time.minutes}: {this.state.time.seconds}
              </span>
              <span className="mdi mdi-clock-outline mdi-24px"></span>
            </p>
          </div>

          {/* // the question  */}
          <h5>{currentQuestion.question}</h5>
          {/* the  options  */}
          {/* option 1  */}
          <div className="options-container">
            <p onClick={this.handleOPtionClick} className="option">
              {currentQuestion.optionA}
            </p>
            <p onClick={this.handleOPtionClick} className="option">
              {" "}
              {currentQuestion.optionB}
            </p>
          </div>

          {/* option 2  */}
          <div className="options-container">
            <p onClick={this.handleOPtionClick} className="option">
              {currentQuestion.optionC}
            </p>
            <p onClick={this.handleOPtionClick} className="option">
              {currentQuestion.optionD}
            </p>
          </div>

          {/* buttons container   */}

          <div className="button-container">
            <button
              id="previous-button"
              onClick={this.handleButtonClick}
              className={classNames("", {
                disable: this.state.previuosButtonDisabled,
              })}
            >
              Previous
            </button>
            <button
              id="next-button"
              onClick={this.handleButtonClick}
              className={classNames("", {
                disable: this.state.nextButtonDisabled,
              })}
            >
              Next
            </button>
            <button id="quit-button" onClick={this.handleButtonClick}>
              Quit
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Play;
