import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useContext } from "react";
import globalContext from "../../context/global/globalContext";
import { SET_CURRENT_TRANSPORT } from "../../context/types";
import { useStyles } from "../../styles";

const TransportsSelect = () => {
  const classes = useStyles();
  const { transports, currentTransport, dispatch } = useContext(globalContext);

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="label-transport">Transport</InputLabel>
        <Select
          labelId="label-transport"
          label="transport"
          id="select-transport"
          displayEmpty
          value={currentTransport}
          onChange={(e) => {
            dispatch({
              type: SET_CURRENT_TRANSPORT,
              payload: e.target.value,
            });
          }}
        >
          <MenuItem value={false} disabled>
            -- select an option --
          </MenuItem>

          {transports?.map((item) => (
            <MenuItem
              key={item.transport_category_id}
              value={item.transport_category_id}
            >
              {item.transport_category_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default TransportsSelect;
