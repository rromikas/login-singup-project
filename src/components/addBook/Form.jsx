import React, { useEffect } from "react";
import { Formik } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import Container from "@material-ui/core/Container";
import InputForm from "./InputForm";
import * as Yup from "yup";
import store from "../../store/store";

const validationSchema = Yup.object({
  title: Yup.string().required(),
  subtitle: Yup.string(),
  description: Yup.string().required(),
  authors: Yup.string(),
  genre: Yup.string(),
  publishedDate: Yup.string().required(),
  publisher: Yup.string().required(),
  isbn10: Yup.string()
    .matches(/^[0-9]{10}$/, "Number of exactly 10 digits")
    .required(),
  isbn13: Yup.string()
    .matches(/^[0-9]{13}$/, "Number of exactly 13 digits")
    .required(),
  language: Yup.string().required(),
  image: Yup.string().url().required(),
});
const styles = (theme) => ({
  heading: {
    textAlign: "center",
  },
  container: {
    maxWidth: "200px",
  },
});

const Form = (routerProps) => {
  const values = {
    title: "",
    subtitle: "",
    description: "",
    authors: "",
    language: "",
    genre: "",
    isbn10: "",
    isbn13: "",
    publishedDate: null,
    publisher: "",
    image: "",
  };

  const classes = routerProps;

  useEffect(() => {
    let bc = store.getState().breadCrumbs;
    if (bc[bc.length - 1].path !== `/add-book`) {
      store.dispatch({
        type: "ADD_BREADCRUMB",
        breadCrumb: { title: `Add`, category: "books", path: `/add-book` },
      });
    }
  }, []);

  return (
    <Container maxWidth="sm">
      <div
        className={classes.container}
        style={{ marginTop: "25px", marginBottom: "50px" }}
      >
        <h1 className={classes.heading}>Add Book</h1>
        <Formik
          enableReinitialize={true}
          render={(props) => <InputForm {...props} {...routerProps} />}
          initialValues={values}
          validationSchema={validationSchema}
        />
      </div>
    </Container>
  );
};

export default withStyles(styles)(Form);
