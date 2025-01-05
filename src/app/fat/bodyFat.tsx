'use client';
import React, { useState } from 'react';
import Modal from './resultModal';
import styles from './index.module.scss';

const BodyFatCalculator = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male'); // 性別
  const [age, setAge] = useState<string>(''); // 年齢
  const [height, setHeight] = useState<string>(''); // 身長 (cm)
  const [weight, setWeight] = useState<string>(''); // 体重 (kg)
  const [bmi, setBmi] = useState<number | null>(null); // BMI
  const [bodyFat, setBodyFat] = useState<number | null>(null); // 体脂肪率 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateBodyFat = () => {
    if(!height || !weight) {
      alert("必要事項を入力してね");
      return;
    }
    // 身長をメートルに変換
    const heightInMeters = Number(height) / 100;

    // BMI の計算
    const bmiValue = (1.3 * Number(weight)) / Math.pow(heightInMeters, 2.5);
    setBmi(bmiValue);

    // 体脂肪率の計算
    const base = 3.02 + (0.461 * Number(weight)) - (0.089 * Number(height)) + (0.038 * Number(age)) - 0.238;

    const bodyFatPercentage =
      gender === 'male'
        ? ((base - (6.85 * 1)) / Number(weight)) * 100 // 男性の場合
        : (base / Number(weight)) * 100; // 女性の場合

    setBodyFat(bodyFatPercentage);
    // モーダルを表示
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">体脂肪率計算フォーム</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateBodyFat();
        }}
        className="space-y-4"
      >
        {/* 性別 */}
        <div>
          <label className="block font-medium">性別:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            className={`border rounded px-3 py-2 ${styles.input}`}
          >
            <option  value="male">男性</option>
            <option  value="female">女性</option>
          </select>
        </div>

        {/* 年齢 */}
        <div>
          <label className="block font-medium">年齢:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={`border rounded px-3 py-2 w-full ${styles.input}`}
          />
        </div>

        {/* 身長 */}
        <div>
          <label className="block font-medium">身長 (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={`border rounded px-3 py-2 w-full ${styles.input}`}
          />
        </div>

        {/* 体重 */}
        <div>
          <label className="block font-medium">体重 (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={`border rounded px-3 py-2 w-full ${styles.input}`}
          />
        </div>

        {/* 計算ボタン */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          計算
        </button>
      </form>

      {/* 結果表示 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={`BMI: ${bmi?.toFixed(2)}, 体脂肪率: ${bodyFat?.toFixed(2)}%`}
      />
    </div>
  );
};

export default BodyFatCalculator;
