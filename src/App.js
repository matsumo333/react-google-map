import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapComponent from "./components/MapComponent"; // パスを確認
import DisplayMapComponent from "./components/DisplayMapComponent"; // パスを確認
import Home from "./components/Home";
import GoogleMapSelect from "./components/GoogleMapSelect";

const App = () => (
  <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/map" element={<MapComponent />} /> */}
        <Route path="/displaymap" element={<DisplayMapComponent />} />
        <Route
          path="/displaymap/:locationId"
          element={<DisplayMapComponent />}
        />
        {/* 他のルートをここに追加できます */}
        <Route path="/map" element={<GoogleMapSelect />} />
      </Routes>
    </Router>
  </APIProvider>
);

export default App;
