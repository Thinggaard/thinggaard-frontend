import React, { useState, useContext } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import { useStyles } from "../../styles";
import globalContext from "../../context/global/globalContext";
import { SET_CURRENT_DATE } from "../../context/types";

const DatesSelect = (props) => {
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

  const [pickerStatus, setPickerStatus] = useState(false);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        onClick={props.disabled ? () => {} : () => setPickerStatus(true)}
        onClose={() => setPickerStatus(false)}
        open={pickerStatus}
        disabled={props.disabled}
        disableToolbar
        shouldDisableDate={disableDays}
        className={[props.className, classes.formControl]}
        clearable
        autoOk={true}
        animateYearScrolling={true}
        value={currentDate}
        label="Dato"
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
