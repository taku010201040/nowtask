import React from 'react';
import './CurrentTimeDisplay.css';

interface CurrentTimeDisplayProps {
  currentTime: Date;
  subtitle?: string;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const CurrentTimeDisplay: React.FC<CurrentTimeDisplayProps> = ({ currentTime, subtitle }) => {
  const h = String(currentTime.getHours()).padStart(2, '0');
  const m = String(currentTime.getMinutes()).padStart(2, '0');
  const month = currentTime.getMonth() + 1;
  const day = currentTime.getDate();
  const weekday = WEEKDAYS[currentTime.getDay()];

  return (
    <section className="time-display" aria-label="現在時刻">
      <div className="time-display__date text-label-lg">
        {month}月{day}日（{weekday}）
      </div>
      <div className="time-display__clock" aria-live="polite" aria-atomic="true">
        <span className="time-display__hours">{h}</span>
        <span className="time-display__colon">:</span>
        <span className="time-display__minutes">{m}</span>
      </div>
      {subtitle && (
        <p className="time-display__subtitle text-body-md">
          {subtitle}
        </p>
      )}
    </section>
  );
};

export default CurrentTimeDisplay;
