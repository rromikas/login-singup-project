import React, { useState, useEffect } from "react";
import OptionPanel from "../search/optionPanel";
import Results from "../search/results";
import {
  GetFilteredBooks,
  GetRecentlyAddedBooks,
  connect,
} from "../../api/socket-requests";
import { toast } from "react-toastify";
import UserMenu from "../UserMenu";
import { GetUniqChoices } from "../utility/getUniqChoices";
import store from "../../store/store";

const Home = () => {
  const [filters, setFilters] = useState({
    genres: [],
    authors: [],
    publishers: [],
  });
  const [results, setResults] = useState({ title: "", items: [] });
  const title = "Recently added";

  useEffect(() => {
    console.log("GET RECENTLY BOOK USE EFFECT");
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
        choices.genres = GetUniqChoices(choices.genres);
        choices.authors = GetUniqChoices(choices.authors);
        choices.publishers = GetUniqChoices(choices.publishers);
        setFilters(choices);
      }
    });
  }, []);

  useEffect(() => {
    console.log("FILTERS use effect", filters);
    let newFilters = {
      genres: [
        ...filters.genres
          .filter((x) => x.checked)
          .map((x) => {
            return { genre: x.name };
          }),
      ],
      authors: [
        ...filters.authors
          .filter((x) => x.checked)
          .map((x) => {
            return { authors: x.name };
          }),
      ],
      publishers: [
        ...filters.publishers
          .filter((x) => x.checked)
          .map((x) => {
            return { publisher: x.name };
          }),
      ],
    };

    if (
      newFilters.genres.length > 0 ||
      newFilters.authors.length > 0 ||
      newFilters.publishers.length > 0
    ) {
      Object.keys(newFilters).forEach((x) => {
        if (newFilters[x].length === 0) {
          newFilters[x].push({ title: { $regex: "", $options: "i" } });
        }
      });
      GetFilteredBooks(newFilters, (res) => {
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
      console.log("GOT RECENTLY BOOKS 22222222222");
      GetRecentlyAddedBooks((res) => {
        if (res.recentlyAddedBooks) {
          setResults({ items: res.recentlyAddedBooks, title: title });
        }
      });
    }
  }, [filters]);

  return (
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
                console.log(arr[i].checked);
                arr[i].checked = checked;
                return Object.assign({}, f, { publishers: arr });
              })
            }
          ></OptionPanel>
        </div>
      </div>
      <div className="col-md-8 col-lg-9 col-sm-7 px-md-4 px-sm-3 px-2 py-4">
        <Results results={results}></Results>
      </div>
    </div>
  );
};

export default Home;
