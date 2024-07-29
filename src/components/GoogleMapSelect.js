// GoogleMapSelect.js
import React from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firebaseの設定ファイルをインポート
import "./GoogleMapSelect.css";

/**
 * Google Mapsの読み込み状態を表示
 * @param {string} status - Google Mapsの読込状態。"FAIL"は、読み込み失敗メッセージを表示。
 * @returns {JSX.Element} 読み込み状態に応じたメッセージを含むJSX要素
 */
const render = (status) => {
  if (status === "FAIL") {
    return <h1>Google Mapsの読み込みに失敗しました</h1>;
  }
  return <h1>{status}</h1>;
};

/**
 * GoogleMapSelectコンポーネント
 * @returns
 */
const GoogleMapSelect = () => {
  const [center, setCenter] = React.useState({ lat: 35.0116, lng: 135.7681 }); // 初期位置を京都に設定
  const [zoom, setZoom] = React.useState(15); // ズームレベルの初期値

  /**
   * 地図上の中心位置を更新
   */
  const updateCenter = (map) => {
    if (map) {
      const center = map.getCenter().toJSON();
      setCenter(center);
      setZoom(map.getZoom()); // ズームレベルも更新
    }
  };

  /**
   * Firestoreに位置情報を保存する関数
   */
  const saveLocation = async () => {
    try {
      // 現在の地図の中心を位置情報として保存
      const position = {
        lat: center.lat,
        lng: center.lng,
        timestamp: new Date(),
      };

      // Firestoreに位置情報を保存
      const docRef = await addDoc(collection(db, "locations"), position);
      console.log("Location saved to database with ID:", docRef.id);
    } catch (error) {
      console.error("Error saving location to database", error);
    }
  };

  /**
   * 地図表示の際の初期値を設定
   */
  const mapOptions = {
    center: center,
    zoom: zoom, // 動的にズームレベルを設定
    styles: [],
  };

  return (
    <div className="container" style={{ display: "flex", height: "100vh" }}>
      <div className="map-title">地図の世界</div>
      <div className="content">
        <Wrapper
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          render={render}
        >
          <div
            className="content-map"
            style={{ width: "100%", height: "100%" }}
          >
            <Map
              options={mapOptions}
              onCenterChange={updateCenter} // 地図の中心が変わったときに更新
              style={{ width: "100%", height: "100%" }}
            >
              <Marker position={center} />
            </Map>
            {/* 地図の中心に四角形を表示 */}
            <div className="center-square"></div>
            <div className="center-square2"></div>
          </div>
        </Wrapper>
        <button className="save-button" onClick={saveLocation}>
          この地点を指定する
        </button>
        {/* 以下の部分を削除またはコメントアウト */}
        {/* <div className="coordinates">
          <p>赤い四角の緯度: {center.lat.toFixed(6)}</p>
          <p>赤い四角の経度: {center.lng.toFixed(6)}</p>
        </div> */}
      </div>
    </div>
  );
};

const Map = ({ onCenterChange, children, style, options, ...otherProps }) => {
  const ref = React.useRef(null);
  const [map, setMap] = React.useState(null);

  React.useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, options);
      setMap(newMap);
    }
  }, [ref, map, options]);

  React.useEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      window.google.maps.event.clearListeners(map, "idle");

      // `idle` イベントリスナーを設定
      map.addListener("idle", () => {
        if (onCenterChange) {
          onCenterChange(map);
        }
      });
    }
  }, [map, onCenterChange]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker = ({ position, map }) => {
  const [marker, setMarker] = React.useState(null);

  React.useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker && map) {
      marker.setPosition(position);
      marker.setMap(map);
    }
  }, [marker, position, map]);

  return null;
};

export default GoogleMapSelect;
