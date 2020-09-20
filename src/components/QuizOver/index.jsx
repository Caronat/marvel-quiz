import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import Modal from "../Modal";
import { GiTrophyCup } from "react-icons/gi";
import axios from "axios";

const QuizOver = React.forwardRef((props, ref) => {
  const {
    levelNames,
    quizLevel,
    score,
    maxQuestions,
    percent,
    loadLevelQuestions,
  } = props;

  const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
  const hash = "ed90b4bfcc991bb873d4be5530776365";

  const [asked, setAsked] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [characterData, setCharacterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAsked(ref.current);

    if (localStorage.getItem("marvelStorageDate")) {
      checkDataDate(localStorage.getItem("marvelStorageDate"));
    }
  }, [ref]);

  const checkDataDate = (date) => {
    const daysDifference = (Date.now() - date) / (1000 * 3600 * 24);

    if (daysDifference > 2) {
      localStorage.clear();
      localStorage.setItem("marvelStorageDate", Date.now());
    }
  };

  const showModal = (heroId) => {
    setOpenModal(true);

    if (localStorage.getItem(heroId)) {
      setCharacterData(JSON.parse(localStorage.getItem(heroId)));
      setLoading(false);
    } else {
      axios
        .get(
          `https://gateway.marvel.com/v1/public/characters/${heroId}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`
        )
        .then((res) => {
          setCharacterData(res.data);
          setLoading(false);

          localStorage.setItem(heroId, JSON.stringify(res.data));
          if (!localStorage.getItem("marvelStorageDate")) {
            localStorage.setItem("marvelStorageDate", Date.now());
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const hideModal = () => {
    setOpenModal(false);
    setLoading(true);
  };

  if (percent < 50) {
    setTimeout(() => loadLevelQuestions(quizLevel), 3000);
  }

  const result =
    percent >= 50 ? (
      <>
        <div className="stepsBtnContainer">
          {quizLevel < levelNames.length ? (
            <>
              <p className="successMsg">Bravo, passez au niveau suivant !</p>
              <button
                className="btnResult success"
                onClick={(_) => loadLevelQuestions(quizLevel)}
              >
                Niveau suivant
              </button>
            </>
          ) : (
            <>
              <p className="successMsg">
                <GiTrophyCup size="50px" /> Bravo, vous êtes un expert !
              </p>
              <button
                className="btnResult gameOver"
                onClick={(_) => loadLevelQuestions(0)}
              >
                Accueil
              </button>
            </>
          )}
        </div>
        <div className="percentage">
          <div className="progressPercent">Réussite : {percent}%</div>
          <div className="progressPercent">
            Note : {score}/{maxQuestions}
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="stepsBtnContainer">
          <p className="failureMsg">Vous avez échoué !</p>
        </div>
        <div className="percentage">
          <div className="progressPercent">Réussite : {percent}%</div>
          <div className="progressPercent">
            Note : {score}/{maxQuestions}
          </div>
        </div>
      </>
    );

  const tableBodyRows =
    percent >= 50 ? (
      asked.map((question) => {
        return (
          <tr key={question.id}>
            <td>{question.question}</td>
            <td>{question.answer}</td>
            <td>
              <button
                className="btnInfo"
                onClick={(_) => showModal(question.heroId)}
              >
                Infos
              </button>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="3">
          <Loader
            loadingMsg="Pas de réponses !"
            styling={{ textAlign: "center", color: "red" }}
          />
        </td>
      </tr>
    );

  const resultInModal = !loading ? (
    <>
      <div className="modalHeader">
        <h2>{characterData.data.results[0].name}</h2>
      </div>
      <div className="modalBody">
        <div className="comicImage">
          <img
            src={
              characterData.data.results[0].thumbnail.path +
              "." +
              characterData.data.results[0].thumbnail.extension
            }
            alt={"Image " + characterData.data.results[0].name}
          />
          <p>{characterData.attributionText}</p>
        </div>
        <div className="comicDetails">
          <h3>Description</h3>
          <p>
            {characterData.data.results[0].description
              ? characterData.data.results[0].description
              : "description indisponible"}
          </p>
          <h3>Plus d'infos</h3>
          {characterData.data.results[0].urls &&
            characterData.data.results[0].urls.map(({ type, url }, i) => {
              return (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  {type[0].toUpperCase()+type.substr(1).toLowerCase()}
                </a>
              );
            })}
        </div>
      </div>
      <div className="modalFooter">
        <button className="modalBtn" onClick={hideModal}>
          Fermer
        </button>
      </div>
    </>
  ) : (
    <>
      <div className="modalHeader">
        <h2>En attente des données Marvel ...</h2>
      </div>
      <div className="modalBody">
        <Loader />
      </div>
    </>
  );

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
          <tbody>{tableBodyRows}</tbody>
        </table>
      </div>

      <Modal showModal={openModal}>{resultInModal}</Modal>
    </>
  );
});

export default React.memo(QuizOver);
