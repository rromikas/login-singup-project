import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
  DatePicker,
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { debounce } from "throttle-debounce";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Paper } from "@material-ui/core";
import { getBooks } from "../../api/requests";
import DateFnsUtils from "@date-io/date-fns";
import { AddBook, GetBooks } from "../../api/socket-requests";

export default (props) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [books, setBooks] = useState([]);
  const [load, setLoading] = useState(false);
  const {
    values: {
      title,
      publishedDate,
      subtitle,
      description,
      authors,
      genre,
      language,
      isbn10,
      isbn13,
      publisher,
      image,
    },
    errors,
    setFieldValue,
    touched,
    setValues,
    handleChange,
    isValid,
    setFieldTouched,
  } = props;
  console.log(isValid, errors, publishedDate);

  const [selectedDate, handleDateChange] = useState(null);
  useEffect(() => {
    if (!search.trim()) setBooks([]);
    else {
      debounce(300, () => {
        setLoading(true);
        GetBooks(search, (res) => {
          if (res.error) {
            setBooks([]);
            setLoading(false);
          } else if (res.found) {
            setBooks(res.books, res.books);
          } else setBooks([]);
          setLoading(false);
        });
      })();
    }
  }, [search]);

  useEffect(() => {
    selected
      ? setValues(
          {
            title: selected?.volumeInfo?.title,
            subtitle: selected?.volumeInfo?.subtitle,
            description: selected?.volumeInfo?.description,
            authors: Array.isArray(selected?.volumeInfo?.authors)
              ? selected?.volumeInfo?.authors.join(", ")
              : "",
            isbn10: selected?.volumeInfo?.industryIdentifiers?.filter(
              ({ type }) => type === "ISBN_10"
            )[0]?.identifier,
            isbn13: selected?.volumeInfo?.industryIdentifiers?.filter(
              ({ type }) => type === "ISBN_13"
            )[0]?.identifier,
            publishedDate: selected?.volumeInfo?.publishedDate,
            publisher: selected?.volumeInfo?.publisher,
            language: selected?.volumeInfo?.language,
            image: selected?.volumeInfo?.imageLinks?.thumbnail,
            genre: Array.isArray(selected?.volumeInfo?.categories)
              ? selected?.volumeInfo?.categories.join(", ")
              : "",
          },
          true
        ) &&
        setFieldValue("publishedDate", selected?.volumeInfo?.publishedDate) &&
        new Date(selected?.volumeInfo?.publishedDate)
      : setValues({});
  }, [selected, setValues, books, setFieldValue]);
  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };
  return (
    <div>
      <div>
        <Autocomplete
          loading={load}
          options={books}
          disableClearable
          getOptionLabel={(option) => {
            return option?.volumeInfo?.title || search;
          }}
          onChange={(event, newValue) => {
            console.log(newValue);
            // Create a new value from the user input
            if (newValue && newValue.inputValue) {
              setSelected(newValue.inputValue);

              return;
            }

            setSelected(newValue);
          }}
          filterOptions={(option) => option}
          renderOption={(option) => (
            <React.Fragment key={option?.id || "8"}>
              <img
                width="80"
                height="100"
                src={option?.volumeInfo?.imageLinks?.thumbnail}
                alt={option?.volumeInfo?.title}
                style={{ paddingRight: "1em" }}
              />
              {option?.volumeInfo?.title}
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              multiline
              name="search"
              label="Search by title or ISBN"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {console.log(params)}
                    {load ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </div>
      <Paper elevation={3} style={{ padding: "1em", margin: "1em 0em" }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            AddBook(props.values, (response) => {
              if (response.success) {
                props.history.push("/");
              }
              // alert("submitted");
            });
          }}
        >
          <TextField
            multiline
            id="title"
            name="title"
            required
            helperText={touched.title ? errors.title : ""}
            error={touched.title && Boolean(errors.title)}
            disabled={selected}
            label="Title"
            fullWidth
            value={title}
            onChange={change.bind(null, "title")}
          />

          <TextField
            id="subtitle"
            multiline
            name="subtitle"
            helperText={touched.subtitle ? errors.subtitle : ""}
            error={touched.subtitle && Boolean(errors.subtitle)}
            label="Subtitle"
            fullWidth
            disabled={selected}
            value={subtitle}
            onChange={change.bind(null, "subtitle")}
          />
          <TextField
            multiline
            id="description"
            required
            name="description"
            helperText={touched.description ? errors.description : ""}
            error={touched.description && Boolean(errors.description)}
            label="Description"
            fullWidth
            value={description}
            disabled={selected}
            onChange={change.bind(null, "description")}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              disabled={selected}
              fullWidth
              clearable
              required
              label="Published Date"
              helperText={touched.publishedDate ? errors.publishedDate : ""}
              error={touched.publishedDate && Boolean(errors.publishedDate)}
              name="publishedDate"
              value={selectedDate}
              placeholder="10/10/2018"
              onChange={(date) => {
                console.log(date);
                handleDateChange(date);
                setFieldValue("publishedDate", date);
              }}
              maxDate={new Date()}
              format="MM/dd/yyyy"
            />
          </MuiPickersUtilsProvider>

          <TextField
            id="authors"
            name="authors"
            helperText={touched.authors ? errors.authors : ""}
            error={touched.authors && Boolean(errors.authors)}
            label="Authors"
            fullWidth
            disabled={selected}
            value={authors}
            onChange={change.bind(null, "authors")}
          />
          <TextField
            id="genre"
            name="genre"
            helperText={touched.genre ? errors.genre : ""}
            error={touched.genre && Boolean(errors.genre)}
            label="Genre"
            fullWidth
            disabled={selected}
            value={genre}
            onChange={change.bind(null, "genre")}
          />

          <TextField
            id="image"
            name="image"
            helperText={touched.image ? errors.image : ""}
            error={touched.image && Boolean(errors.image)}
            label="Image URL"
            fullWidth
            required
            disabled={selected}
            value={image}
            onChange={change.bind(null, "image")}
          />

          <TextField
            id="publisher"
            name="publisher"
            helperText={touched.publisher ? errors.publisher : ""}
            error={touched.publisher && Boolean(errors.publisher)}
            label="Publisher"
            required
            fullWidth
            disabled={selected}
            value={publisher}
            onChange={change.bind(null, "publisher")}
          />
          <TextField
            id="isbn10"
            name="isbn10"
            helperText={touched.isbn10 ? errors.isbn10 : ""}
            error={touched.isbn10 && Boolean(errors.isbn10)}
            label="ISBN(10)"
            fullWidth
            disabled={selected}
            required
            value={isbn10}
            onChange={change.bind(null, "isbn10")}
          />
          <TextField
            id="isbn13"
            name="isbn13"
            helperText={touched.isbn13 ? errors.isbn13 : ""}
            error={touched.isbn13 && Boolean(errors.isbn13)}
            label="ISBN(13)"
            fullWidth
            required
            disabled={selected}
            value={isbn13}
            onChange={change.bind(null, "isbn13")}
          />
          <TextField
            id="language"
            name="language"
            helperText={touched.language ? errors.language : ""}
            error={touched.language && Boolean(errors.language)}
            label="Language"
            fullWidth
            disabled={selected}
            required
            value={language}
            onChange={change.bind(null, "language")}
          />

          <Button
            type="submit"
            fullWidth
            variant="raised"
            color="primary"
            disabled={!selected && !isValid}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </div>
  );
};
