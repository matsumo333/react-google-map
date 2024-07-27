import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";

const Home = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "locations"));
        const locationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocations(locationsData);
      } catch (error) {
        console.error("Error fetching locations data", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <>
      <div>Home</div>
      <div>
        <Link to="/map">地図表示</Link>
      </div>
      <div>
        {locations.length > 0 ? (
          <ul>
            {locations.map((location) => (
              <li key={location.id}>
                <Link to={`/displaymap/${location.id}`}>
                  <button>{location.id}</button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading location data...</p>
        )}
      </div>
    </>
  );
};

export default Home;
