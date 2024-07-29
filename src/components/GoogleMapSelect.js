import React from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import "./GoogleMapSelect.css";
/**
 * googleMapの実行状態を表示
 * @param {*} status
 * @returns
 */
const render = (status) => {
  if (status === "FAIL") {
    return <h1>Google Mapsの読み込みに失敗しました</h1>;
  }
  return <h1>{status}</h1>;
};

const GoogleMapSelect = () => {
  const [clicks, setClicks] = React.useState([]);
  const [zoom, setZoom] = React.useState(15); // 初期ズームレベルを15に設定
  const [center, setCenter] = React.useState({ lat: 35.0116, lng: 135.7681 }); // 初期位置を京都に設定

  /**
   * googleMap上でクリックすると、その緯度経度をセット
   * @param {*} e
   */
  const onClick = (e) => {
    setClicks([...clicks, e.latLng]);
  };

  /**
   * 地図の操作を停止するとZoomや緯度経度を保存
   * @param {*} m
   */
  const onIdle = (m) => {
    if (m.getCenter()) {
      setZoom(m.getZoom());
      setCenter(m.getCenter().toJSON());
    }
  };

  /**
   * 表示する地図の初期値を設定
   */
  const mapOptions = {
    center: { lat: 35.0116, lng: 135.7681 }, // 京都の位置に設定
    zoom: 15, // ズームレベルを15に設定
    styles: [
      // スタイルオプションを追加する場合はこちら
    ],
  };

  const form = (
    <div className="form-container">
      <label htmlFor="zoom">Zoom</label>
      <input
        type="number"
        id="zoom"
        name="zoom"
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
      <br />
      <label htmlFor="lat">Latitude</label>
      <input
        type="number"
        id="lat"
        name="lat"
        value={center.lat}
        onChange={(event) =>
          setCenter({ ...center, lat: Number(event.target.value) })
        }
      />
      <br />
      <label htmlFor="lng">Longitude</label>
      <input
        type="number"
        id="lng"
        name="lng"
        value={center.lng}
        onChange={(event) =>
          setCenter({ ...center, lng: Number(event.target.value) })
        }
      />
      <h3>
        {clicks.length === 0 ? "地図をクリックしてマーカーを追加" : "クリック"}
      </h3>
      {clicks.map((latLng, i) => (
        <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
      ))}
      <button onClick={() => setClicks([])}>クリア</button>
    </div>
  );

  return (
    <div className="container" style={{ display: "flex", height: "100vh" }}>
      {" "}
      {/* 高さを100vhに設定 */}
      <div className="map-title">地図の世界</div>
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        render={render}
      >
        <div className="content" style={{ width: "100%", height: "100%" }}>
          <Map
            options={mapOptions}
            onClick={onClick}
            onIdle={onIdle}
            zoom={zoom}
            center={center}
            style={{ width: "100%", height: "100%" }}
          >
            {clicks.map((latLng, i) => (
              <Marker key={i} position={latLng} />
            ))}
          </Map>
        </div>
      </Wrapper>
      {form}
    </div>
  );
};

const Map = ({
  onClick,
  onIdle,
  children,
  style,
  options,
  center,
  zoom,
  ...otherProps
}) => {
  const ref = React.useRef(null);
  const [map, setMap] = React.useState(null);

  React.useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, options); // 'google' を 'window.google' に変更
      setMap(newMap);
    }
  }, [ref, map, options]);

  React.useEffect(() => {
    if (map) {
      map.setOptions(options);
      if (center) {
        map.setCenter(center);
      }
      if (zoom) {
        map.setZoom(zoom);
      }
    }
  }, [map, options, center, zoom]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach(
        (eventName) => window.google.maps.event.clearListeners(map, eventName) // 'google' を 'window.google' に変更
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

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

const Marker = ({ position }) => {
  // 'options' から 'position' に修正
  const [marker, setMarker] = React.useState(null);

  React.useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker()); // 'google' を 'window.google' に変更
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setPosition(position); // 'options' から 'position' に修正
      marker.setMap(marker.getMap()); // 'marker' をマップに追加
    }
  }, [marker, position]);

  return null;
};

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
  if (
    isLatLngLiteral(a) ||
    a instanceof window.google.maps.LatLng || // 'google' を 'window.google' に変更
    isLatLngLiteral(b) ||
    b instanceof window.google.maps.LatLng // 'google' を 'window.google' に変更
  ) {
    return new window.google.maps.LatLng(a).equals(
      new window.google.maps.LatLng(b)
    ); // 'google' を 'window.google' に変更
  }
  return deepEqual(a, b);
});

function useDeepCompareMemoize(value) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(callback, dependencies) {
  React.useEffect(() => {
    callback();
  }, dependencies.map(useDeepCompareMemoize));
}

export default GoogleMapSelect;
