'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Map, Marker } from 'leaflet'; // Leaflet の型をインポート
import { Session } from "@auth/core/types";
import axios from 'axios'
import {User} from '@/types/user';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image'
import styles from '../tracking/index.module.scss';
import { BrowserRouter } from 'react-router-dom';
import Counting from './progress/circle';
import { ConfirmModal } from './modal/confirm';

export default function TrackerMap({ session }: { session: Session }) {
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); // タイマーを useRef で管理
  const [tracking, setTracking] = useState(false);
  const [lastPosition, setLastPosition] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);;
  const EARTH_RADIUS = 6371;

  const handleChangeConfirmed = async () => {
    console.log("user情報", user!.email);
    setIsShowModal(false);

    try {
      const userId = user!.id
      const runTime = elapsedTime - 3;
      const response = await axios.post('/api/userRecord/', {
        userId,
        runTime,
        distance
      })

      // 成功時の処理
      console.log('Record created:', response.data)
    } catch (error) {
      // エラー処理
      console.error('Error creating record', error)
    }
  }

  const findUser = async() => {
    if(user) return;
    console.log("ユーザー取得");
    
    try {
      const email = session.user!.email
      const response = await axios.get('/api/user/', {
        params: { email: email } // クエリパラメータとして送信
      })

      setUser(response.data)
    } catch (error) {
      // エラー処理
      console.error('Error creating record', error)
    }
  }
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

  const handleStartStop = async () => {
    if (tracking) {
      setTracking(false);
      setIsShowModal(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

    } else {
      setTracking(true);
      setDistance(distance);
      setElapsedTime(elapsedTime);
      setLastPosition(lastPosition);
      setIsShowModal(false);

      findUser();
      console.log("user", user);
      
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(() => {
          const newTime = Math.floor((Date.now() - startTime) / 1000);
          // alert(`セット時間: ${newTime}`); // newTimeを使用
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
              // markerRef.current = L.marker(newPos).addTo(mapRef.current!);
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
    <>
      <Image src={`${user ? user.image : "/defaultUser.png"}`}
            width={50}
            height={50}
            alt="Picture of the author"/>
      {tracking && (
        <BrowserRouter>
          <Counting tracking={tracking} />
        </BrowserRouter>
      )}
      <div>
        <div className={styles.flex}>
          <div style={{ padding: '10px' }}>
            <p>移動距離: {distance.toFixed(2)} km</p>
            {elapsedTime > 3 && (
              <p>経過時間: {Math.floor(elapsedTime / 60)}分 {(elapsedTime % 60) - 3}秒</p>
            )}
          </div>
          <Image
            src="/jog_match.webp"
            width={100}
            height={5}
            alt="Picture of the author"
          />
        </div>
        <div id="map" style={{ height: '90vh', width: '100%' }}></div>
      </div>
      {(!tracking || elapsedTime > 3) && (
        <div className={`${styles.btnEngineStart} ${tracking ? styles.btnEngineOn : styles.btnEngineOff}`} onClick={handleStartStop}>
          <button className={`${styles.btn} ${styles.btnEngineStartIn} ${tracking ? styles.EngineOn : styles.EngineOff}`}>{tracking ? 'STOP' : 'START'} <br /><span>RUNNING</span> </button>
        </div>
      )}
      {isShowModal && (
        <ConfirmModal handleChangeConfirmed={handleChangeConfirmed} />
      )}
    </>
  );
};

