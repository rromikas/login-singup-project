import React, { useState, useEffect } from "react";
import { renderEditor } from "../../utility/renderEditor";
import { GetBook, CreateThread } from "../../../api/socket-requests";
import { toast } from "react-toastify";
import history from "../../../routing/history";
import { connect } from "react-redux";
import store from "../../../store/store";

const NewThreadForm = (props) => {
  const bookId = props.match.params.bookId;
  const [book, setBook] = useState({ image: "", title: "", atuhors: "" });
  const user = props.user;
  const breadCrumbs = props.breadCrumbs;
  const [thread, setThread] = useState({
    description: "",
    title: "",
    userId: user._id,
    bookId: bookId,
  });
  useEffect(() => {
    let filter = { _id: bookId };
    GetBook(filter, (res) => {
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setBook(res.filteredBooks[0]);
        if (
          breadCrumbs[breadCrumbs.length - 1].path !==
          `/books/${bookId}/threads/new`
        ) {
          if (breadCrumbs[breadCrumbs.length - 1].path !== `/books/${bookId}`) {
            store.dispatch({
              type: "ADD_BREADCRUMB",
              breadCrumb: {
                title: res.filteredBooks[0].title,
                path: `/books/${bookId}`,
                category: "books",
              },
            });
          }
          store.dispatch({
            type: "ADD_BREADCRUMB",
            breadCrumb: {
              title: "new",
              path: `/books/${bookId}/threads/new`,
              category: "threads",
            },
          });
        }
      }
    });

    renderEditor(
      "question-editor",
      "Description",
      thread.description,
      (newDescription) => {
        setThread((prev) =>
          Object.assign({}, prev, { description: newDescription })
        );
      }
    );
  }, []);

  return (
    <div className="row no-gutters justify-content-center px-2 px-sm-3 px-md-4 px-lg-5 pt-3 pb-5">
      <div className="col-12 col-xl-9 col-lg-10 px-4">
        <div className="row no-gutters justify-content-between static-card p-4 bg-white mb-3">
          <div className="col-auto pb-5">
            <div className="row no-gutters" style={{ maxWidth: "436px" }}>
              <div className="h1 col-12">Write new post</div>
              <div className="col-12">
                Start a conversation, ask a question or share your idea.
              </div>
            </div>
          </div>
          <div className="col-12 pb-4">
            <div className="row no-gutters">
              <div className="col-auto pr-3 mb-3 mb-md-0">
                <img src={book.image} width="100" className="img-fluid" />
              </div>
              <div className="col">
                <div className="row no-gutters h5 book-title">{book.title}</div>
                <div className="row no-gutters">{book.authors}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="lead" style={{ fontWeight: "500" }}>
            Title
          </div>
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
            className="fb-btn-pro py-3 px-5 mt-3 mr-2"
            onClick={() => {
              CreateThread(thread, (res) => {
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
            className="fb-btn py-3 px-5 mt-3"
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

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    breadCrumbs: state.breadCrumbs,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(NewThreadForm);
