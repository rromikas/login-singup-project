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
    <div className="row no-gutters p-4 bg-light border justify-content-center mb-5">
      <div className="col-auto pr-md-5 mb-3 mb-md-0">
        <img src={book.image} width="200" className="img-fluid" />
      </div>
      <div className="col-12 col-md">
        <div className="row no-gutters h1 mb-2 text-center text-md-left justify-content-center justify-content-md-start">
          {book.title}
        </div>
        <div className="row no-gutters mb-5 h5 text-center text-md-left justify-content-center justify-content-md-start">
          {book.authors}
        </div>

        <div className="row no-gutters h5">Description</div>
        <div className="row no-gutters mb-5">
          {book.description ? book.description : "No description for this book"}
        </div>
        <div className="row no-gutters disable-select">
          <div className="d-flex">
            <div className="mr-2">{book.favoriteFor.length}</div>
            {book.favoriteFor.filter((x) => x._id === user._id).length > 0 ? (
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
                    RemoveBookFromFavorites(bookId, user._id, (res) => {});
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
                          favoriteFor: [...b.favoriteFor, { _id: user._id }],
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
      <div className="col-12">
        <Summaries bookId={bookId}></Summaries>
        <Discussion threads={book.threads} bookId={bookId}></Discussion>
      </div>
    </div>
  );
};

export default Book;
