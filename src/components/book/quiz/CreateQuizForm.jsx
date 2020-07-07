import React, { useState, useRef } from "react";
import Popover from "../../utility/Popover";
import CheckBox from "../../utility/checkbox";
import TextareaAutosize from "react-autosize-textarea";
import { BsChevronLeft, BsClock, BsChevronUp, BsTrash } from "react-icons/bs";
import { uid } from "react-uid";
import { connect } from "react-redux";
import { CreateQuiz } from "../../../api/socket-requests";
import history from "../../../routing/history";
import store from "../../../store/store";

function getInitialState() {
  return {
    title: "",
    answers: ["", "", "", ""],
    question: "",
    correctAnswer: -1,
    edit: false,
    questionIndex: -1,
  };
}

function submitQuiz(quiz, user, bookId, onError, onSuccess) {
  if (quiz.minutes === 0 && quiz.seconds === 0) {
    onError("Give a time for a quiz");
  } else {
    if (quiz.questions.lenght < 3) {
      onError("Come up with at least 3 questions");
    } else {
      let formatedQuiz = {
        questions: quiz.questions,
        time: parseInt(quiz.minutes * 60) + parseInt(quiz.seconds),
        book_id: bookId,
        create_user: user._id,
      };
      if (user.groupMember && user.groupMember.group_id) {
        formatedQuiz["group_id"] = user.groupMember.group_id;
      }
      CreateQuiz(formatedQuiz, (res) => {
        console.log("response after creating quiz", res);
        if (!res.error) {
          onSuccess(res.newQuiz._id);
        }
      });
    }
  }
}

const CreateQuizForm = (props) => {
  const user = props.user;
  const bookId = props.match.params.bookId;
  console.log("bokid quiz", bookId);
  const [newQuestion, setNewQuestion] = useState(getInitialState());
  const [quiz, setQuiz] = useState({ questions: [], minutes: 0, seconds: 0 });
  const [problem, setProblem] = useState("");
  return (
    <div className="row no-gutters justify-content-center p-2">
      <div className="col-10 static-card bg-white">
        <div className="row no-gutters pb-4 pt-4">
          <div className="col-12 h3 px-4">
            <div className="row no-gutters align-items-center justify-content-between">
              <div className="col-auto">
                <div className="row no-gutters">
                  <div className="col-auto mr-4 mb-2">Quiz maker</div>
                  <div className="col-auto mb-2">
                    <div className="row no-gutters align-items-center">
                      <BsClock fontSize="24px" className="mr-2"></BsClock>
                      <div className="col-auto mr-2">
                        <div className="row no-gutters align-items-center">
                          <label className="mb-0 mr-2">minutes</label>
                          <input
                            value={quiz.minutes === 0 ? "" : quiz.minutes}
                            onChange={(e) => {
                              e.persist();
                              setQuiz((prev) =>
                                Object.assign({}, prev, {
                                  minutes: e.target.value,
                                })
                              );
                            }}
                            type="number"
                            min="0"
                            max="2000"
                            placeholder="00"
                            style={{ width: "50px" }}
                          ></input>
                        </div>
                      </div>
                      <div className="col-auto mr-2">
                        <div className="row no-gutters align-items-center">
                          <label className="mb-0 mr-2">seconds</label>
                          <input
                            value={quiz.seconds === 0 ? "" : quiz.seconds}
                            onChange={(e) => {
                              e.persist();
                              setQuiz((prev) =>
                                Object.assign({}, prev, {
                                  seconds: e.target.value,
                                })
                              );
                            }}
                            min="0"
                            max="60"
                            type="number"
                            placeholder="00"
                            style={{ width: "50px" }}
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-auto fb-btn-primary"
                onClick={() => {
                  submitQuiz(
                    quiz,
                    user,
                    bookId,
                    (pr) =>
                      store.dispatch({
                        type: "SET_NOTIFICATION",
                        notification: {
                          type: "failure",
                          message: "Set a time",
                          title: "You missed something",
                        },
                      }),
                    (quizId) => {
                      store.dispatch({
                        type: "SET_NOTIFICATION",
                        notification: {
                          type: "success",
                          message: "Your quiz is online now!",
                          title: "Quiz made",
                        },
                      });
                      history.push(`/books/${bookId}/quiz/${quizId}`);
                    }
                  );
                }}
              >
                Done!
              </div>
            </div>
          </div>

          <div className="col-md-5 col-lg-4 col-12 py-4 py-md-2 pl-4 pr-4 pr-md-2">
            <div className="row no-gutters h-100">
              <div
                className="col-12 p-2 bg-light"
                style={{ border: "1px dashed gray" }}
              >
                {" "}
                {quiz.questions.length ? (
                  quiz.questions.map((x, i) => (
                    <div
                      className="row no-gutters pb-2"
                      key={uid(`questions-${i}`)}
                    >
                      <div
                        className="col-12 p-4 basic-card bg-white cursor-pointer"
                        onClick={() => {
                          let obj = Object.assign({}, x, {
                            edit: true,
                            questionIndex: i,
                          });
                          setNewQuestion(obj);
                        }}
                      >
                        <div className="row no-gutters">
                          <div className="col-12 mr-2">
                            <label>{i + 1} Question</label>
                          </div>
                          <div className="col-12 text-break">{x.question}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="row no-gutters h-100 flex-center"
                    style={{ minHeight: "200px" }}
                  >
                    Your questions
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="col-md-7 col-lg-8 col-12 px-4"
            style={{ fontSize: "16px" }}
          >
            <div className="row no-gutters px-2 mb-3">
              {newQuestion.correctAnswer === -1 ||
              !newQuestion.question ||
              newQuestion.answers.filter((x) => x === "").length ? (
                <Popover
                  theme={"dark"}
                  content={
                    <div className="popover-inner text-light">
                      {!newQuestion.question
                        ? "Enter the question"
                        : newQuestion.answers.filter((x) => x === "").length
                        ? "Enter all answers"
                        : newQuestion.correctAnswer === -1
                        ? "Select corrent answer"
                        : ""}
                    </div>
                  }
                >
                  <div className="col-auto fb-btn-success mr-4">
                    <div className="row no-gutters">
                      <div className="col-auto mr-2 d-md-block d-none">
                        <BsChevronLeft fontSize="18px"></BsChevronLeft>
                      </div>
                      <div className="col-auto mr-2 d-md-none d-block">
                        <BsChevronUp fontSize="18px"></BsChevronUp>
                      </div>
                      <div className="col-auto">
                        {newQuestion.edit
                          ? "Save changes"
                          : "Add question to quiz"}
                      </div>
                    </div>
                  </div>
                </Popover>
              ) : (
                <div className="col-auto fb-btn-success mr-4">
                  <div
                    className="row no-gutters"
                    onClick={() => {
                      let arr = [...quiz.questions];
                      if (newQuestion.edit) {
                        arr[newQuestion.questionIndex] = newQuestion;
                        setQuiz((prev) =>
                          Object.assign({}, prev, {
                            questions: arr,
                          })
                        );
                      } else {
                        setQuiz((prev) =>
                          Object.assign({}, prev, {
                            questions: arr.concat(newQuestion),
                          })
                        );
                      }

                      setNewQuestion(getInitialState());
                    }}
                  >
                    <div className="col-auto mr-2 d-md-block d-none">
                      <BsChevronLeft fontSize="18px"></BsChevronLeft>
                    </div>
                    <div className="col-auto mr-2 d-md-none d-block">
                      <BsChevronUp fontSize="18px"></BsChevronUp>
                    </div>
                    <div className="col-auto">
                      {newQuestion.edit
                        ? "Save changes"
                        : "Add question to quiz"}
                    </div>
                  </div>
                </div>
              )}

              {newQuestion.edit && (
                <div
                  className="p-2 col-auto d-flex flex-center btn-pro"
                  onClick={() => {
                    let arr = [...quiz.questions];
                    arr.splice(newQuestion.questionIndex, 1);
                    setQuiz((prev) =>
                      Object.assign({}, prev, { questions: arr })
                    );
                    setNewQuestion(getInitialState());
                  }}
                >
                  <BsTrash fontSize="18px"></BsTrash>
                </div>
              )}
            </div>
            <div
              className="mx-2 mb-3 px-4 row no-gutters align-items-center bg-white border static-card"
              style={{ minHeight: "90px" }}
            >
              <TextareaAutosize
                spellCheck={false}
                value={newQuestion.question}
                onChange={(e) => {
                  e.persist();
                  if (e.target.value.length < 100) {
                    setNewQuestion((prev) =>
                      Object.assign({}, prev, { question: e.target.value })
                    );
                  }
                }}
                className="transparent-textarea text-dark w-100"
                style={{ resize: "none" }}
                placeholder="Enter the question"
              ></TextareaAutosize>
            </div>
            <div className="row no-gutters">
              {newQuestion.answers.map((x, i) => (
                <div
                  className="col-lg-6 col-md-12 col-sm-6 col-12 p-2 user-select-none"
                  key={uid(`${i}`)}
                >
                  <div
                    className={`row px-4 basic-card no-gutters justify-content-between align-items-center bg-answer-${
                      i + 1
                    }`}
                  >
                    <div className="col">
                      <div
                        className="row no-gutters align-items-center"
                        style={{ minHeight: "170px" }}
                      >
                        <TextareaAutosize
                          spellCheck={false}
                          value={x}
                          maxRows={8}
                          onChange={(e) => {
                            e.persist();
                            if (e.target.value.length < 80) {
                              let arr = [...newQuestion.answers];
                              arr[i] = e.target.value;
                              setNewQuestion((prev) =>
                                Object.assign({}, prev, { answers: arr })
                              );
                            }
                          }}
                          className="transparent-textarea w-100"
                          placeholder={`Answer ${i + 1}`}
                        ></TextareaAutosize>
                      </div>
                    </div>
                    <div className="col-auto">
                      <CheckBox
                        white={true}
                        size={45}
                        checked={newQuestion.correctAnswer === i}
                        setChecked={(checked) => {
                          setNewQuestion((prev) =>
                            Object.assign({}, prev, {
                              correctAnswer: checked ? i : -1,
                            })
                          );
                        }}
                      ></CheckBox>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapp)(CreateQuizForm);
