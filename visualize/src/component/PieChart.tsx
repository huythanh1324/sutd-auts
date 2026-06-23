import React, { useState } from 'react'
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { LegendOrdinal } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";
import getClusterProfile from "../common/ClusterProfile.js"
import colors from "../constant/colors"

const PieChart = ({
  clusterData,
  selectedFirstCluster,
  selectedSecondCluster,
  setSelectedFirstCluster,
  setSelectedSecondCluster,
}) => {
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;
  const [tooltip, setTooltip] = useState(null);
  const data = Object.values(clusterData).map((cluster) => ({
    id: cluster.cluster_id,
    label: getClusterProfile(`Cluster ${cluster.cluster_id}`),
    value: cluster.pct_of_total,
    dominant: cluster.dominant,
    members: cluster.n_members,
  }));

  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.label),
    range: colors,
  });

  const firstId = selectedFirstCluster?.cluster_id;
  const secondId = selectedSecondCluster?.cluster_id;

  return (
    <div className='flex gap-l'>
      <svg width={width} height={height}>
        <Group top={height / 2} left={width / 2}>
          <Pie
            data={data}
            pieValue={(d) => d.value}
            outerRadius={radius}
            innerRadius={100}
          >
            {(pie) =>
              pie.arcs.map((arc, index) => {
                const isFirst = arc.data.id === firstId;
                const isSecond = arc.data.id === secondId;

                let stroke = '#fff';
                let strokeWidth = 1;
                let className = '';

                if (isFirst && isSecond) {
                  className = 'pie-slice--selected-both';
                  stroke = '#635bff';
                  strokeWidth = 3;
                } else if (isFirst) {
                  className = 'pie-slice--selected-a';
                  stroke = '#635bff';
                  strokeWidth = 3;
                } else if (isSecond) {
                  className = 'pie-slice--selected-b';
                  stroke = '#f59e0b';
                  strokeWidth = 3;
                }

                return (
                  <path
                    key={arc.data.id}
                    d={pie.path(arc)}
                    fill={colors[index % colors.length]}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    className={className}
                    onMouseMove={(e) => {
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        data: arc.data,
                      });
                    }}
                    onClick={() => {
                      setSelectedFirstCluster(clusterData[index]);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedSecondCluster(clusterData[index]);
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      cursor: 'pointer',
                      transition: 'stroke 0.15s ease, stroke-width 0.15s ease',
                    }}
                  />
                );
              })
            }
          </Pie>
        </Group>
      </svg>

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            background: '#111827',
            color: 'white',
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 13,
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ fontWeight: 600 }}>{tooltip.data.label}</div>
          <div>{tooltip.data.value}% of total</div>
          <div>{tooltip.data.members.toLocaleString()} members</div>
          <div style={{ marginTop: 6 }}>
            <strong>Dominant:</strong>
            <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
              {tooltip.data.dominant.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <LegendOrdinal
        scale={colorScale}
        direction="column"
        labelMargin="0 0 0 8px"
      />
    </div>
  );
};

export default PieChart;
