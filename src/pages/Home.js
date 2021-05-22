import { Button, TextField } from "@material-ui/core";
import { useContext } from "react";
import DatesSelect from "../components/form-inputs/DatesSelect";
import DestinationsSelect from "../components/form-inputs/DestinationsSelect";
import DurationsSelect from "../components/form-inputs/DurationsSelect";
import TransportsSelect from "../components/form-inputs/TransportsSelect";
import Trip from "../components/Trip";
import { useStyles } from "../styles";
import globalContext from "../context/global/globalContext";
import { SET_ADULTS } from "../context/types";

const Home = () => {
  const classes = useStyles();
  const { destinations, handleSubmit, adults, dispatch, trips } =
    useContext(globalContext);

  return (
    <>
      {destinations && (
        <form onSubmit={handleSubmit} className="p-2 grid md:grid-cols-3 gap-3">
          <DestinationsSelect />
          <DurationsSelect />
          <TransportsSelect />
          <TextField
            label="antal voksne"
            type="number"
            variant="outlined"
            className={classes.formControl}
            value={adults}
            onChange={(e) => {
              dispatch({
                type: SET_ADULTS,
                payload: e.target.value,
              });
            }}
          />
          <DatesSelect />
          <Button fullWidth type="submit" variant="outlined">
            Find Rejse
          </Button>
        </form>
      )}

      {trips?.map((trip) => (
        <Trip key={trip.accomodation_code} trip={trip} />
      ))}

      {trips === undefined && (
        <div className="m-4 p-3 text-center shadow">
          <p className="font-bold">Vi kunne desværre ikke finde din rejse</p>
          <p className="italic">Tjek om din søgning er korrekt</p>
          <p className="">
            Eller kontakt os på <a href="tel:70100010">70 10 00 10</a>
          </p>
        </div>
      )}
    </>
  );
};

export default Home;
