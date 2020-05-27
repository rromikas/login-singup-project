import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    height: 180,
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
  },
}));

export default function MediaControlCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={props.image}
        alt={props.title}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h2" variant="h6">
            {props.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {props.subtitle}
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}
