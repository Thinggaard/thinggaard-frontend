import { FormControl, Typography, Slider, TextField } from "@material-ui/core";
import React, { useContext } from "react";
import globalContext from "../../context/global/globalContext";
import { SET_CHILDREN, SET_CHILDREN_AGES } from "../../context/types";
import { useStyles } from "../../styles";

const ChildrenSelect = (props) => {
  const classes = useStyles();
  const { children, childrenAges, dispatch } = useContext(globalContext);

  const countChildren = (number) => {
    let myChildren = [];
    for (let i = 0; i < children; i++) {
      myChildren.push("5");
    }
    return myChildren;
  };

  return (
    <>
      <FormControl variant="outlined" style={props.style}>
        <Typography id="Children-slider-label" gutterBottom>
          Antal børn: {children}
        </Typography>
        <Slider
          aria-labelledby="Children-slider-label"
          step={1}
          min={0}
          max={10}
          marks
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
                size="small"
                label={"Barn " + (count + 1) + " alder"}
                type="number"
                inputProps={{ style: { fontSize: 13 } }} // font size of input text
                InputLabelProps={{ style: { fontSize: 11 } }} // font size of input label
                variant="outlined"
                value={childrenAges[count] ? childrenAges[count] : false}
                onChange={(myEvent) => {
                  childrenAges[count] = myEvent.target.value;
                  console.log(childrenAges);
                  dispatch({
                    type: SET_CHILDREN_AGES,
                    payload: childrenAges,
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
