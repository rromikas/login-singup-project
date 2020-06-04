import React, { useState, useEffect } from "react";
import Ratings from "react-ratings-declarative";

const Rating = ({ onSet, rating, size = "25px" }) => {
  const [localRating, setRating] = useState(rating);
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    let timeout = setTimeout(() => {
      setClicked(false);
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [clicked]);

  useEffect(() => {
    setRating(rating ? rating : 0);
  }, [rating]);
  return (
    <div
      style={{
        transition: "transform 0.1s ease-out",
        transform: `scale(${clicked ? 1.1 : 1}) translateY(-4px)`,
      }}
    >
      <Ratings
        changeRating={
          onSet
            ? (newRating) => {
                setClicked(true);
                setRating(newRating);
                onSet(newRating);
              }
            : null
        }
        rating={localRating}
        widgetRatedColors="orange"
        widgetDimensions={size}
        widgetSpacings="0px"
        widgetHoverColors="orange"
      >
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
      </Ratings>
    </div>
  );
};

export default Rating;
