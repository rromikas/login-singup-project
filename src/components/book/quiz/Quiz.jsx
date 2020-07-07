import React, { useEffect, useState } from "react";
import { GetQuiz } from "../../../api/socket-requests";
import { BsClock, BsQuestionCircle, BsFillPlayFill } from "react-icons/bs";
import Game from "./Game";
import { connect } from "react-redux";

function formatTime(sec_num) {
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

const Quiz = (props) => {
  const bookId = props.match.params.bookId;
  const quizId = props.match.params.quizId;
  const groupId = props.user.groupMember.group_id
    ? props.user.groupMember.group_id
    : 0;
  console.log("PRPS USER", props.user);
  const [isPlaying, setIsPlaying] = useState(false);

  const [quiz, setQuiz] = useState({
    time: 0,
    questions: [],
    create_user: { photo: "", name: "" },
    book_id: { title: "", image: "", authors: "" },
    crete_user: { name: "", photo: "" },
  });

  useEffect(() => {
    GetQuiz(quizId, (res) => {
      console.log("Response after getting quiz", res);
      if (res.quiz) {
        setQuiz(res.quiz);
      }
    });
  }, []);
  console.log("Quiz (bookid, quizid)", bookId, quizId);

  return (
    <div className="row no-gutters p-4 justify-content-center">
      {isPlaying && (
        <Game
          bookId={bookId}
          groupId={groupId}
          userId={props.user._id}
          quiz={quiz}
          refresher={isPlaying}
          onGoHome={() => setIsPlaying(false)}
          getQuizAgain={() => JSON.parse(JSON.stringify(quiz))}
        ></Game>
      )}
      <div className="col-lg-10 static-card bg-white p-4">
        <div className="row no-gutters">
          <div className="col-12 mb-4">
            <div className="row no-gutters align-items-center">
              <div className="col-auto mr-5 h2">Quiz</div>
              <BsClock fontSize="40px" className="mr-2 col-auto"></BsClock>
              <div
                className="col-auto mr-4"
                style={{ fontSize: "24px", weight: 600 }}
              >
                {formatTime(quiz.time)}
              </div>
              <BsQuestionCircle
                fontSize="40px"
                className="col-auto mr-2"
              ></BsQuestionCircle>
              <div
                className="col-auto mr-4"
                style={{ fontSize: "24px", weight: 600 }}
              >
                {quiz.questions.length}
              </div>
              <div className="col-auto quiz-play-btn user-select-none">
                <div
                  className="row no-gutters align-items-center px-4 h-100"
                  onClick={() => setIsPlaying(true)}
                >
                  <div className="col-auto mr-2">Play</div>
                  <BsFillPlayFill
                    fontSize="40px"
                    className="col-auto"
                  ></BsFillPlayFill>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row no-gutters justify-content-between">
              <div className="col-auto">
                <div className="row no-gutters mb-4">
                  <div className="col-12">
                    <div className="label-strong">Quiz author</div>
                  </div>
                  <div className="col-auto mr-2">
                    <div
                      className="bg-image"
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        backgroundImage: `url(${quiz.create_user.photo})`,
                      }}
                    ></div>
                  </div>
                  <div className="col">
                    <div className="row no-gutters h-100 align-items-center">
                      {quiz.create_user.name}
                    </div>
                  </div>
                </div>
                <div className="row no-gutters">
                  <div className="col-12">
                    <div className="label-strong">Quiz is about</div>
                  </div>
                  <div className="col-auto mr-2">
                    <img width="120" src={quiz.book_id.image}></img>
                  </div>
                  <div className="col">
                    <div className="row no-gutters">{quiz.book_id.title}</div>
                    <div className="row no-gutters">{quiz.book_id.authors}</div>
                  </div>
                </div>
              </div>
              <div className="col-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12"></div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapp)(Quiz);
