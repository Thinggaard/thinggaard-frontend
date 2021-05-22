import { Button, Grid, TextField, useMediaQuery } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatesSelect from "../components/form-inputs/DatesSelect";
import DestinationsSelect from "../components/form-inputs/DestinationsSelect";
import DurationsSelect from "../components/form-inputs/DurationsSelect";
import TransportsSelect from "../components/form-inputs/TransportsSelect";
import Trip from "../components/Trip";
import { useStyles } from "../styles";

const Home = () => {
  const classes = useStyles();
  const MinWidth600 = useMediaQuery("(max-width:600px)");
  const [apiAuthentication, setApiAuthentication] = useState(false);
  const [destinations, setDestinations] = useState(null);
  const [destinationId, setdestinationId] = useState(null);
  const [duration, setDuration] = useState("");
  const [adults, setAdults] = useState("");
  const [transport, setTransport] = useState("");
  const [date, setDate] = useState(null);
  const [trips, setTrips] = useState(null);

  const countAdults = (number) => {
    let countAdults = [];
    for (let i = 0; i < adults; i++) {
      countAdults.push("30");
    }
    return countAdults;
  };

  useEffect(() => {
    let source = axios.CancelToken.source();
    const getAuthentication = async () => {
      try {
        const { data } = await axios.get(
          "https://thinggaard.dk/wp-json/thinggaard/v1/authentication",
          {
            cancelToken: source.token,
          }
        );
        setApiAuthentication(data.result.auth_token);
      } catch (error) {
        console.log(error);
      }
    };
    getAuthentication();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    let source = axios.CancelToken.source();

    const fetchDestinations = async () => {
      if (apiAuthentication) {
        try {
          const { data } = await axios.get(
            `https://thinggaard.dk/wp-json/thinggaard/v1/destinations?token=${apiAuthentication}`,
            {
              cancelToken: source.token,
            }
          );
          setDestinations(data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchDestinations();

    return () => {
      source.cancel();
    };
  }, [apiAuthentication]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.get(
        `https://thinggaard.dk/wp-json/thinggaard/v1/trips?destination_id=${
          destinationId.code
        }&ages=${countAdults(
          adults
        )}&duration=${duration}&date=${date}&transport=${transport}&token=${apiAuthentication}`
      );
      console.log(
        "🚀 ~ file: Home.js ~ line 90 ~ handleSubmit ~ data",
        data.result
      );
      setTrips(data.result);
    } catch (error) {}
  };

  return (
    <>
      {destinations && (
        <form onSubmit={handleSubmit} className="p-2 grid md:grid-cols-3 gap-3">
          <DestinationsSelect
            list={destinations.destinations}
            value={destinationId}
            onChange={setdestinationId}
          />

          <DurationsSelect
            apiAuthentication={apiAuthentication}
            destinationId={destinationId}
            value={duration}
            onChange={setDuration}
          />

          <TransportsSelect
            destinationId={destinationId}
            duration={duration}
            apiAuthentication={apiAuthentication}
            value={transport}
            onChange={setTransport}
          />

          <TextField
            label="antal voksne"
            type="number"
            variant="outlined"
            className={classes.formControl}
            value={adults}
            onChange={(e) => {
              setAdults(e.target.value);
            }}
          />

          <DatesSelect
            apiAuthentication={apiAuthentication}
            destinationId={destinationId}
            value={date}
            onChange={setDate}
          />

          <Button fullWidth type="submit" variant="outlined">
            Find Rejse
          </Button>
        </form>
      )}

      {trips && (
        <Link to="/hotel/details" className="p-4 flex flex-col space-y-6 ">
          {trips.map((trip) => (
            <Trip key={trip.accomodation_code} trip={trip} />
          ))}
        </Link>
      )}

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
