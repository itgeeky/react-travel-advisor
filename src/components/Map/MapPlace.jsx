import React from "react";
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { Paper, Typography} from '@material-ui/core';
import useStyles from './styles.js';
import Rating from '@material-ui/lab/Rating';





const MapPlace = ({ lat, lng, matches, photo, rating, name }) => {
  const classes = useStyles();
  return (
    <div
      className={classes.markerContainer}
      lat={lat}
      lng={lng}
    >
      {!matches ? (
        <LocationOnOutlinedIcon color="primary" fontSize="large" />
      ) : (
        <>
          <Paper elevation={3} className={classes.paper}>
            <Typography
              className={classes.typography}
              variant="subtitle2"
              gutterBottom
            >
              {" "}
              {name.length > 30 ? name.substring(0, 3) : name}
            </Typography>
            <img
              className={classes.pointer}
              alt="rest-header-img"
              src={photo}
            />
            <Rating
              name="read-only"
              size="small"
              value={Number(rating)}
              readOnly
            />
          </Paper>
        </>
      )}
    </div>
  );
};

export default MapPlace