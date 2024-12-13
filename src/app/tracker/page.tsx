"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDistance } from "geolib";

export default function JoggingTracker() {
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (tracking) {
      setStartTime(Date.now());
      timer = setInterval(() => {
        if (startTime) {
          setElapsedTime((Date.now() - startTime) / 1000);
        }
      }, 1000);

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates((prev) => {
            if (prev.length > 0) {
              const lastCoords = prev[prev.length - 1];
              const newDistance = getDistance(lastCoords, newCoords);
              setDistance((d) => d + newDistance);
            }
            return [...prev, newCoords];
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => {
        if (timer) clearInterval(timer);
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [tracking, startTime]);

  const startTracking = () => {
    setTracking(true);
    setDistance(0);
    setCoordinates([]);
  };

  const stopTracking = () => {
    setTracking(false);
    alert("お疲れ様٩( ᐛ )و")
  };

  return (
    <div>
      <h1>ジョギングトラッカー</h1>
      <p>距離: {(distance / 1000).toFixed(2)} km</p>
      <p>時間: {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}</p>
      <button onClick={tracking ? stopTracking : startTracking}>
        {tracking ? "ストップ" : "スタート"}
      </button>
      <div style={{ height: "300px", marginTop: "20px" }}>
        <MapContainer
          center={[35.6895, 139.6917]} // 東京都の座標
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline
            positions={coordinates.map((coord) => [coord.latitude, coord.longitude])}
            color="blue"
          />
        </MapContainer>
      </div>
    </div>
  );
}
