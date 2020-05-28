import React, { useState, useEffect, useReducer } from "react";
import { renderEditor } from "./renderEditor";
import { GetBook, CreateThread } from "../../api/socket-requests";
import { toast } from "react-toastify";
import history from "../../routing/history";
import { Editor, EditorState } from "draft-js";
import { useSelector } from "react-redux";

const NewThreadForm = (props) => {
  const bookId = props.match.params.bookId;
  const [book, setBook] = useState({ image: "", title: "", atuhors: "" });
  const user = useSelector((state) => state.user);
  const [thread, setThread] = useState({
    description: "",
    title: "",
    userId: user._id,
    bookId: bookId,
  });
  useEffect(() => {
    let filter = { _id: bookId };
    GetBook(filter, (res) => {
      console.log(res);
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setBook(res.filteredBooks[0]);
      }
    });

    renderEditor(
      "question-editor",
      "Description",
      thread.description,
      (newDescription) => {
        console.log(newDescription);
        setThread((prev) =>
          Object.assign({}, prev, { description: newDescription })
        );
      }
    );
  }, []);

  return (
    <div
      className="w-100 overflow-auto bg-theme p-lg-4 p-0"
      style={{ minHeight: "100%" }}
    >
      <div
        className="container-fluid bg-light p-3 p-sm-4 p-md-5 shift corners-theme"
        style={{
          maxWidth: "1000px",
          overflow: "hidden",
        }}
      >
        <div className="row no-gutters justify-content-between border p-4 bg-white mb-3">
          <div className="col-auto pb-5">
            <div className="row no-gutters" style={{ maxWidth: "436px" }}>
              <div className="h1 col-12">Write new post</div>
              <div className="col-12">
                Start a conversation, ask a question or share your idea.
              </div>
            </div>
          </div>
          <div className="col-auto pb-4">
            <div className="row no-gutters" style={{ maxWidth: "350px" }}>
              <div className="col-auto pr-3 mb-3 mb-md-0">
                <img src={book.image} width="100" className="img-fluid" />
              </div>
              <div className="col">
                <div className="row no-gutters h4">{book.title}</div>
                <div className="row no-gutters">{book.authors}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="title" className="lead" style={{ fontWeight: "500" }}>
            Title
          </label>
          <input
            value={thread.title}
            onChange={(e) => {
              e.persist();
              setThread((prev) =>
                Object.assign({}, prev, { title: e.target.value })
              );
            }}
            type="text"
            className="form-control"
            style={{ borderRadius: "8px" }}
            id="title"
          />
        </div>
        <div className="row no-gutters" id="question-editor"></div>
        <div className="row no-gutters">
          <div
            className="btn btn-primary bg-theme-simple py-3 px-5 mt-3 mr-2"
            onClick={() => {
              console.log("VEIKIA", thread);
              CreateThread(thread, (res) => {
                console.log("REPSONSE AFTER THREAD CRETING", res);
                if (res.error) {
                  toast.error(res.error.toString());
                } else {
                  history.push(`/books/${bookId}`);
                }
              });
            }}
          >
            Publish
          </div>
          <div
            className="btn btn-outline-secondary py-3 px-5 mt-3"
            onClick={() => {
              history.push(`/books/${bookId}`);
            }}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewThreadForm;
