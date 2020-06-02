import React, { useEffect, useState } from "react";
import {
  GetBook,
  AddBookToFavorites,
  RemoveBookFromFavorites,
} from "../../api/socket-requests";
import history from "../../routing/history";
import { toast } from "react-toastify";
import Discussion from "./discussion/discussion";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import Summaries from "./summaries/Summaries";
import store from "../../store/store";

const Book = (props) => {
  const bookId = props.match.params.bookId;
  const user = useSelector((state) => state.user);
  const [tick, setTick] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [book, setBook] = useState({
    image: "",
    title: "",
    authors: "",
    description: "",
    threads: [],
    favoriteFor: [],
  });

  useEffect(() => {
    if (book.title !== "") {
      console.log("BOOK TITLE CHANGED", book.title);
      let breadCrumbs = store.getState().breadCrumbs;
      if (breadCrumbs[breadCrumbs.length - 1].path !== `/books/${book._id}`) {
        store.dispatch({
          type: "ADD_BREADCRUMB",
          breadCrumb: {
            title:
              `${book.title}`.substring(0, 25) +
              (book.title.length > 25 ? "..." : ""),
            path: `/books/${book._id}`,
            category: "books",
          },
        });
      }
    }
  }, [book.title]);

  useEffect(() => {
    let filter = { _id: bookId };
    GetBook(filter, (res) => {
      console.log("Book response", res);
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setBook(res.filteredBooks[0]);
      }
    });
  }, [tick, props]);

  return (
    <div className="row no-gutters py-3 px-2 px-md-4 px-sm-2 px-lg-5 bg-light justify-content-center mb-5">
      <div className="col-12 px-2 px-sm-3 px-md-4">
        <div className="row no-gutters">
          <div className="col-12 bg-white p-4 border">
            <div className="row no-gutters">
              <div className="col-auto pr-md-4 mb-3 mb-md-0 mx-auto">
                <img src={book.image} width="200" className="img-fluid" />
              </div>
              <div className="col-12 col-md">
                <div className="row no-gutters h1 mb-2 text-center text-md-left justify-content-center justify-content-md-start">
                  {book.title}
                </div>
                <div className="row no-gutters mb-4 h5 text-center text-md-left justify-content-center justify-content-md-start">
                  {book.authors}
                </div>
                <div className="row no-gutters disable-select">
                  <div className="d-flex">
                    <div className="mr-2">{book.favoriteFor.length}</div>
                    {book.favoriteFor.filter((x) => x._id === user._id).length >
                    0 ? (
                      <div className="d-flex">
                        <FaHeart
                          onClick={() => {
                            setBook((b) => {
                              let arr = [...b.favoriteFor];
                              arr.splice(
                                arr.findIndex((x) => x === user._id),
                                1
                              );
                              return Object.assign({}, b, { favoriteFor: arr });
                            });
                            RemoveBookFromFavorites(
                              bookId,
                              user._id,
                              (res) => {}
                            );
                          }}
                          fontSize="24px"
                          style={{
                            color: "#f88888",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                        ></FaHeart>
                        <div>This book is your favorite</div>
                      </div>
                    ) : (
                      <div className="d-flex">
                        <FaRegHeart
                          fontSize="24px"
                          style={{ marginRight: "10px", cursor: "pointer" }}
                          onClick={() => {
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
                          }}
                        ></FaRegHeart>
                        <div>Add to my favorites</div>
                      </div>
                    )}

                    <div className="ml-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="row no-gutters border-right border-top border-left bg-white mt-2 flex-nowrap text-wrap">
              <div
                onClick={() => setCurrentSection(0)}
                className={`col-4 col-sm-auto p-3 text-center text-sm-left d-flex align-items-center menu-item-border-bottom${
                  currentSection === 0 ? " menu-item-border-bottom-active" : ""
                }`}
              >
                About book
              </div>
              <div
                onClick={() => setCurrentSection(1)}
                className={`col-4 col-sm-auto p-3 d-flex text-center text-sm-left align-items-center menu-item-border-bottom${
                  currentSection === 1 ? " menu-item-border-bottom-active" : ""
                }`}
              >
                Discussion
              </div>
              <div
                onClick={() => setCurrentSection(2)}
                className={`col-4 col-sm-auto p-3 text-center text-sm-left text-wrap menu-item-border-bottom${
                  currentSection === 2 ? " menu-item-border-bottom-active" : ""
                }`}
              >
                Book summaries
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-12" style={{ minHeight: "500px" }}>
                {currentSection === 0 ? (
                  <div className="row no-gutters p-5 bg-white border">
                    <div className="col-12 h5">Description</div>
                    <div className="col-12">
                      {book.description
                        ? book.description
                        : "No description for this book"}
                    </div>
                  </div>
                ) : currentSection === 1 ? (
                  <Discussion
                    threads={book.threads}
                    bookId={bookId}
                  ></Discussion>
                ) : (
                  <Summaries bookId={bookId}></Summaries>
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
