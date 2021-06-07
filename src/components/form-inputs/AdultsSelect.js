import { FormControl, Typography, Slider } from "@material-ui/core";
import React, { useContext } from "react";
import globalContext from "../../context/global/globalContext";
import { SET_ADULTS } from "../../context/types";
import { useStyles } from "../../styles";

const AdultsSelect = (props) => {
  const classes = useStyles();
  const { adults, dispatch } = useContext(globalContext);

  return (
    <>
      <FormControl variant="outlined" style={props.style}>
        <Typography id="adults-slider-label" gutterBottom>
          Antal voksne: {adults}
        </Typography>
        <Slider
          aria-labelledby="adults-slider-label"
          step={1}
          min={1}
          max={20}
          marks
          defaultValue={adults}
          valueLabelDisplay="off"
          onChange={(e, newvalue) => {
            dispatch({
              type: SET_ADULTS,
              payload: newvalue,
            });
          }}
        />
      </FormControl>
    </>
  );
};

export default AdultsSelect;
