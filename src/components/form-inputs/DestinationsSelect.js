import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import React, { useContext } from "react";
import globalContext from "../../context/global/globalContext";
import { SET_CURRENT_DESTINATION } from "../../context/types";
import { useStyles } from "../../styles";

const DestinationsSelect = (props) => {
  const classes = useStyles();
  const { destinations, currentDestination, dispatch } =
    useContext(globalContext);

  return (
    <FormControl variant="outlined" style={props.style}>
      <InputLabel id="destinations">Rejsemål</InputLabel>
      <Select
        id="destinations"
        label="destinations"
        value={currentDestination ? currentDestination : ""}
        onChange={(e) => {
          dispatch({
            type: SET_CURRENT_DESTINATION,
            payload: e.target.value,
          });
        }}
      >
        <MenuItem disabled selected>
          -- Vælg et rejsemål --
        </MenuItem>
        {destinations?.map((item, key) => {
          return (
            <MenuItem key={key} value={item}>
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default DestinationsSelect;
