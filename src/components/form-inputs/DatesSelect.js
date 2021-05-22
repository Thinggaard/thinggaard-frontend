import React, { useContext } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import { useStyles } from "../../styles";
import globalContext from "../../context/global/globalContext";
import { SET_CURRENT_DATE } from "../../context/types";

const DatesSelect = () => {
  const classes = useStyles();
  const { dates, currentDate, dispatch } = useContext(globalContext);

  const daylist = dates?.map((date) => date.date);

  // const renderDayInPicker = (
  //   date,
  //   selectedDate,
  //   dayInCurrentMonth,
  //   dayComponent
  // ) => {
  //   if (daylist.includes(format(date, "yyyy-MM-dd"))) {
  //     return <div style={{ backgroundColor: "green" }}>{dayComponent}</div>;
  //   }
  //   return dayComponent;
  // };

  const disableDays = (date) => {
    if (!daylist.includes(format(date, "yyyy-MM-dd"))) {
      return true;
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        shouldDisableDate={disableDays}
        className={classes.formControl}
        clearable
        value={currentDate}
        label="Vælg dato"
        onChange={(date) => {
          dispatch({
            type: SET_CURRENT_DATE,
            payload: date,
          });
        }}
        minDate={new Date()}
        format="MM/dd/yyyy"
        // renderDay={renderDayInPicker}
        inputVariant="outlined"
        variant="dialog"
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatesSelect;
