import GoogleMapReact from "google-map-react";
import { useGeolocated } from "react-geolocated";
import { useEffect, useState } from "react";

interface MapComponentProps {
  children: any;
}

export const MapComponent: React.FC<MapComponentProps> = ({ children }) => {
  const [center, setCenter] = useState<any>(null);
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (coords && !center) setCenter(coords);
  }, [coords, center]);

  const defaultProps = {
    zoom: 11,
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {center && (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_API_KEY || "",
            language: "english",
          }}
          defaultCenter={{ lat: center?.latitude, lng: center?.longitude }}
          defaultZoom={defaultProps.zoom}
        >
          {children}
        </GoogleMapReact>
      )}
    </div>
  );
};
