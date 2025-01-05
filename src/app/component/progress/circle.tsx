
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./index.module.scss";

type CountingProps = {
  tracking: boolean; // tracking の型が boolean である場合
};

const Counting = (props: CountingProps) => {
  const [progressPercent, setProgressPercent] = useState(0);
  const [count, setCount] = useState(3);
  const radius = 100; // radius of the circle
  const circumference = 2 * Math.PI * radius;
  const navigate = useNavigate();
  
  useEffect(() => {
    const progressCircle = document.querySelector(".progress") as SVGCircleElement;;
    if(!progressCircle || !props.tracking){
      return
    }
    // Set initial styles
    progressCircle!.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle!.style.transition = 'stroke-dashoffset 0.5s ease-in-out'; // Smooth transition

    const progressInterval = setInterval(() => {
      if (count === 1) {
        clearInterval(progressInterval);
        setProgressPercent(100);
      } else {
        const newPercent = (4 - count) * 33.33;
        setProgressPercent(newPercent);        
        progressCircle!.style.strokeDashoffset = `${circumference - (newPercent / 100) * circumference}`;
      }
      if (count === 0) {
        clearInterval(progressInterval);
        navigate('/tracking'); // Redirect to '/other' route when countdown completes
      }
      setCount(prevCount => prevCount - 1);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
    };
  }, [count, circumference, navigate]);

  return (
    count > -1 && (
    <div className={`${styles.centerCard} ${count < 0 ? styles.none: ''}`}>
      <div className='countdown-circle'>
        <svg width="250" height="250">
          {/* Background track circle */}
          <circle r="100" cx="125" cy="125" className="track" style={{ fill: 'rgba(0,0,0,0.3)' }}></circle>
          {/* Progress circle */}
          <circle r="100" cx="125" cy="125" className="progress" style={{ fill: 'none', stroke: '#fff', strokeWidth: "10px", strokeDashoffset: `calc(${circumference} - (${progressPercent} / 100) * ${circumference})` }} ></circle>
          {/* Countdown text */}
          <text x="50%" y="50%" style={{ transform: "none", fill: '#fff', fontSize: '60px', fontWeight: "bold" }} dominantBaseline="middle" textAnchor="middle" className="progress-text">{count > 0 ? count : "start!"}</text>
        </svg>
      </div>
    </div>
    )
  );
}

export default Counting;