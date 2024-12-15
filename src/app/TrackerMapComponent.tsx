'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Map, Marker } from 'leaflet'; // Leaflet の型をインポート
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const TrackerMap = () => {
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); // タイマーを useRef で管理
  const [tracking, setTracking] = useState(false);
  const [lastPosition, setLastPosition] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const EARTH_RADIUS = 6371;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
  };

  useEffect(() => {
    let L: typeof import('leaflet'); // Leaflet の型宣言

    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        L = leaflet;

        if (!mapRef.current) {
          mapRef.current = L.map('map').setView([35.6895, 139.6917], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mapRef.current);

          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });
        }

        // 現在地の取得
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              const initialPosition: [number, number] = [latitude, longitude];
              // setLastPosition(initialPosition);

              if (mapRef.current) mapRef.current.setView(initialPosition, 15);
              if (markerRef.current) {
                markerRef.current.setLatLng(initialPosition);
              } else {
                markerRef.current = L.marker(initialPosition).addTo(mapRef.current!);
              }
            },
            (err) => {
              console.error('現在地の取得に失敗しました:', err);
              alert('現在地の取得に失敗しました。デフォルト位置を使用します。');
            },
            { enableHighAccuracy: true }
          );
        } else {
          alert('このブラウザでは位置情報がサポートされていません。');
        }
      });
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStartStop = () => {
    if (tracking) {
      setTracking(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {      
      setTracking(true);
      setDistance(0);
      setElapsedTime(0);
      setLastPosition(null);

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(() => {
          const newTime = Math.floor((Date.now() - startTime) / 1000);
          alert(`セット時間: ${newTime}`); // newTimeを使用
          return newTime;
        });
      }, 1000);

      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const newPos: [number, number] = [latitude, longitude];
            
            if (lastPosition) {
              const delta = calculateDistance(
                lastPosition[0],
                lastPosition[1],
                latitude,
                longitude
              );
              setDistance((prev) => prev + delta);
            }

            setLastPosition(newPos);

            if (mapRef.current) mapRef.current.setView(newPos, 15);
            if (markerRef.current) {
              markerRef.current.setLatLng(newPos);
            } else {
              markerRef.current = L.marker(newPos).addTo(mapRef.current!);
            }
          },
          (err) => console.error('位置情報取得エラー:', err),
          { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
      }
    }
  };

  return (
    <div>
      <div style={{ padding: '10px' }}>
        <p>移動距離: {distance.toFixed(2)} km</p>
        <p>経過時間: {Math.floor(elapsedTime / 60)}分 {elapsedTime % 60}秒</p>
        <button
          onClick={handleStartStop}
          style={{
            padding: '10px 20px',
            backgroundColor: tracking ? 'red' : 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {tracking ? '停止' : '開始'}
        </button>
      </div>
      <div id="map" style={{ height: '90vh', width: '100%' }}></div>
    </div>
  );
};

export default TrackerMap;
