import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { GoogleMap, LoadScript, Marker } from "@vis.gl/react-google-maps";
import { db } from "./firebaseConfig";

const DisplayMapComponent = () => {
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const docRef = doc(db, "locations", "locationId");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMarkerPosition(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchLocation();
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={markerPosition || { lat: -3.745, lng: -38.523 }}
        zoom={10}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default DisplayMapComponent;
