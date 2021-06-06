import { FormControl, Typography, Slider, TextField } from "@material-ui/core";
import React, { useContext } from "react";
import globalContext from "../../context/global/globalContext";
import { SET_CHILDREN } from "../../context/types";
import { useStyles } from "../../styles";

const ChildrenSelect = (props) => {
  const classes = useStyles();
  const { children, dispatch } = useContext(globalContext);

  const countChildren = (number) => {
    let myChildren = [];
    for (let i = 0; i < children; i++) {
      myChildren.push("5");
    }
    return myChildren;
  };

  return (
    <>
      <FormControl
        variant="outlined"
        className={[props.className, classes.formControl]}
      >
        <Typography id="Children-slider-label" gutterBottom>
          Antal børn: {children}
        </Typography>
        <Slider
          aria-labelledby="Children-slider-label"
          step={1}
          min={0}
          max={10}
          marks
          defaultValue={children}
          valueLabelDisplay="off"
          onChange={(e, newvalue) => {
            dispatch({
              type: SET_CHILDREN,
              payload: newvalue,
            });
          }}
        />
        {children > 0 &&
          countChildren(children).map((item, count) => (
            <div className="mb-2">
              <TextField
                fullWidth
                label={"Barn " + (count + 1) + " alder ved afrejse"}
                type="number"
                inputProps={{ style: { fontSize: 11 } }} // font size of input text
                InputLabelProps={{ style: { fontSize: 11 } }} // font size of input label
                variant="outlined"
                onChange={(e) => {
                  dispatch({
                    type: SET_CHILDREN,
                    payload: e.target.value,
                  });
                }}
              />
            </div>
          ))}
      </FormControl>
    </>
  );
};

export default ChildrenSelect;
