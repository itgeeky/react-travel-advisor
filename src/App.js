import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import useSupercluster from "use-supercluster";

import { getPlacesData } from "./api/index";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";

const App = () => {
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("0");

  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);
  const [boundsCluster, setBoundsCluster] = useState(null);
  const [zoom, setZoom] = useState(10);

  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [places, setPlaces] = useState([]);

  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  const getPoints = (places) => {
    return places.map((place) => ({
      type: "Feature",
      properties: {
        cluster: false,
        place,
      },
      geometry: {
        type: "Point",
        coordinates: [parseFloat(place.longitude), parseFloat(place.latitude)],
      },
    }));
  };

  const { clusters, supercluster } = useSupercluster({
    points: filteredPlaces.length
      ? getPoints(filteredPlaces)
      : getPoints(places),
    bounds: boundsCluster,
    zoom,
    options: {
      radius: 75,
      maxZoom: 20,
    },
  });

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);

    setFilteredPlaces(filtered);
  }, [rating, places]);

  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
        setFilteredPlaces([]);
        setRating("");
        setIsLoading(false);
      });
    }
  }, [bounds, type]);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
  };

  const orderFeaturesByCluster = (features) => {
    const clustersFirst = [...features];

    clustersFirst.sort((a, b) => {
      if (a.properties.cluster && !b.properties.cluster) {
        return 1;
      }
      if (!a.properties.cluster && b.properties.cluster) {
        return -1;
      }
      return 0;
    });

    return clustersFirst;
  };

  return (
    <>
      <CssBaseline />
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            childClicked={childClicked}
            places={orderFeaturesByCluster(clusters).filter(
              (cluster) => !cluster.properties.cluster
            )}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Map
            setChildClicked={setChildClicked}
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            clusters={orderFeaturesByCluster(clusters)}
            supercluster={supercluster}
            setBoundsCluster={setBoundsCluster}
            setZoom={setZoom}
            pointsLength={
              filteredPlaces.length
                ? getPoints(filteredPlaces).length
                : getPoints(places).length
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
