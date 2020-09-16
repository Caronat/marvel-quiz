import React, { useEffect, useState } from 'react';

const QuizOver = React.forwardRef((props, ref) => {

    const {levelNames, quizLevel, score, maxQuestions, percent, loadLevelQuestions} = props;
    
    const [asked, setAsked] = useState([]);
    
    useEffect(() => {
        setAsked(ref.current)    
    }, [ref]);

    if (percent < 50) {
        // setTimeout(() => loadLevelQuestions(0), 3000);
        setTimeout(() => loadLevelQuestions(quizLevel), 3000);
    }

    const result = percent >= 50 ? (   
        <>
            <div className="stepsBtnContainer">
            {
                quizLevel < levelNames.length ? (
                    <>
                        <p className="successMsg">Bravo, passez au niveau suivant !</p>
                        <button
                            className="btnResult success"
                            onClick={_=>loadLevelQuestions(quizLevel)}
                        >
                            Niveau suivant
                        </button>
                    </>
                )
                :
                (
                    <>
                        <p className="successMsg">Bravo, vous êtes un expert !</p>
                        <button
                            className="btnResult gameOver"
                            onClick={_=>loadLevelQuestions(0)}
                        >
                            Accueil
                        </button>
                    </>
                )
            }
            </div>
            <div className="percentage">
                <div className="progressPercent">Réussite : {percent}%</div>
                <div className="progressPercent">Note : {score}/{maxQuestions}</div>
            </div>
        </>
    )
    :
    (
        <>
            <div className="stepsBtnContainer">
                <p className="failureMsg">Vous avez échoué !</p>
            </div>
            <div className="percentage">
                <div className="progressPercent">Réussite : {percent}%</div>
                <div className="progressPercent">Note : {score}/{maxQuestions}</div>
            </div>
        </>
    )

    const tableBodyRows = percent >= 50 ? (
        asked.map(question => {
            return (
                <tr key={question.id}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td><button className="btnInfo">Infos</button></td>
                </tr>
            )
        })
    )
    :
    (
        <tr>
            <td colSpan="3">
                <div className="loader"></div>
                <p style={{textAlign: 'center', color: 'red'}}>Pas de réponses !</p>
            </td>
        </tr>
    )

    return (
        <>
            {result}

            <hr />
            <p>Les réponses aux questions posées :</p>

            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Qestion</th>
                            <th>Réponse</th>
                            <th>Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableBodyRows}
                    </tbody>
                </table>
            </div>
        </>
    )
})

export default React.memo(QuizOver);