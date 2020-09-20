import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { QuizMarvel } from "../QuizMarvel";
import Levels from "../Levels";
import ProgressBar from "../ProgressBar";
import QuizOver from "../QuizOver";
import { FaChevronRight } from "react-icons/fa";

toast.configure();

const initialState = {
  quizLevel: 0,
  maxQuestions: 2,
  storedQuestions: [],
  question: null,
  options: [],
  idQuestion: 0,
  btnDisabled: true,
  userAnswer: null,
  score: 0,
  showWelcomeMsg: true,
  quizEnd: false,
  percent: 0,
};

const levelNames = ["debutant", "confirme", "expert"];

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.storedDataRef = React.createRef();
  }

  loadQuestions = (level) => {
    const fetchedArrayQuiz = QuizMarvel[0].quiz[level];

    if (fetchedArrayQuiz.length >= this.state.maxQuestions) {
      this.storedDataRef.current = fetchedArrayQuiz;

      this.setState({
        storedQuestions: fetchedArrayQuiz.map(
          ({ answer, ...keepRest }) => keepRest
        ),
      });
    } else {
      console.log("Pas assez de questions !");
    }
  };

  componentDidMount() {
    this.loadQuestions(levelNames[this.state.quizLevel]);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      maxQuestions,
      storedQuestions,
      idQuestion,
      score,
      quizEnd,
      percent,
    } = this.state;

    if (
      storedQuestions !== prevState.storedQuestions &&
      storedQuestions.length
    ) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
      });
    }

    if (idQuestion !== prevState.idQuestion && storedQuestions.length) {
      this.setState({
        question: storedQuestions[idQuestion].question,
        options: storedQuestions[idQuestion].options,
        btnDisabled: true,
        userAnswer: null,
      });
    }

    if (score !== prevState.score) {
      const gradePercent = (score / maxQuestions) * 100;
      this.setState({ percent: gradePercent });
    }

    if (quizEnd !== prevState.quizEnd) {
      this.gameOver(percent);
    }

    if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
      this.showToastMsg(this.props.userData.pseudo);
    }
  }

  submitAnswer = (selectAnswer) => {
    this.setState({
      userAnswer: selectAnswer,
      btnDisabled: false,
    });
  };

  gameOver = (gradePercent) => {
    if (gradePercent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
      });
    }
  };

  nextQuestion = () => {
    if (this.state.idQuestion === this.state.maxQuestions - 1) {
      this.setState({
        quizEnd: true,
      });
    } else {
      this.setState((prevState) => ({
        idQuestion: prevState.idQuestion + 1,
      }));
    }

    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
    if (this.state.userAnswer === goodAnswer) {
      this.setState((prevState) => ({
        score: prevState.score + 1,
      }));
      toast.success(`Bravo ! 1 point de plus ! 👍`, {
        position: "top-right",
        autoClose: 3000,
        bodyClassName: "toastify-color",
      });
    } else {
      toast.error(`Mauvaise réponse 👎`, {
        position: "top-right",
        autoClose: 3000,
        bodyClassName: "toastify-color",
      });
    }
  };

  showToastMsg = (pseudo) => {
    toast.warn(`Bienvenue ${pseudo} et bonne chance !`, {
      position: "top-right",
      autoClose: 4000,
      bodyClassName: "toastify-color-welcome",
    });
  };

  loadLevelQuestions = (param) => {
    this.setState({ ...initialState, quizLevel: param });
    this.loadQuestions(levelNames[param]);
  };

  render() {
    const {
      quizLevel,
      maxQuestions,
      question,
      options,
      idQuestion,
      btnDisabled,
      userAnswer,
      score,
      quizEnd,
      percent,
    } = this.state;

    return quizEnd ? (
      <QuizOver
        ref={this.storedDataRef}
        levelNames={levelNames}
        quizLevel={quizLevel}
        score={score}
        maxQuestions={maxQuestions}
        percent={percent}
        loadLevelQuestions={this.loadLevelQuestions}
      />
    ) : (
      <>
        <Levels levelNames={levelNames} quizLevel={quizLevel} />
        <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions} />
        <h2>{question}</h2>

        {options.map((option, i) => (
          <p
            key={i}
            className={`answerOptions${
              userAnswer === option ? " selected" : ""
            }`}
            onClick={(_) => this.submitAnswer(option)}
          >
            <FaChevronRight /> {option}
          </p>
        ))}

        <button
          disabled={btnDisabled}
          className="btnSubmit"
          onClick={this.nextQuestion}
        >
          {idQuestion < maxQuestions - 1 ? "Suivant" : "Terminer"}
        </button>
      </>
    );
  }
}

export default Quiz;
