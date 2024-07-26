import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@vis.gl/react-google-maps";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const MapComponent = () => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleMapClick = async (event) => {
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(position);

    try {
      await setDoc(doc(db, "locations", "locationId"), position);
      console.log("Location saved to database");
    } catch (error) {
      console.error("Error saving location to database", error);
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={{ lat: -3.745, lng: -38.523 }}
        zoom={10}
        onClick={handleMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
