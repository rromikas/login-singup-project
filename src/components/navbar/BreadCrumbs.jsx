import React, { useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { connect } from "react-redux";
import history from "../../routing/history";
import store from "../../store/store";
import { uid } from "react-uid";

const BreadCrumbs = ({ breadCrumbs }) => {
  useEffect(() => {
    window.onpopstate = () => {
      store.dispatch({
        type: "SELECT_BREADCRUMB",
        breadCrumbIndex: breadCrumbs.length > 1 ? breadCrumbs.length - 1 : 1,
      });
    };
  }, []);
  return (
    <div
      className="bg-white row no-gutters py-1 px-3 border-right border-left border-bottom"
      style={{ boxShadow: "-1px 1px 5px #dedede" }}
    >
      {breadCrumbs.map((x, i) => {
        return (
          <div className="d-flex align-items-center" key={uid(x)}>
            <BsChevronRight style={{ marginRight: "5px" }}></BsChevronRight>
            {x.category && (
              <div>
                {x.category}{" "}
                <BsChevronRight style={{ marginRight: "5px" }}></BsChevronRight>
              </div>
            )}
            <div
              className="mr-2 cursor-pointer breadcrumb-link text-truncate"
              style={{ maxWidth: "150px" }}
              onClick={() => {
                if (history.location.pathname !== x.path) {
                  store.dispatch({
                    type: "SELECT_BREADCRUMB",
                    breadCrumbIndex: i > 0 ? i + 1 : 1,
                  });
                  history.push(x.path);
                }
              }}
            >
              {x.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    breadCrumbs: state.breadCrumbs,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(BreadCrumbs);
