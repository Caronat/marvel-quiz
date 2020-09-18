import React from "react";

const ProgressBar = ({ idQuestion, maxQuestions }) => {
  const numQuestion = idQuestion + 1;
  const percentQuestion = (numQuestion / maxQuestions) * 100;

  return (
    <>
      <div className="percentage">
        <div className="progressPercent">{`Question: ${numQuestion}/${maxQuestions}`}</div>
        <div className="progressPercent">{`Progression: ${~~percentQuestion}%`}</div>
      </div>
      <div className="progressBar">
        <div
          className="progressBarChange"
          style={{ width: `${~~percentQuestion}%` }}
        ></div>
      </div>
    </>
  );
};

export default React.memo(ProgressBar);
