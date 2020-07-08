import React, { useState, useEffect } from "react";
import { BsIntersect, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { uid } from "react-uid";
import Timer from "./Timer";
import CorrectSound from "./correct-sound.mp3";
import { SubmitQuizResult } from "../../../api/socket-requests";
import store from "../../../store/store";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const StoreResult = (questions, userId, quizId, groupId, bookId) => {
  let correctAnswers = questions.filter((x) => x.answer === x.correctAnswer)
    .length;
  SubmitQuizResult(
    {
      correct_answers: correctAnswers,
      questions: questions.length,
      quiz_id: quizId,
      user_id: userId,
    },
    groupId,
    bookId,
    (res) => {
      store.dispatch({
        type: "SET NOTIFICATION",
        notification: {
          title: "Congratulations!",
          message: "You completed quiz",
          type: "success",
        },
      });
    }
  );
};

const Game = ({ userId, quiz, onGoHome, getQuizAgain, groupId, bookId }) => {
  const [questions, setQuestions] = useState([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let gameQuestions = [];
    let arr = JSON.parse(JSON.stringify(quiz.questions));
    arr.forEach((x) => {
      let q = Object.assign({}, x, { answer: -1 });
      gameQuestions.push(q);
    });
    setQuestions(gameQuestions);
    setTime(quiz.time);
  }, [quiz]);

  const [help, setHelp] = useState({ cutHalf: 3, cutOne: 3 });

  const [timeOver, setTimeOver] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const correctAnswers = questions.filter((x) => x.correctAnswer === x.answer)
    .length;
  const score = Math.floor((correctAnswers / questions.length) * 100);
  return (
    <div
      className="container-fluid px-3 bg-light overflow-auto"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 5,
      }}
    >
      <div className="row no-gutters py-5 justify-content-center">
        {!questions.filter((x) => x.answer === -1).length || timeOver ? (
          <div className="col-12 col-md-8 col-lg-7" style={{ fontWeight: 500 }}>
            <div className="row no-gutters">
              <div className="col-12 bg-white p-4 static-card">
                <div className="row no-gutters h1 justify-content-center mb-4">
                  {score < 50
                    ? "No one is perfect"
                    : score < 75
                    ? "You can do better"
                    : score < 100
                    ? "Great!"
                    : "Awesome! All answers correct!"}
                </div>
                <div className="row no-gutters h2 text-primary justify-content-center mb-4">
                  Your score is {score}%
                </div>
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto">Total number of questions</div>
                  <div className="col-auto">{questions.length}</div>
                </div>
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto">Number of attempted questions</div>
                  <div className="col-auto">
                    {questions.filter((x) => x.answer !== -1).length}
                  </div>
                </div>
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto">Number of correct answers</div>
                  <div className="col-auto">{correctAnswers}</div>
                </div>
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto">Number of wrong answers</div>
                  <div className="col-auto">
                    {
                      questions.filter(
                        (x) => x.answer !== -1 && x.answer !== x.correctAnswer
                      ).length
                    }
                  </div>
                </div>
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto">-1 help used</div>
                  <div className="col-auto">{3 - help.cutOne} out of 3</div>
                </div>
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto">50:50 help used</div>
                  <div className="col-auto">{3 - help.cutHalf} out of 3</div>
                </div>
                <div className="row no-gutters justify-content-center pt-2">
                  <div
                    className="col-12 col-sm-auto text-center m-1 fb-btn-primary cursor-pointer"
                    onClick={() => {
                      let quiz = getQuizAgain();
                      let gameQuestions = [];
                      quiz.questions.forEach((x) => {
                        let q = Object.assign({}, x, { answer: -1 });
                        gameQuestions.push(q);
                      });
                      setTime(quiz.time);
                      setQuestions(gameQuestions);
                      setCurrentQuestion(0);
                      setHelp({ cutHalf: 3, cutOne: 3 });
                    }}
                  >
                    Play again
                  </div>
                  <div
                    className="col-12 col-sm-auto text-center fb-btn-pro m-1 cursor-pointer"
                    onClick={onGoHome}
                  >
                    Go home
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="col-12 col-sm-11 col-md-10 col-lg-9 user-select-none"
            style={{ fontSize: "24px", fontWeight: "600" }}
          >
            <div className="row no-gutters justify-content-between px-2">
              <div className="col-auto mb-2">
                <div className="row no-gutters">
                  <div className="col-auto mr-3">
                    <div
                      onClick={() => {
                        if (
                          help.cutHalf > 0 &&
                          questions[currentQuestion].answers.filter(
                            (x) => x !== ""
                          ).length > 1
                        ) {
                          let arr = [...questions];
                          let deletableAnswers = [];
                          for (let i = 0; i < 4; i++) {
                            if (
                              i !== questions[currentQuestion].correctAnswer &&
                              questions[currentQuestion].answers[i] !== ""
                            ) {
                              deletableAnswers.push(i);
                            }
                          }
                          let ind = getRandomInt(
                            0,
                            deletableAnswers.length - 1
                          );
                          arr[currentQuestion].answers[deletableAnswers[ind]] =
                            "";
                          deletableAnswers.splice(ind, 1);
                          ind = getRandomInt(0, deletableAnswers.length - 1);
                          arr[currentQuestion].answers[deletableAnswers[ind]] =
                            "";
                          setQuestions(arr);
                          setHelp((prev) =>
                            Object.assign({}, prev, {
                              cutHalf: help.cutHalf - 1,
                            })
                          );
                        }
                      }}
                      className="d-flex flex-center basic-card rounded-circle position-relative text-white"
                      style={{
                        width: "80px",
                        height: "80px",
                        overflow: "visible",
                        background: "#ff8181",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="d-flex flex-center bg-white text-dark border"
                        style={{
                          position: "absolute",
                          top: "-15px",
                          right: "-15px",
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          fontSize: "14px",
                        }}
                      >
                        {help.cutHalf}
                      </div>
                      50:50
                    </div>
                  </div>
                  <div className="col-auto">
                    <div
                      onClick={() => {
                        if (
                          help.cutOne > 0 &&
                          questions[currentQuestion].answers.filter(
                            (x) => x !== ""
                          ).length > 1
                        ) {
                          let arr = [...questions];
                          let deletableAnswers = [];
                          for (let i = 0; i < 4; i++) {
                            if (
                              i !== questions[currentQuestion].correctAnswer &&
                              questions[currentQuestion].answers[i] !== ""
                            ) {
                              deletableAnswers.push(i);
                            }
                          }
                          let ind = getRandomInt(
                            0,
                            deletableAnswers.length - 1
                          );
                          arr[currentQuestion].answers[deletableAnswers[ind]] =
                            "";
                          setQuestions(arr);
                          setHelp((prev) =>
                            Object.assign({}, prev, { cutOne: help.cutOne - 1 })
                          );
                        }
                      }}
                      className="d-flex flex-center basic-card rounded-circle text-white position-relative"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "#2ca4ff",
                        overflow: "visible",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="d-flex flex-center bg-white text-dark border"
                        style={{
                          position: "absolute",
                          top: "-15px",
                          right: "-15px",
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          fontSize: "14px",
                        }}
                      >
                        {help.cutOne}
                      </div>
                      -1
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-auto mb-2">
                <Timer
                  initialTime={time}
                  go={time > 0}
                  onFinish={() => {
                    setTimeOver(true);
                    StoreResult(questions, userId, quiz._id, groupId, bookId);
                  }}
                ></Timer>
              </div>
              <div className="col-auto mb-2">
                <div className="row no-gutters">
                  <div className="col-auto mr-3 cursor-pointer">
                    <div
                      className="d-flex flex-center basic-card bg-white"
                      style={{ width: "100px" }}
                      onClick={() =>
                        setCurrentQuestion(
                          currentQuestion - 1 >= 0
                            ? currentQuestion - 1
                            : currentQuestion
                        )
                      }
                    >
                      <BsArrowLeft fontSize="24px"></BsArrowLeft>
                      Prev
                    </div>
                  </div>
                  <div className="col-auto cursor-pointer">
                    <div
                      className="d-flex flex-center basic-card bg-white"
                      style={{ width: "100px" }}
                      onClick={() =>
                        setCurrentQuestion(
                          currentQuestion + 1 < questions.length
                            ? currentQuestion + 1
                            : currentQuestion
                        )
                      }
                    >
                      Next
                      <BsArrowRight fontSize="24px"></BsArrowRight>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-12">
                <div className="row no-gutters p-2">
                  <div className="h2 col-12 static-card bg-white p-4">
                    {currentQuestion + 1}. {questions[currentQuestion].question}
                  </div>
                </div>
                <div className="row no-gutters">
                  {questions[currentQuestion].answers.map((x, i) => (
                    <div
                      key={uid(`answer-${i}`)}
                      className="col-12 col-md-6 p-2"
                      style={{ opacity: x === "" ? 0 : 1 }}
                    >
                      <div
                        onClick={() => {
                          if (questions[currentQuestion].answer === -1) {
                            let arr = [...questions];
                            arr[currentQuestion].answer = i;
                            if (i === arr[currentQuestion].correctAnswer) {
                              let correctSound = new Audio(CorrectSound);
                              correctSound.play();
                            }
                            setQuestions(arr);
                            if (
                              currentQuestion + 1 === questions.length ||
                              questions[currentQuestion + 1].answer !== -1
                            ) {
                              let unanswered = questions
                                .map((x, i) =>
                                  Object.assign({}, x, { index: i })
                                )
                                .filter((x) => x.answer === -1);
                              if (unanswered.length !== 0) {
                                setCurrentQuestion(unanswered[0].index);
                              } else {
                                StoreResult(
                                  questions,
                                  userId,
                                  quiz._id,
                                  groupId,
                                  bookId
                                );
                              }
                            } else {
                              setCurrentQuestion(currentQuestion + 1);
                            }
                          }
                        }}
                        style={{ minHeight: "150px" }}
                        className={`row no-gutters text-white align-items-center cursor-pointer p-4 basic-card bg-answer-${
                          i + 1
                        }`}
                      >
                        {x}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
