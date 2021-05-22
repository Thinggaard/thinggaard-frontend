import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useStyles } from "../../styles";

const DurationsSelect = ({
  destinationId,
  onChange,
  value,
  apiAuthentication,
}) => {
  const classes = useStyles();

  const [durations, setDurations] = useState(null);

  useEffect(() => {
    if (!destinationId) {
      return;
    }
    let source = axios.CancelToken.source();
    const fetch = async () => {
      if (apiAuthentication) {
        try {
          const { data } = await axios.get(
            `https://thinggaard.dk/wp-json/thinggaard/v1/durations?destination_id=${destinationId.code}&token=${apiAuthentication}`,
            {
              cancelToken: source.token,
            }
          );
          setDurations(data.result);
        } catch (error) {}
      }
    };
    fetch();

    return () => {
      source.cancel();
    };
  }, [destinationId, apiAuthentication]);
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="DurationsSelect">DurationsSelect</InputLabel>
      <Select
        id="DurationsSelect"
        value={value}
        label="DurationsSelect"
        onChange={(e) => {
          onChange(e.target.value);
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
