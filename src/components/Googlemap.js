import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@vis.gl/react-google-maps";

const defaultLatLng = {
  lat: 35.658584,
  lng: 139.745433,
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

export const Googlemap = () => {
  const [marker, setMarker] = useState(null);

  function handleMapClick(event) {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyA-axJ5xneb0a_eqQtwbmMlAg7TRYi3aiI">
      <GoogleMap
        center={defaultLatLng}
        zoom={7}
        mapContainerStyle={containerStyle}
        onClick={handleMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </LoadScript>
  );
};
