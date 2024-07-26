import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import MapComponent from "./components/MapComponent"; // パスを確認
import DisplayMapComponent from "./components/DisplayMapComponent"; // パスを確認

const App = () => (
  <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
    <Router>
      <Routes>
        <Route path="/map" element={<MapComponent />} />
        <Route path="/displaymap" element={<DisplayMapComponent />} />
        <Route
          path="/displaymap/:locationId"
          element={<DisplayMapComponent />}
        />
        {/* 他のルートをここに追加できます */}
      </Routes>
    </Router>
  </APIProvider>
);

export default App;
