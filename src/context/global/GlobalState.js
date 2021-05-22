import React, { useEffect, useReducer } from "react";
import globalReducer from "./globalReducer";
import GlobalContext from "./globalContext";
import {
  // SET_LOADING,
  SET_TOKEN,
  SET_DESTINATIONS,
  SET_ALL_DURATIONS,
  SET_COUNTRIES,
  SET_DURATIONS,
  SET_TRANSPORTS,
  SET_DATES,
  SET_TRIPS,
} from "../types";
import axios from "axios";

const GlobalState = (props) => {
  const initialState = {
    token: null,
    loading: false,
    destinations: [],
    allDurations: null,
    countries: null,
    currentDestination: null,
    durations: null,
    currentDuration: "",
    transports: null,
    currentTransport: "",
    adults: 2,
    dates: [new Date()],
    currentDate: null,
    trips: null,
  };

  const [state, dispatch] = useReducer(globalReducer, initialState);

  const getAuthentication = async (source) => {
    try {
      const { data } = await axios.get(
        "https://thinggaard.dk/wp-json/thinggaard/v1/authentication",
        {
          cancelToken: source.token,
        }
      );
      dispatch({
        type: SET_TOKEN,
        payload: data.result.auth_token,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDestinations = async (source) => {
    try {
      const { data } = await axios.get(
        `https://thinggaard.dk/wp-json/thinggaard/v1/destinations?token=${state.token}`,
        {
          cancelToken: source.token,
        }
      );
      dispatch({
        type: SET_DESTINATIONS,
        payload: data.destinations,
      });
      dispatch({
        type: SET_ALL_DURATIONS,
        payload: data.durations,
      });
      dispatch({
        type: SET_COUNTRIES,
        payload: data.countries,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDurations = async (source) => {
    if (!state.currentDestination) {
      return;
    }
    try {
      const { data } = await axios.get(
        `https://thinggaard.dk/wp-json/thinggaard/v1/durations?destination_id=${state.currentDestination.code}&token=${state.token}}`,
        {
          cancelToken: source.token,
        }
      );
      dispatch({
        type: SET_DURATIONS,
        payload: data.result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransports = async (source) => {
    try {
      const { data } = await axios.get(
        `https://thinggaard.dk/wp-json/thinggaard/v1/transports?destination_id=${state.currentDestination.id}&token=${state.token}&duration_from=${state.currentDuration}&duration_to=${state.currentDuration}`,
        {
          cancelToken: source.token,
        }
      );
      dispatch({
        type: SET_TRANSPORTS,
        payload: data.result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDates = async (source) => {
    try {
      const { data } = await axios.get(
        `https://thinggaard.dk/wp-json/thinggaard/v1/dates?destination_id=${state.currentDestination?.code}&token=${state.token}`,
        {
          cancelToken: source.token,
        }
      );
      dispatch({
        type: SET_DATES,
        payload: data.result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const countAdults = (number) => {
    let countAdults = [];
    for (let i = 0; i < state.adults; i++) {
      countAdults.push("30");
    }
    return countAdults;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.get(
        `https://thinggaard.dk/wp-json/thinggaard/v1/trips?destination_id=${
          state.currentDestination.code
        }&ages=${countAdults(state.adults)}&duration=${
          state.currentDuration
        }&date=${state.currentDate}&transport=${state.currentTransport}&token=${
          state.token
        }}`
      );
      console.log(
        "🚀 ~ file: GlobalState.js ~ line 155 ~ handleSubmit ~ data",
        data
      );
      dispatch({
        type: SET_TRIPS,
        payload: data.result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // useEffects

  useEffect(() => {
    let source = axios.CancelToken.source();
    getAuthentication(source);

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    let source = axios.CancelToken.source();
    if (state.token) {
      fetchDestinations(source);
    }
    return () => {
      source.cancel();
    };
  }, [state.token]);

  useEffect(() => {
    let source = axios.CancelToken.source();
    fetchDurations(source);

    if (state.token) {
      fetchDates(source);
    }

    if (state.currentDuration) {
      fetchTransports(source);
    }

    return () => {
      source.cancel();
    };
  }, [state.currentDestination, state.currentDuration]);

  return (
    <GlobalContext.Provider
      value={{
        loading: state.loading,
        token: state.token,
        destinations: state.destinations,
        allDurations: state.allDurations,
        countries: state.countries,
        currentDestination: state.currentDestination,
        durations: state.durations,
        currentDuration: state.currentDuration,
        transports: state.transports,
        currentTransport: state.currentTransport,
        adults: state.adults,
        dates: state.dates,
        currentDate: state.currentDate,
        trips: state.trips,
        dispatch,
        handleSubmit,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
