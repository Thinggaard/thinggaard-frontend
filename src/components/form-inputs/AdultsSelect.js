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
        <div
          className="form-wrap"
          style={{
            padding: "0 20px",
            borderRadius: "5px",
            border: "1px solid #bbb",
          }}
        >
          <Typography id="adults-slider-label" variant="body2">
            Antal voksne: {adults}
          </Typography>
          <Slider
            aria-labelledby="adults-slider-label"
            step={1}
            min={1}
            max={10}
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
        </div>
      </FormControl>
    </>
  );
};

export default AdultsSelect;
