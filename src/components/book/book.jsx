import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  GetBook,
  AddBookToFavorites,
  RemoveBookFromFavorites,
  AddBookToGroup,
} from "../../api/socket-requests";
import history from "../../routing/history";
import { toast } from "react-toastify";
import Discussion from "./discussion/discussion";
import { BsHeart, BsHeartFill, BsPlus } from "react-icons/bs";
import { useSelector } from "react-redux";
import Summaries from "./summaries/Summaries";
import store from "../../store/store";
import QuizList from "./quiz/QuizList";

const AboutBook = (book) => {
  return (
    <div className="row no-gutters p-5 bg-white border">
      <div className="col-12 h5">Description</div>
      <div className="col-12">
        {book.description ? book.description : "No description for this book"}
      </div>
    </div>
  );
};

const Book = (props) => {
  const bookId = props.match.params.bookId;
  const user = useSelector((state) => state.user);
  const [tick, setTick] = useState(false);
  const [section, setSection] = useState({ prev: 0, current: 0 });
  const [book, setBook] = useState({
    image: "",
    title: "",
    authors: "",
    description: "",
    threads: [],
    favoriteFor: [],
    summaries: [],
  });

  const groupId = user.groupMember ? user.groupMember.group_id : null;

  useEffect(() => {
    if (book.title !== "") {
      let breadCrumbs = store.getState().breadCrumbs;
      if (breadCrumbs[breadCrumbs.length - 1].path !== `/books/${book._id}`) {
        store.dispatch({
          type: "ADD_BREADCRUMB",
          breadCrumb: {
            title: book.title,
            path: `/books/${book._id}`,
            category: "books",
          },
        });
      }
    }
  }, [book.title]);

  const containers = [
    "about-book-container",
    "discussion-container",
    "summaries-container",
    "quiz-container",
  ];

  useEffect(() => {
    if (section.current === 0) {
      ReactDOM.render(null, document.getElementById(containers[section.prev]));
      ReactDOM.render(
        <AboutBook book={book}></AboutBook>,
        document.getElementById(containers[0])
      );
    } else if (section.current === 1) {
      ReactDOM.render(null, document.getElementById(containers[section.prev]));
      ReactDOM.render(
        <Discussion bookId={bookId}></Discussion>,
        document.getElementById(containers[1])
      );
    } else if (section.current === 2) {
      ReactDOM.render(null, document.getElementById(containers[section.prev]));
      ReactDOM.render(
        <Summaries bookId={bookId}></Summaries>,
        document.getElementById(containers[2])
      );
    } else if (section.current === 3) {
      ReactDOM.render(null, document.getElementById(containers[section.prev]));
      ReactDOM.render(
        <QuizList bookId={bookId} groupId={groupId}></QuizList>,
        document.getElementById(containers[3])
      );
    }
  }, [section]);

  useEffect(() => {
    let filter = { _id: bookId };
    GetBook(filter, (res) => {
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        res.filteredBooks[0].summaries.sort((a, b) =>
          a.rating < b.rating ? 1 : a.rating > b.rating ? -1 : 0
        );
        res.filteredBooks[0].threads.reverse();
        setBook(res.filteredBooks[0]);
      }
    });
  }, [tick, props]);

  return (
    <div className="row no-gutters py-3 px-2 px-md-4 px-sm-2 px-lg-5 bg-light justify-content-center mb-5">
      <div
        className="col-12 col-xl-9 col-lg-10 px-2 px-sm-3 px-md-4"
        style={{ minHeight: "800px" }}
      >
        <div className="row no-gutters">
          <div className="col-12 bg-white p-4 static-card">
            <div className="row no-gutters">
              <div className="col-auto pr-md-4 mb-3 mb-md-0 mx-auto">
                <img src={book.image} width="200" className="img-fluid" />
              </div>
              <div className="col-12 col-md">
                <div className="row no-gutters h4 mb-2 text-center text-md-left justify-content-center justify-content-md-start book-title">
                  {book.title}
                </div>
                <div className="row no-gutters mb-4 lead text-center text-md-left justify-content-center justify-content-md-start">
                  {book.authors}
                </div>
                <div className="row no-gutters justify-content-center justify-content-sm-start disable-select mb-2">
                  <div
                    className="col-auto fb-btn-pro"
                    onClick={() => {
                      if (
                        book.favoriteFor.filter((x) => x._id === user._id)
                          .length > 0
                      ) {
                        setBook((b) => {
                          let arr = [...b.favoriteFor];
                          arr.splice(
                            arr.findIndex((x) => x === user._id),
                            1
                          );
                          return Object.assign({}, b, {
                            favoriteFor: arr,
                          });
                        });
                        RemoveBookFromFavorites(bookId, user._id, (res) => {});
                      } else {
                        if (user._id) {
                          setBook((b) => {
                            let arr = [...b.favoriteFor];
                            return Object.assign({}, b, {
                              favoriteFor: [
                                ...b.favoriteFor,
                                { _id: user._id },
                              ],
                            });
                          });
                          AddBookToFavorites(bookId, user._id, (res) => {});
                        } else {
                          history.push("/login", {
                            successPath: `/books/${bookId}`,
                          });
                        }
                      }
                    }}
                  >
                    <div className="row no-gutters align-items-center">
                      {book.favoriteFor.filter((x) => x._id === user._id)
                        .length > 0 ? (
                        <div className="d-flex align-items-center">
                          <BsHeartFill
                            fontSize="24px"
                            style={{
                              color: "#f88888",
                              marginRight: "10px",
                              cursor: "pointer",
                            }}
                          ></BsHeartFill>
                          <div className="mx-2 px-2">
                            {book.favoriteFor.length}
                          </div>
                          <div className="d-none d-md-block">
                            It's your favorite
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <BsHeart
                            fontSize="24px"
                            style={{ marginRight: "10px", cursor: "pointer" }}
                          ></BsHeart>
                          <div className="mx-2 px-2">
                            {book.favoriteFor.length}
                          </div>
                          <div className="d-none d-md-block">
                            Add to my favorites
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {groupId && (
                  <div className="row no-gutters justify-content-center justify-content-sm-start disable-select">
                    <div
                      className="col-auto fb-btn-pro"
                      onClick={() => {
                        AddBookToGroup(groupId, bookId, (res) => {
                          if (!res.error) {
                            store.dispatch({
                              type: "SET_NOTIFICATION",
                              notification: {
                                title: "Confirm",
                                message: "Book added to your group",
                                type: "success",
                              },
                            });
                          } else {
                            store.dispatch({
                              type: "SET_NOTIFICATION",
                              notification: {
                                title: "Can not add book",
                                message: res.error,
                                type: "failure",
                              },
                            });
                          }
                        });
                      }}
                    >
                      <div className="row no-gutters align-items-center">
                        <BsPlus fontSize="24px" className="mr-2"></BsPlus>
                        <div>Add to group</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 static-card mt-2 overflow-hidden">
            <div className="row no-gutters bg-white text-wrap">
              <div
                onClick={() =>
                  setSection((prev) =>
                    Object.assign({}, prev, {
                      prev: section.current,
                      current: 0,
                    })
                  )
                }
                className={`d-none d-md-block col-md-3 col-12 p-3 text-center menu-item-border-bottom${
                  section.current === 0 ? " menu-item-border-bottom-active" : ""
                }`}
              >
                About book
              </div>
              <div
                onClick={() =>
                  setSection((prev) =>
                    Object.assign({}, prev, {
                      prev: section.current,
                      current: 0,
                    })
                  )
                }
                className={`d-block d-md-none md-3 col-12 p-3 text-center fb-btn`}
              >
                About book
              </div>
              <div
                className="col-12 d-block d-md-none"
                id="about-book-container"
              ></div>
              <div
                onClick={() =>
                  setSection((prev) =>
                    Object.assign({}, prev, {
                      prev: section.current,
                      current: 1,
                    })
                  )
                }
                className={`col-md-3 d-none d-md-block col-12 p-3 text-center menu-item-border-bottom${
                  section.current === 1 ? " menu-item-border-bottom-active" : ""
                }`}
              >
                Discussion
              </div>
              <div
                onClick={() =>
                  setSection((prev) =>
                    Object.assign({}, prev, {
                      prev: section.current,
                      current: 1,
                    })
                  )
                }
                className={`col-md-3 col-12 p-3 text-center fb-btn d-block d-md-none`}
              >
                Discussion
              </div>
              <div
                className="col-12 d-block d-md-none"
                id="discussion-container"
              ></div>
              <div
                onClick={() =>
                  setSection((prev) =>
                    Object.assign({}, prev, {
                      prev: section.current,
                      current: 2,
                    })
                  )
                }
                className={`d-none d-md-block col-md-3 col-12 p-3 text-center text-wrap menu-item-border-bottom${
                  section.current === 2 ? " menu-item-border-bottom-active" : ""
                }`}
              >
                Book summaries
              </div>
              <div
                onClick={() =>
                  setSection((prev) =>
                    Object.assign({}, prev, {
                      prev: section.current,
                      current: 2,
                    })
                  )
                }
                className={`d-block d-md-none col-md-3 col-12 p-3 text-center text-wrap fb-btn`}
              >
                Book summaries
              </div>
              <div
                className="col-12 d-block d-md-none"
                id="summaries-container"
              ></div>
              <div
                onClick={() =>
                  setSection((prev) =>
                    Object.assign({}, prev, {
                      prev: section.current,
                      current: 3,
                    })
                  )
                }
                className={`d-none d-md-block col-md-3 col-12 p-3 text-center text-wrap menu-item-border-bottom${
                  section.current === 3 ? " menu-item-border-bottom-active" : ""
                }`}
              >
                Quiz
              </div>
              <div
                onClick={() =>
                  setSection((prev) =>
                    Object.assign({}, prev, {
                      prev: section.current,
                      current: 3,
                    })
                  )
                }
                className={`d-block d-md-none fb-btn col-md-3 col-12 p-3 text-center text-wrap`}
              >
                Quiz
              </div>
              <div
                className="col-12 d-block d-md-none"
                id="quiz-container"
              ></div>
            </div>
            <div className="row no-gutters">
              <div className="col-12 d-none d-md-block">
                {section.current === 0 ? (
                  <AboutBook book={book}></AboutBook>
                ) : section.current === 1 ? (
                  <Discussion bookId={bookId}></Discussion>
                ) : section.current === 2 ? (
                  <Summaries bookId={bookId}></Summaries>
                ) : (
                  <QuizList bookId={bookId} groupId={groupId}></QuizList>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
