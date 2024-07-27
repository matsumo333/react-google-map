import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const MapRedirectComponent = () => {
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

  useEffect(() => {
    if (locationData) {
      const { lat, lng } = locationData;
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.location.href = googleMapsUrl; // 外部リンクにリダイレクト
    }
  }, [locationData]);

  return <p>Redirecting...</p>; // リダイレクト中のメッセージ
};

export default MapRedirectComponent;
