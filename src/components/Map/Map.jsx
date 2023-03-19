import { useRef, useMemo } from "react";
import GoogleMapReact from "google-map-react";
import { useMediaQuery } from "@material-ui/core";
import MapPlace from "./MapPlace";

import mapStyles from "./mapStyles";
import useStyles from "./styles.js";

import "./styles.css";

const Marker = ({ children }) => children;

const Map = ({
  coords,
  setCoords,
  setBounds,
  setChildClicked,
  clusters,
  supercluster,
  setBoundsCluster,
  setZoom,
  pointsLength,
}) => {
  const mapRef = useRef();
  const matches = useMediaQuery("(min-width:600px)");
  const classes = useStyles();

  const clusterMarkers = useMemo(() => {
    if (!clusters) {
      return null;
    }
    return clusters.map((cluster, i) => {
      const [longitude, latitude] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count: pointCount } = cluster.properties;

      if (isCluster) {
        let size = (pointCount * 25) / pointsLength;

        return (
          <Marker
            lat={latitude}
            lng={longitude}
            key={`cluster-${cluster.id}`}
            className="cluster-marker"
          >
            <div
              className="cluster-marker"
              style={{
                width: size + "px",
                height: size + "px",
                cursor: "pointer",
              }}
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
            rating={cluster.properties.place.rating}
            name={cluster.properties.place.name}
          />
        );
      }
    });
  }, [clusters, pointsLength, matches, supercluster]);

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
          setBoundsCluster([
            e.bounds.nw.lng,
            e.bounds.se.lat,
            e.bounds.se.lng,
            e.bounds.nw.lat,
          ]);
        }}
        onChildClick={(child) => {
          setChildClicked(child);
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
      >
        {clusterMarkers}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
