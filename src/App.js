import React, { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const MapComponent = () => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleMapClick = async (event) => {
    // イベントオブジェクトの詳細をログ出力
    console.log("Map click event:", event);

    // event.detail.latLng を使用して位置を取得
    const latLng = event.detail?.latLng;
    if (latLng && latLng.lat && latLng.lng) {
      const position = {
        lat: latLng.lat,
        lng: latLng.lng,
      };
      setMarkerPosition(position);

      try {
        await setDoc(doc(db, "locations", "locationId"), position);
        console.log("Location saved to database");
      } catch (error) {
        console.error("Error saving location to database", error);
      }
    } else {
      console.error("Event does not contain latLng");
    }
  };

  return (
    <Map
      style={{ width: "100%", height: "400px" }}
      defaultCenter={{ lat: 35.658584, lng: 139.745433 }}
      defaultZoom={15}
      onClick={handleMapClick}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </Map>
  );
};

const App = () => (
  <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
    <MapComponent />
  </APIProvider>
);

export default App;
