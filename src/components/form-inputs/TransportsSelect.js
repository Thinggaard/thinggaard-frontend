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
        <InputLabel id="TransportsSelect">Transportform</InputLabel>
        <Select
          label="TransportsSelect"
          id="TransportsSelect"
          value={currentTransport}
          onChange={(e) => {
            dispatch({
              type: SET_CURRENT_TRANSPORT,
              payload: e.target.value,
            });
          }}
        >
          <MenuItem value={false} selected disabled>
            -- Vælg transportform --
          </MenuItem>

          {transports?.map((item, key) => (
            <MenuItem key={key} value={item.transport_category_id}>
              {item.transport_category_name.toLowerCase() === "car" && <>Bil</>}
              {item.transport_category_name.toLowerCase() === "bus" && <>Bus</>}
              {item.transport_category_name.toLowerCase() === "flight" && (
                <>Fly</>
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default TransportsSelect;
