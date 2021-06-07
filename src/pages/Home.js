import { Button, FormControl } from "@material-ui/core";
import { useContext } from "react";
import DatesSelect from "../components/form-inputs/DatesSelect";
import DestinationsSelect from "../components/form-inputs/DestinationsSelect";
import DurationsSelect from "../components/form-inputs/DurationsSelect";
import TransportsSelect from "../components/form-inputs/TransportsSelect";
import AdultsSelect from "../components/form-inputs/AdultsSelect";
import ChildrenSelect from "../components/form-inputs/ChildrenSelect";
import Trip from "../components/Trip";
import { useStyles } from "../styles";
import globalContext from "../context/global/globalContext";

const Home = () => {
  const classes = useStyles();
  const { destinations, currentDestination, handleSubmit, trips } =
    useContext(globalContext);

  return (
    <>
      {destinations && (
        <form onSubmit={handleSubmit}>
          <div
            className="p-4 gap-4"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <DestinationsSelect style={{ flex: "5" }} />
            <DurationsSelect
              disabled={currentDestination ? false : true}
              style={{ flex: "3" }}
            />
            <TransportsSelect
              disabled={currentDestination ? false : true}
              style={{ flex: "3" }}
            />
            <DatesSelect
              disabled={currentDestination ? false : true}
              style={{ flex: "3" }}
            />
            <AdultsSelect
              style={{
                flex: "3",
              }}
            />
            <ChildrenSelect
              style={{
                flex: "3",
              }}
            />
            <FormControl style={{ flex: "3" }}>
              <Button
                size="large"
                color="primary"
                type="submit"
                variant="contained"
                style={{ minHeight: "56px" }}
              >
                Find Rejse
              </Button>
            </FormControl>
          </div>
        </form>
      )}

      {trips?.map((trip, key) => (
        <Trip key={key} trip={trip} />
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
