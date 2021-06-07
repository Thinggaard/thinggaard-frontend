import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useContext } from "react";
import globalContext from "../../context/global/globalContext";
import { SET_CURRENT_TRANSPORT } from "../../context/types";
import { useStyles } from "../../styles";

const TransportsSelect = (props) => {
  const classes = useStyles();
  const { transports, currentTransport, dispatch } = useContext(globalContext);

  return (
    <>
      <FormControl
        variant="outlined"
        className={[props.className, classes.formControl]}
        disabled={props.disabled}
        style={props.style}
      >
        <InputLabel id="label-transport">Transportform</InputLabel>
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
            -- Vælg transportform --
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
