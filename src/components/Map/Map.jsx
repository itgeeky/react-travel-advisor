import { useRef, useMemo, useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { useMediaQuery } from "@material-ui/core";
import MapPlace from "./MapPlace";

import mapStyles from "./mapStyles";
import useStyles from "./styles.js";
import useSupercluster from "use-supercluster";

import "./styles.css";

const Marker = ({ children }) => children;

const Map = ({ coords, places, setCoords, setBounds, setChildClicked }) => {
  const mapRef = useRef();
  const [boundds, setBoundds] = useState(null);
  const [zoom, setZoom] = useState(10);
  const matches = useMediaQuery("(min-width:600px)");
  const classes = useStyles();
  const points = places.map((place) => ({
    type: "Feature",
    properties: {
      cluster: false,
      placeId: place.location_id,
      name: place.name,
      photo: place.photo
        ? place.photo.images.large.url
        : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg",
      rating: +place.rating,
    },
    geometry: {
      type: "Point",
      coordinates: [parseFloat(place.longitude), parseFloat(place.latitude)],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: boundds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 20,
    },
  });


  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChange={(e) => {
          setCoords({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
          setZoom(e.zoom);
          setBoundds([
            e.bounds.nw.lng,
            e.bounds.se.lat,
            e.bounds.se.lng,
            e.bounds.nw.lat,
          ]);
        }}
        onChildClick={(child) => {
          console.log({child})
          setChildClicked(child)
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
      >
        {clusters &&
          clusters.map((cluster, i) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } =
              cluster.properties;

            if (isCluster) {
              let size = (pointCount * 25) / points.length;

              return (
                <Marker
                  lat={latitude}
                  lng={longitude}
                  key={`cluster-${cluster.id}`}
                  className="cluster-marker"
                >
                  <div
                    className="cluster-marker"
                    style={{ width: size + "px", height: size + "px", cursor:'pointer' }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20
                      );
                      mapRef.current.setZoom(expansionZoom);
                      mapRef.current.panTo({ lat: latitude, lng: longitude });
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            } else {
              return (
                <MapPlace
                  key={i}
                  lat={latitude}
                  lng={longitude}
                  matches={matches}
                  rating={cluster.properties.rating}
                  name={cluster.properties.name}
                />
              );
            }
          })}
        {/* {places.length &&
          places.map((place, i) => (
            <MapPlace
              key={`cluster-${cluster.properties.placeId}`}
              lat={+place.latitude}
              lng={+place.longitude}
              matches={matches}
              photo={
                place.photo
                  ? place.photo.images.large.url
                  : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
              }
              rating={+place.rating}
              name={place.name}
            />
          ))} */}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
