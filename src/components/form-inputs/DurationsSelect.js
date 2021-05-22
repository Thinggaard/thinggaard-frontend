import React, { useContext } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useStyles } from "../../styles";
import globalContext from "../../context/global/globalContext";
import { SET_CURRENT_DURATION } from "../../context/types";

const DurationsSelect = () => {
  const classes = useStyles();
  const { durations, currentDuration, dispatch } = useContext(globalContext);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="DurationsSelect">DurationsSelect</InputLabel>
      <Select
        id="DurationsSelect"
        value={currentDuration}
        label="DurationsSelect"
        onChange={(e) => {
          dispatch({
            type: SET_CURRENT_DURATION,
            payload: e.target.value,
          });
        }}
      >
        <MenuItem disabled selected value>
          -- select an option --
        </MenuItem>
        {durations?.map((duration, index) => (
          <MenuItem key={index} value={duration.days}>
            {duration.days}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DurationsSelect;
