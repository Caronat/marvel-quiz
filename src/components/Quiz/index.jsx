import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import { QuizMarvel } from '../quizMarvel';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver';

toast.configure();

class Quiz extends Component {

    state = {
        levelNames: ['debutant', 'confirme', 'expert'],
        quizLevel: 0,
        maxQuestions: 10,
        storedQuestions: [],
        question: null,
        options: [],
        idQuestion: 0,
        btnDisabled: true,
        userAnswer: null,
        score: 0,
        showWelcomeMsg: true,
        quizEnd: false
    }

    storedDataRef = React.createRef();

    loadQuestions = level => {
        const fetchedArrayQuiz = QuizMarvel[0].quizz[level];

        if (fetchedArrayQuiz.length >= this.state.maxQuestions) {
            this.storedDataRef.current = fetchedArrayQuiz;

            this.setState({
                storedQuestions: fetchedArrayQuiz.map(({answer, ...keepRest}) => keepRest)
            })
        } else {
            console.log('Pas assez de questions !');
        }
    }

    componentDidMount() {
        this.loadQuestions(this.state.levelNames[this.state.quizLevel])
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.storedQuestions !== prevState.storedQuestions) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options
            })
        }
        
        if (this.state.idQuestion !== prevState.idQuestion) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options,
                btnDisabled: true,
                userAnswer: null
            })
        }

        if (this.props.userData.pseudo) {
            if (this.state.showWelcomeMsg) {
                this.showWelcomeMsg(this.props.userData.pseudo);
                this.setState({
                    showWelcomeMsg: false
                })
            }
        }
    }

    submitAnswer = selectAnswer => {
        this.setState({
            userAnswer: selectAnswer,
            btnDisabled: false
        })
    }

    gameOver = () => {
        this.setState({
            quizEnd: true
        })
    }

    nextQuestion = () => {
        if (this.state.idQuestion === this.state.maxQuestions-1) {
            this.gameOver();
        } else {
            this.setState(prevState => ({
                idQuestion: prevState.idQuestion +1
            }))
        }

        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        if (this.state.userAnswer === goodAnswer) {
            this.setState(prevState=>({
                score: prevState.score+1
            }));
            toast.success(`Bravo ! 1 point de plus ! 👍`, {
                position: "top-right",
                autoClose: 3000,
                bodyClassName: 'toastify-color'
            });
        } else {
            toast.error(`Mauvaise réponse 👎`, {
                position: "top-right",
                autoClose: 3000,
                bodyClassName: 'toastify-color'
            });
        }
    }

    showWelcomeMsg = pseudo => {
        toast.warn(`Bienvenue ${pseudo} et bonne chance !`, {
            position: "top-right",
            autoClose: 4000,
            bodyClassName: 'toastify-color-welcome'
        });
    }

    render() {

        return (
            this.state.quizEnd ? 
                < QuizOver/>
            :            
                <>
                    <Levels />
                    <ProgressBar />
                    <h2>{this.state.question}</h2>
                    
                    {this.state.options.map((option, i) => 
                        <p key={i} className={`answerOptions${this.state.userAnswer===option?' selected':''}`} onClick={_=>this.submitAnswer(option)}>
                            {option}
                        </p>
                    )}

                    <button disabled={this.state.btnDisabled} className="btnSubmit" onClick={this.nextQuestion}>Suivant</button>
                </>
        )
    }
}

export default Quiz;