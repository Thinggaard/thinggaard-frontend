import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import React from "react";
import { useStyles } from "../../styles";

const DestinationsSelect = ({ list, onChange, value }) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="destinations">destinations</InputLabel>
      <Select
        id="destinations"
        value={value}
        label="destinations"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        <MenuItem disabled selected value>
          -- select an option --
        </MenuItem>
        {list.map((item) => {
          return (
            <MenuItem key={item.id} value={item}>
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default DestinationsSelect;
