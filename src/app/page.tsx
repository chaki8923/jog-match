'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TrackerMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [tracking, setTracking] = useState(false);
  // const [position, setPosition] = useState<[number, number] | null>(null);
  const [lastPosition, setLastPosition] = useState<[number, number] | null>(null); // 前回の位置
  const [distance, setDistance] = useState(0); // 移動距離
  const [elapsedTime, setElapsedTime] = useState(0); // 経過時間
  // const [error, setError] = useState<string | null>(null);
  // 地球の半径（km）
  const EARTH_RADIUS = 6371;

  // Haversine formulaで2点間の距離を計算
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c; // 距離 (km)
  };


  useEffect(() => {
    let watchId: number | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    if (!mapRef.current) {
      // Map を初期化
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
    if (tracking) {
      const startTime = Date.now();

      // タイマーの開始
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); // 経過時間を秒単位で更新
      }, 1000);

      // 現在位置の追跡
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            // setPosition([latitude, longitude]); // 現在位置を更新

            // 前回位置が存在する場合、移動距離を計算
            if (lastPosition) {
              const delta = calculateDistance(
                lastPosition[0],
                lastPosition[1],
                latitude,
                longitude
              );
              setDistance((prev) => prev + delta); // 累積距離を更新
            }

            setLastPosition([latitude, longitude]); // 現在位置を前回位置に更新
          },
          (err) => {
            switch (err.code) {
              case err.PERMISSION_DENIED:
                alert('位置情報の利用が拒否されました。ブラウザ設定をご確認ください。');
                break;
              case err.POSITION_UNAVAILABLE:
                alert('位置情報が取得できません。');
                break;
              case err.TIMEOUT:
                alert('位置情報の取得がタイムアウトしました。');
                break;
              default:
                alert('位置情報の取得に失敗しました。');
            }
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert('このブラウザでは位置情報がサポートされていません。');
      }
    }

    return () => {
      if (timer) clearInterval(timer); // タイマーを停止
      if (watchId) navigator.geolocation.clearWatch(watchId); // 位置情報の追跡を停止
    };
  }, [tracking, lastPosition]);


  const handleStartStop = () => {
    if (tracking) {
      setTracking(false); // 停止

    } else {
      setDistance(0); // 距離リセット
      setElapsedTime(0); // 時間リセット
      setLastPosition(null); // 前回位置リセット
      setTracking(true); // 開始

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const newPos: [number, number] = [latitude, longitude];
            // setPosition(newPos);

            // 地図とマーカーの位置を更新
            if (mapRef.current) mapRef.current.setView(newPos, 15);
            if (markerRef.current) {
              markerRef.current.setLatLng(newPos);
            } else {
              // 初回だけマーカーを作成
              markerRef.current = L.marker(newPos).addTo(mapRef.current!);
            }
          },
          (err) => console.error("位置情報取得エラー:", err),
          { enableHighAccuracy: true }
        );
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
      {/* 地図コンテナ */}
      <div id="map" style={{ height: '90vh', width: '100%' }}></div>
    </div>
  );
};

export default TrackerMap;
