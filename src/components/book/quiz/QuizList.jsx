import React, { useEffect, useState } from "react";
import { GetBookQuizzes } from "../../../api/socket-requests";
import history from "../../../routing/history";
import { BsClock, BsQuestionCircle } from "react-icons/bs";
import uniqid from "uniqid";

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

const QuizList = ({ bookId, groupId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    GetBookQuizzes(bookId, groupId, (res) => {
      if (!res.error) {
        setQuizzes(res.quizzes);
      }
      setLoading(false);
    });
  }, []);
  return (
    <div className="row no-gutters" style={{ opacity: loading ? 0.5 : 1 }}>
      <div className="col-12">
        <div className="row no-gutters p-4 border bg-white">
          <div
            className="col-auto fb-btn-pro"
            onClick={() => history.push(`/books/${bookId}/quiz/new`)}
          >
            Create quiz
          </div>
        </div>
        {quizzes.length ? (
          quizzes.map((x) => (
            <div
              className="row no-gutters bg-white border-left border-bottom border-right"
              key={uniqid("quiz-")}
            >
              <div className="col-sm col-12 col-lg-auto pt-4 pb-2 pb-sm-4">
                <div className="row no-gutters">
                  <div className="col-12 col-lg-auto px-lg-0 px-4 py-2 py-lg-4">
                    <div className="row no-gutters">
                      <div className="col-12 text-lg-center">
                        <label>Author</label>
                      </div>
                      <div className="col-auto col-lg-12 mb-lg-3 mr-2 mr-lg-0">
                        <div className="row no-gutters justify-content-start justify-content-lg-center">
                          <div
                            className="col-auto bg-image rounded-circle"
                            style={{
                              backgroundImage: `url(${x.create_user.photo})`,
                              width: "40px",
                              height: "40px",
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-auto">
                        <div className="row no-gutters align-items-center h-100 justify-content-start justify-content-lg-center">
                          {x.create_user.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-auto px-lg-0 px-4 py-2 py-lg-4">
                    <div className="row no-gutters justify-content-start justify-content-lg-center">
                      <div className="col-12 mr-lg-2 text-lg-center">
                        <label>Questions</label>
                      </div>
                      <BsQuestionCircle
                        className="col-auto mr-2 mb-lg-3 text-left text-lg-center"
                        fontSize="40px"
                      ></BsQuestionCircle>
                      <div className="col-auto col-lg-12 mr-lg-2">
                        <div className="row no-gutters h-100 align-items-center justify-content-start justify-content-lg-center">
                          {x.questions.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-auto px-lg-0 px-4 py-2 py-lg-4">
                    <div className="row no-gutters justify-content-start justify-content-lg-center">
                      <div className="col-12 text-lg-center">
                        <label>Time</label>
                      </div>
                      <BsClock
                        className="col-auto mb-lg-3 mr-2 mr-lg-0 text-left text-lg-center"
                        fontSize="40px"
                      ></BsClock>
                      <div className="col-auto col-lg-12">
                        <div className="row no-gutters h-100 align-items-center justify-content-start justify-content-lg-center">
                          {formatTime(x.time)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm col-lg px-lg-0 px-4 py-4">
                <div className="row no-gutters justify-content-center h-100 align-items-center">
                  <div
                    onClick={() =>
                      history.push(`/books/${bookId}/quiz/${x._id}`)
                    }
                    className="col-auto py-3 px-5 fb-btn-primary"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    <div className="row no-gutters px-4">Play</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="row no-gutters p-4 bg-white border">
            No quizzes so far
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
