import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import { QuizMarvel } from '../QuizMarvel';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver';

toast.configure();

class Quiz extends Component {

    constructor(props) {
        super(props)
    
        this.initialState = {
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
            quizEnd: false,
            percent: 0
        }

        this.state = this.initialState;

        this.storedDataRef = React.createRef();
    }

    loadQuestions = level => {
        const fetchedArrayQuiz = QuizMarvel[0].quiz[level];

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
        if ((this.state.storedQuestions !== prevState.storedQuestions) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options
            })
        }
        
        if ((this.state.idQuestion !== prevState.idQuestion) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options,
                btnDisabled: true,
                userAnswer: null
            })
        }

        if (this.state.score !== prevState.score) {
            const gradePercent = (this.state.score/this.state.maxQuestions)*100;
            this.setState({percent: gradePercent});
        }

        if (this.state.quizEnd !== prevState.quizEnd) {
            this.gameOver(this.state.percent);
        }

        if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
            this.showToastMsg(this.props.userData.pseudo);
        }

    }

    submitAnswer = selectAnswer => {
        this.setState({
            userAnswer: selectAnswer,
            btnDisabled: false
        })
    }


    gameOver = (gradePercent) => {
        if (gradePercent >= 50) {
            this.setState({
                quizLevel: this.state.quizLevel +1
            })
        }
    }

    nextQuestion = () => {
        if (this.state.idQuestion === this.state.maxQuestions-1) {
            this.setState({
                quizEnd: true
            })
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

    showToastMsg = pseudo => {
        toast.warn(`Bienvenue ${pseudo} et bonne chance !`, {
            position: "top-right",
            autoClose: 4000,
            bodyClassName: 'toastify-color-welcome'
        });
    }

    loadLevelQuestions = param => {
        this.setState({...this.initialState, quizLevel: param});

        this.loadQuestions(this.state.levelNames[param]);
    }

    render() {

        return (
            this.state.quizEnd ? 
                < QuizOver
                    ref={this.storedDataRef}
                    levelNames={this.state.levelNames}
                    quizLevel={this.state.quizLevel}
                    score={this.state.score}
                    maxQuestions={this.state.maxQuestions}
                    percent={this.state.percent}
                    loadLevelQuestions={this.loadLevelQuestions}
                />
            :            
                <>
                    <Levels 
                        levelNames={this.state.levelNames}
                        quizLevel={this.state.quizLevel}
                    />
                    <ProgressBar
                        idQuestion={this.state.idQuestion}
                        maxQuestions={this.state.maxQuestions}
                    />
                    <h2>{this.state.question}</h2>
                    
                    {this.state.options.map((option, i) => 
                        <p key={i} className={`answerOptions${this.state.userAnswer===option?' selected':''}`} onClick={_=>this.submitAnswer(option)}>
                            {option}
                        </p>
                    )}

                    <button
                        disabled={this.state.btnDisabled}
                        className="btnSubmit"
                        onClick={this.nextQuestion}
                    >
                        {this.state.idQuestion<this.state.maxQuestions-1?'Suivant':'Terminer'}
                    </button>
                </>
        )
    }
}

export default Quiz;