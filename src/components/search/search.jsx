import React, { useState, useEffect } from "react";
import OptionPanel from "./optionPanel";
import Results from "./results";
import { getAllBooks, search, filter } from "../../javascript/requests";
import { toast } from "react-toastify";

const Search = () => {
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [searchResults, setSearchResults] = useState({ title: "", items: [] });

  useEffect(() => {
    getAllBooks((res) => {
      setSearchResults({ items: res.allBooks, title: "AllBooks" });
      let choices = { genres: [], publishers: [], authors: [] };
      res.allBooks.forEach((x) => {
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
      setGenres(choices.genres);
      setAuthors(choices.authors);
      setPublishers(choices.publishers);
    });
  }, []);

  useEffect(() => {
    let filters = {
      genres: [
        ...genres
          .filter((x) => x.checked)
          .map((x) => {
            return { genre: x.name };
          }),
      ],
      authors: [
        ...authors
          .filter((x) => x.checked)
          .map((x) => {
            return { authors: x.name };
          }),
      ],
      publishers: [
        ...publishers
          .filter((x) => x.checked)
          .map((x) => {
            return { publisher: x.name };
          }),
      ],
    };
    Object.keys(filters).forEach((x) => {
      if (filters[x].length === 0) {
        filters[x].push({ title: { $regex: "", $options: "i" } });
      }
    });

    filter(filters, (res) => {
      if (res.data.error) {
        toast.error(res.data.error.toString());
      } else {
        setSearchResults({
          items: res.data.foundBooks,
          title: `Search results`,
        });
      }
    });
  }, [genres, authors, publishers]);

  return (
    <div
      className="w-100 overflow-auto bg-theme p-lg-4 p-0"
      style={{ minHeight: "100%" }}
    >
      <div
        className="container-fluid px-0 bg-light corners-theme"
        style={{
          maxWidth: "1200px",
          overflow: "hidden",
        }}
      >
        <div className="row no-gutters">
          <div
            className="col-lg-3 col-md-4 col-sm-5 d-none d-sm-block p-4"
            style={{ background: "rgb(255, 140, 140)" }}
          >
            <div className="row no-gutters p-3 convex mb-4 bg-light border rounded-8 justify-content-between">
              <div className="col-auto pl-2">Login</div>
              <div className="col-auto pl-2">Search</div>
              <div className="col-auto px-2">Add Book</div>
            </div>
            <div className="row no-gutters">
              <OptionPanel
                title="Genres"
                itemName="genre"
                choices={genres}
                setChoices={setGenres}
              ></OptionPanel>
              <OptionPanel
                title="Authors"
                itemName="author"
                choices={authors}
                setChoices={setAuthors}
              ></OptionPanel>
              <OptionPanel
                title="Publishers"
                itemName="publisher"
                choices={publishers}
                setChoices={setPublishers}
              ></OptionPanel>
            </div>
          </div>
          <div className="col-md-8 col-lg-9 col-sm-7 px-md-4 px-sm-3 px-2 py-4">
            <div className="row no-gutters mb-3 px-1">
              <div className="col pr-3">
                <input
                  value={query}
                  onKeyDown={(e) => {
                    e.persist();
                    if (e.keyCode === 13) {
                      search(query, (res) => {
                        if (res.data.error) {
                          toast.error(res.data.error.toString());
                        } else {
                          setSearchResults({
                            items: res.data.foundBooks,
                            title: `Search results for "${query}"`,
                          });
                        }
                      });
                    }
                  }}
                  onChange={(e) => {
                    e.persist();
                    setQuery(e.target.value);
                  }}
                  className="w-100 square-input px-4 shn"
                  spellCheck={false}
                  style={{ border: "2px solid rgb(255, 140, 140)" }}
                  placeholder="Search by the title, isbn, author, genre . . ."
                ></input>
              </div>
              <div className="col-auto">
                <div
                  className="shift my-btn soft-btn px-md-5 px-4"
                  style={{ background: "rgb(255, 140, 140)" }}
                  onClick={() => {
                    search(query, (res) => {
                      if (res.data.error) {
                        toast.error(res.data.error.toString());
                      } else {
                        setSearchResults({
                          items: res.data.foundBooks,
                          title: `Search results for "${query}"`,
                        });
                      }
                    });
                  }}
                >
                  Search
                </div>
              </div>
            </div>
            <Results results={searchResults}></Results>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
