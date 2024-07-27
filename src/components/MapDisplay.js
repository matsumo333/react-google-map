import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapDisplay = () => {
  const { locationId } = useParams();
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (locationId) {
        try {
          const docRef = doc(db, "locations", locationId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setLocationData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching location data", error);
        }
      }
    };

    fetchLocation();
  }, [locationId]);

  if (!locationData) {
    return <p>Loading...</p>;
  }

  const { lat, lng } = locationData;

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "800px" }}
        center={{ lat, lng }}
        zoom={10}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapDisplay;
