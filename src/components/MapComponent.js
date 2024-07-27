import React, { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const MapComponent = () => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleMapClick = async (event) => {
    console.log("Map click event:", event);

    const latLng = event.detail?.latLng;
    if (latLng && latLng.lat && latLng.lng) {
      const position = {
        lat: latLng.lat,
        lng: latLng.lng,
        timestamp: new Date(), // 現在の日付を追加
      };
      setMarkerPosition(position);

      try {
        // ドキュメントの ID を自動生成
        const docRef = await addDoc(collection(db, "locations"), position);
        console.log("Location saved to database with ID:", docRef.id);
      } catch (error) {
        console.error("Error saving location to database", error);
      }
    } else {
      console.error("Event does not contain latLng");
    }
  };

  return (
    <Map
      style={{ width: "100%", height: "100vh" }}
      defaultCenter={{ lat: 35.658584, lng: 139.745433 }}
      defaultZoom={15}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      onClick={handleMapClick}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </Map>
  );
};

export default MapComponent;
