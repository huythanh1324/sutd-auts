import React, { useState } from 'react';
import { Arc } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import activityColors from "../constant/activityColor";

type Datum = {
  label: string;
  value: number;
};

const width = 500;
const height = 500;

const RadialBar = ({ selectedCluster }) => {
  const [hovered, setHovered] = useState<{ activity: string; proportion: number } | null>(null);

  const cx = width / 2;
  const cy = height / 2;
  const innerRadius = 80;
  const maxRadius = Math.min(width, height) / 2 - 20;

  const entries = Object.entries(selectedCluster.activity_proportions) as [string, number][];
  const maxProportion = Math.max(...entries.map(([, v]) => v));

  const radiusScale = scaleLinear({
    domain: [0, maxProportion],
    range: [innerRadius, maxRadius],
  });

  const angleStep = (2 * Math.PI) / entries.length;
  const gap = 0.04;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${cx}, ${cy})`}>
        {entries.map(([activity, proportion], i) => {
          const startAngle = i * angleStep + gap / 2;
          const endAngle   = (i + 1) * angleStep - gap / 2;
          const outerRadius = radiusScale(proportion);
          const isHovered = hovered?.activity === activity;

          return (
            <g
              key={activity}
              onMouseEnter={() => setHovered({ activity, proportion })}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <Arc
                innerRadius={innerRadius}
                outerRadius={isHovered ? outerRadius + 8 : outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={activityColors[i]}
                style={{ transition: 'all 0.15s ease' }}
              />
            </g>
          );
        })}

        {/* Centre label on hover */}
        {hovered && (
          <text
            x={0} y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ pointerEvents: 'none' }}
          >
            <tspan x={0} dy={-10} fontSize={13} fontWeight={600} fill="#0a2540">
              {hovered.activity}
            </tspan>
            <tspan x={0} dy={22} fontSize={13} fill="#425466">
              {(hovered.proportion * 24).toFixed(2)} hrs
            </tspan>
          </text>
        )}

        {/* Idle centre label */}
        {!hovered && (
          <text x={0} y={0} textAnchor="middle" dominantBaseline="middle">
            <tspan x={0} dy={-8} fontSize={12} fill="#8898aa" fontWeight={500}>
              Hover arc
            </tspan>
            <tspan x={0} dy={18} fontSize={11} fill="#c4cdd8">
              for details
            </tspan>
          </text>
        )}
      </g>
    </svg>
  );
};

export default RadialBar;
