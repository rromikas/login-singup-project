import React, { useState, useEffect } from "react";
import OptionPanel from "../search/optionPanel";
import Results from "../search/results";
import {
  GetFilteredBooks,
  GetRecentlyAddedBooks,
} from "../../api/socket-requests";
import { toast } from "react-toastify";
import UserMenu from "../UserMenu";
import { GetUniqChoices } from "../utility/getUniqChoices";

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [results, setResults] = useState({ title: "", items: [] });
  const title = "Recently added";

  useEffect(() => {
    GetRecentlyAddedBooks((res) => {
      if (res.recentlyAddedBooks) {
        setResults({ items: res.recentlyAddedBooks, title: title });
        let choices = { genres: [], publishers: [], authors: [] };
        res.recentlyAddedBooks.forEach((x) => {
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
        setGenres(GetUniqChoices(choices.genres));
        setAuthors(GetUniqChoices(choices.authors));
        setPublishers(GetUniqChoices(choices.publishers));
      }
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

    if (
      filters.genres.length > 0 ||
      filters.authors.length > 0 ||
      filters.publishers.length > 0
    ) {
      Object.keys(filters).forEach((x) => {
        if (filters[x].length === 0) {
          filters[x].push({ title: { $regex: "", $options: "i" } });
        }
      });
      GetFilteredBooks(filters, (res) => {
        if (res.error) {
          toast.error(res.error.toString());
        } else {
          if (res.foundBooks) {
            setResults({
              items: res.foundBooks,
              title: title,
            });
          }
        }
      });
    } else {
      GetRecentlyAddedBooks((res) => {
        if (res.recentlyAddedBooks) {
          setResults({ items: res.recentlyAddedBooks, title: title });
        }
      });
    }
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
            className="col-lg-3 col-md-4 col-sm-5 p-4"
            style={{ background: "rgb(255, 140, 140)" }}
          >
            <UserMenu></UserMenu>
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
            <Results results={results}></Results>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
