import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStyles } from "../../styles";

const TransportsSelect = ({
  destinationId,
  duration,
  apiAuthentication,
  onChange,
  value,
}) => {
  const classes = useStyles();
  const [transports, setTransports] = useState(null);

  useEffect(() => {
    if (!destinationId) {
      return;
    }
    let source = axios.CancelToken.source();
    const fetch = async () => {
      if (apiAuthentication) {
        try {
          const { data } = await axios.get(
            `https://thinggaard.dk/wp-json/thinggaard/v1/transports?destination_id=${destinationId.id}&token=${apiAuthentication}&duration_from=${duration}&duration_to=${duration}`,
            {
              cancelToken: source.token,
            }
          );
          setTransports(data.result);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetch();

    return () => {
      source.cancel();
    };
  }, [destinationId, apiAuthentication]);
  return (
    <>
      {/* <label htmlFor="TransportsSelect">TransportsSelect</label>
      <select id="TransportsSelect">
        <option disabled selected value>
          -- select an option --
        </option>
        {transports?.map((date) => {
          console.log(
            "🚀 ~ file: TransportsSelect.js ~ line 35 ~ {transports?.map ~ date",
            date
          );
          return <option value="test">test</option>;
        })}
      </select> */}

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="label-transport">Transport</InputLabel>
        <Select
          labelId="label-transport"
          label="transport"
          id="select-transport"
          displayEmpty
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        >
          <MenuItem value={false} disabled>
            -- select an option --
          </MenuItem>
          <MenuItem key="0" value="0">
            Kør selv
          </MenuItem>
          <MenuItem key="1" value="1">
            Bus
          </MenuItem>
          <MenuItem key="2" value="2">
            Fly
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default TransportsSelect;
