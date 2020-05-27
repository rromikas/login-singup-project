import React, { useEffect, useState } from "react";
import { getBook, addBookToFavorites } from "../../javascript/requests";
import history from "../../routing/history";
import { toast } from "react-toastify";
import Discussion from "../discussion/discussion";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

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
  });

  useEffect(() => {
    let filter = { _id: bookId };
    getBook(filter, (res) => {
      console.log(res);
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setBook(res.data.filteredBooks[0]);
      }
    });
  }, [tick]);

  return (
    <div
      className="w-100 overflow-auto bg-theme p-lg-4 p-0"
      style={{ minHeight: "100%" }}
    >
      <div
        className="container-fluid bg-light shift corners-theme p-3 p-sm-4 p-md-5"
        style={{
          maxWidth: "1100px",
          overflow: "hidden",
        }}
      >
        <div className="row no-gutters px-4  pt-4 pb-5 bg-white border justify-content-center mb-5">
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
              {book.description
                ? book.description
                : "No description for this book"}
            </div>
            <div className="row no-gutters">
              <div className="d-flex">
                <div className="mr-2">{book.favorite}</div>
                <FaRegHeart
                  fontSize="24px"
                  onClick={() => {
                    if (user._id) {
                      addBookToFavorites(bookId, user._id, (res) => {
                        console.log(res);
                        if (!res.data.error) {
                          setTick(!tick);
                        } else {
                        }
                      });
                    } else {
                      history.push("/login", {
                        successPath: `/books/${bookId}`,
                      });
                    }
                  }}
                ></FaRegHeart>
                <div className="ml-2">Add to my favorites</div>
              </div>
            </div>
          </div>
        </div>

        <Discussion threads={book.threads} bookId={bookId}></Discussion>
      </div>
    </div>
  );
};

export default Book;
