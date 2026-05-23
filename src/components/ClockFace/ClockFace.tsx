import React, { useMemo } from 'react';
import type { Task } from '../../types';
import { timeToAngle, COLOR_MAP, formatRemaining } from '../../utils/constants';
import './ClockFace.css';

interface ClockFaceProps {
  tasks: Task[];
  currentTask: Task | null;
  currentTime: Date;
}

const CX = 50;
const CY = 50;
const OUTER_RADIUS = 44;
const ARC_THICKNESS = 8;

// 角度からSVGパスを生成（0度 = 上、時計回り）
const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const arcPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number): string => {
  // Normalize: handle overnight (e.g., 23:00 → 07:00)
  let end = endAngle;
  if (end <= startAngle) end += 360;
  // Clamp to max 359.99 to avoid full circle path issue
  if (end - startAngle >= 360) end = startAngle + 359.99;

  const start = polarToCartesian(cx, cy, r, startAngle);
  const endPt = polarToCartesian(cx, cy, r, end);
  const largeArc = end - startAngle > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${endPt.x} ${endPt.y}`;
};

// Hour marker positions
const HOUR_LABELS = [0, 3, 6, 9, 12, 15, 18, 21];

const ClockFace: React.FC<ClockFaceProps> = ({ tasks, currentTask, currentTime }) => {
  const currentAngle = timeToAngle(currentTime.getHours(), currentTime.getMinutes());

  // Group today's tasks for rendering
  const todayStr = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(2, '0')}`;
  const todayTasks = tasks.filter(
    (t) => t.date === todayStr && t.startTime && t.endTime
  );

  // Compute arc layers to handle overlaps
  // Simple approach: stack by order
  const arcs = useMemo(() => {
    return todayTasks.map((task, index) => {
      const start = timeToAngle(...(task.startTime!.split(':').map(Number) as [number, number]));
      const endHour = parseInt(task.endTime!.split(':')[0]);
      const endMin = parseInt(task.endTime!.split(':')[1]);
      const end = timeToAngle(endHour, endMin);
      const color = COLOR_MAP[task.color]?.hex ?? '#9CA3AF';
      // Layer offset: each overlapping task gets a slightly different radius
      const layerR = OUTER_RADIUS - (index % 3) * (ARC_THICKNESS + 1);
      return { task, start, end, color, layerR };
    });
  }, [todayTasks]);

  // Seeker needle endpoint
  const needleEnd = polarToCartesian(CX, CY, OUTER_RADIUS - 4, currentAngle);
  const needleStart = polarToCartesian(CX, CY, 10, currentAngle);

  return (
    <section className="clock-section" aria-label="24時間時計">
      <div className="clock-wrapper">
        <svg
          className="clock-svg"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {/* Background ring */}
          <circle
            cx={CX}
            cy={CY}
            r={OUTER_RADIUS}
            fill="none"
            stroke="rgba(82,69,53,0.25)"
            strokeWidth="0.5"
          />

          {/* Inner rings */}
          <circle cx={CX} cy={CY} r={OUTER_RADIUS - ARC_THICKNESS - 1} fill="none" stroke="rgba(82,69,53,0.12)" strokeWidth="0.3" />
          <circle cx={CX} cy={CY} r={22} fill="none" stroke="rgba(82,69,53,0.1)" strokeWidth="0.3" />

          {/* Hour tick marks */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * 360;
            const inner = polarToCartesian(CX, CY, OUTER_RADIUS - ARC_THICKNESS - 2, angle);
            const outer = polarToCartesian(CX, CY, OUTER_RADIUS + 1, angle);
            const isMajor = i % 3 === 0;
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={isMajor ? 'rgba(214,195,176,0.4)' : 'rgba(214,195,176,0.15)'}
                strokeWidth={isMajor ? 0.5 : 0.25}
              />
            );
          })}

          {/* Hour labels */}
          {HOUR_LABELS.map((h) => {
            const angle = (h / 24) * 360;
            const pos = polarToCartesian(CX, CY, OUTER_RADIUS + 5, angle);
            return (
              <text
                key={h}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="3.5"
                fill="rgba(214,195,176,0.5)"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
              >
                {h}
              </text>
            );
          })}

          {/* Task arcs */}
          {arcs.map(({ task, start, end, color, layerR }) => (
            <path
              key={task.id}
              d={arcPath(CX, CY, layerR, start, end)}
              fill="none"
              stroke={color}
              strokeWidth={ARC_THICKNESS}
              strokeLinecap="round"
              opacity={task.status === '完了' ? 0.25 : task.status === '進行中' ? 0.85 : 0.5}
            />
          ))}

          {/* Current time seeker */}
          {/* Glow effect */}
          <line
            x1={needleStart.x}
            y1={needleStart.y}
            x2={needleEnd.x}
            y2={needleEnd.y}
            stroke="rgba(255,185,90,0.2)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={needleStart.x}
            y1={needleStart.y}
            x2={needleEnd.x}
            y2={needleEnd.y}
            stroke="#ffb95a"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Dot at tip */}
          <circle
            cx={needleEnd.x}
            cy={needleEnd.y}
            r="2"
            fill="#ffd7a9"
            style={{ filter: 'drop-shadow(0 0 3px rgba(255,185,90,0.9))' }}
          />

          {/* Center dot */}
          <circle cx={CX} cy={CY} r="3" fill="var(--color-surface-container-high)" stroke="var(--color-surface-bright)" strokeWidth="0.5" />
          <circle cx={CX} cy={CY} r="1.5" fill="var(--color-primary)" />
        </svg>

        {/* Center overlay: current activity */}
        <div className="clock-center">
          {currentTask ? (
            <div className="clock-center__activity">
              <span className="clock-center__now">NOW</span>
              <span className="clock-center__name">{currentTask.name}</span>
              {currentTask.endTime && (
                <span className="clock-center__remaining">
                  {formatRemaining(currentTask.endTime)}
                </span>
              )}
            </div>
          ) : (
            <div className="clock-center__idle">
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-on-surface-variant)', opacity: 0.5 }}>
                schedule
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Current task pill below clock */}
      {currentTask && (
        <div className="clock-current-pill" style={{ borderColor: COLOR_MAP[currentTask.color]?.hex }}>
          <div className="clock-current-pill__bar" style={{ background: COLOR_MAP[currentTask.color]?.hex }} />
          <div className="clock-current-pill__content">
            <span className="text-label-sm" style={{ color: COLOR_MAP[currentTask.color]?.hex }}>今やること</span>
            <span className="text-title-lg">{currentTask.name}</span>
            {currentTask.startTime && currentTask.endTime && (
              <span className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                {currentTask.startTime} → {currentTask.endTime}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ClockFace;
