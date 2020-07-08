import React, { useState, useEffect } from "react";
import OptionPanel from "./optionPanel";
import Results from "./results";
import { toast } from "react-toastify";
import history from "../../routing/history";
import { SearchBooks } from "../../api/socket-requests";
import { connect } from "react-redux";
import { GetUniqChoices } from "../utility/getUniqChoices";
import store from "../../store/store";

const Search = ({ query, ...rest }) => {
  const [filters, setFilters] = useState({
    genres: [],
    authors: [],
    publishers: [],
  });
  const [searchResults, setSearchResults] = useState({ title: "", items: [] });
  const [filteredResults, setFilteredResults] = useState({
    title: "",
    items: [],
  });

  useEffect(() => {
    let query = rest.match.params
      ? rest.match.params.query
        ? rest.match.params.query
        : ""
      : "";
    let bc = store.getState().breadCrumbs;
    if (bc[bc.length - 1].path !== `/search/${query}`) {
      store.dispatch({
        type: "ADD_BREADCRUMB",
        breadCrumb: { title: `search ${query}`, path: `/search/${query}` },
      });
    }

    SearchBooks(query, (res) => {
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setSearchResults({
          items: res.foundBooks,
          title: `Search results for "${query}"`,
        });
        let choices = { genres: [], publishers: [], authors: [] };
        res.foundBooks.forEach((x) => {
          if (x.genre?.length > 0) {
            choices.genres.push({ name: x.genre, checked: false });
          }
          if (x.authors?.length > 0) {
            choices.authors.push({ name: x.authors, checked: false });
          }
          if (x.publisher?.length > 0) {
            choices.publishers.push({ name: x.publisher, checked: false });
          }
        });
        choices.genres = GetUniqChoices(choices.genres);
        choices.authors = GetUniqChoices(choices.authors);
        choices.publishers = GetUniqChoices(choices.publishers);
        setFilters(choices);
      }
    });
  }, [rest.match.params]);

  useEffect(() => {
    let arr = [];
    searchResults.items.forEach((x) => {
      let checkedGenres = filters.genres
        .filter((g) => g.checked)
        .map((g) => g.name);
      let checkedAuthors = filters.authors
        .filter((a) => a.checked)
        .map((a) => a.name);
      let checkedPublishers = filters.publishers
        .filter((p) => p.checked)
        .map((p) => p.name);
      if (
        (checkedGenres.includes(x.genre) || checkedGenres.length === 0) &&
        (checkedAuthors.includes(x.authors) || checkedAuthors.length === 0) &&
        (checkedPublishers.includes(x.publisher) ||
          checkedPublishers.length === 0)
      ) {
        arr.push(x);
      }
    });
    setFilteredResults((s) =>
      Object.assign({}, s, { items: arr, title: "Search results" })
    );
  }, [filters, searchResults]);

  return (
    <div className="row no-gutters">
      <div className="col-lg-3 col-md-4 col-sm-5 p-4 d-md-block d-none">
        <div className="row no-gutters">
          <OptionPanel
            title="Genres"
            itemName="genre"
            choices={filters.genres}
            setChoices={(checked, i) =>
              setFilters((f) => {
                let arr = [...f.genres];
                arr[i].checked = checked;
                return Object.assign({}, f, { genres: arr });
              })
            }
          ></OptionPanel>
          <OptionPanel
            title="Authors"
            itemName="author"
            choices={filters.authors}
            setChoices={(checked, i) =>
              setFilters((f) => {
                let arr = [...f.authors];
                arr[i].checked = checked;
                return Object.assign({}, f, { authors: arr });
              })
            }
          ></OptionPanel>
          <OptionPanel
            title="Publishers"
            itemName="publisher"
            choices={filters.publishers}
            setChoices={(checked, i) =>
              setFilters((f) => {
                let arr = [...f.publishers];
                arr[i].checked = checked;
                return Object.assign({}, f, { publishers: arr });
              })
            }
          ></OptionPanel>
        </div>
      </div>
      <div className="col-md-8 col-lg-9 px-sm-3 px-2 py-4 bg-light">
        <Results results={filteredResults}></Results>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    query: state.query,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(Search);
