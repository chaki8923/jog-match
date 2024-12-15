'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Map, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const TrackerMap = () => {
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null); // 開始時間を追跡するref

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

  // タイマー管理用の関数
  const startTimer = () => {
    // 既存のタイマーがあれば停止
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 開始時間を記録
    startTimeRef.current = Date.now();

    // 新しいタイマー開始
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
  };

  useEffect(() => {
    // 初期マップ設定
    if (typeof window !== 'undefined') {
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
    }

    // コンポーネントのクリーンアップ
    return () => {
      stopTimer();
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleStartStop = () => {
    if (tracking) {
      // 追跡停止
      setTracking(false);
      stopTimer();

      // 位置情報の追跡を停止
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    } else {
      // 追跡開始
      setTracking(true);
      setDistance(0);
      setElapsedTime(0);
      setLastPosition(null);

      // タイマー開始
      startTimer();

      // 位置情報追跡
      if (navigator.geolocation) {
        // 最初の位置を取得
        navigator.geolocation.getCurrentPosition(
          (initialPos) => {
            const { latitude, longitude } = initialPos.coords;
            const initialPosition: [number, number] = [latitude, longitude];

            // マップ初期位置設定
            if (mapRef.current) {
              mapRef.current.setView(initialPosition, 15);
            }

            // マーカー設定
            if (markerRef.current) {
              markerRef.current.setLatLng(initialPosition);
            } else {
              markerRef.current = L.marker(initialPosition).addTo(mapRef.current!);
            }

            // 継続的な位置追跡
            watchIdRef.current = navigator.geolocation.watchPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                const newPos: [number, number] = [latitude, longitude];
                
                // 最初の位置または前回の位置との距離計算
                if (lastPosition) {
                  const delta = calculateDistance(
                    lastPosition[0],
                    lastPosition[1],
                    latitude,
                    longitude
                  );
                  setDistance((prev) => prev + delta);
                }

                // 位置更新
                setLastPosition(newPos);

                // マップとマーカーの更新
                if (mapRef.current) mapRef.current.setView(newPos, 15);
                if (markerRef.current) {
                  markerRef.current.setLatLng(newPos);
                }
              },
              (err) => {
                console.error('位置情報取得エラー:', err);
                alert('位置情報の取得に失敗しました');
                setTracking(false);
              },
              { 
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000 // タイムアウトを延長
              }
            );
          },
          (err) => {
            console.error('初期位置取得エラー:', err);
            alert('初期位置の取得に失敗しました');
            setTracking(false);
          },
          { 
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000 
          }
        );
      } else {
        alert('位置情報が利用できません');
        setTracking(false);
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