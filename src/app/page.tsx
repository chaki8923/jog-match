'use client';

import dynamic from 'next/dynamic';

// TrackerMap コンポーネントを遅延ロードし、SSR を無効化
const TrackerMap = dynamic(() => import('./TrackerMapComponent'), { ssr: true });

export default TrackerMap;