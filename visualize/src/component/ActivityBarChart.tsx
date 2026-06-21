import React from 'react'
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Bar } from "@visx/shape";
import getClusterProfile from "../common/ClusterProfile.js"

const ActivityBarChart = ({ selectedCluster }) => {
    const width = 550;
    const height = 600;

    const margin = {
        top: 20,
        right: 40,
        bottom: 40,
        left: 180,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = Object.entries(selectedCluster.activity_proportions).map(
        ([activity, proportion]) => ({
            activity,
            proportion,
        })
    );

    const yScale = scaleBand({
        domain: data.map((d) => d.activity),
        range: [0, innerHeight],
        padding: 0.2,
    });

    const xScale = scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.proportion))],
        range: [0, innerWidth],
    });

    return (
        <div >
            <h4 className='text-center m-0'>{getClusterProfile(`Cluster ${selectedCluster.cluster_id}`)}</h4>
            <svg width={width} height={height}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {data.map((d) => {
                        const barWidth = xScale(d.proportion);
                        const barY = yScale(d.activity);
                        const hours = d.proportion * 24
                        return (
                            <g key={d.activity}>
                                <Bar
                                    className="bar"
                                    x={0}
                                    y={barY}
                                    width={barWidth}
                                    height={yScale.bandwidth()}
                                    fill="#4f46e5"
                                />

                                {/* Value label */}
                                <text
                                    x={barWidth + 8}
                                    y={barY + yScale.bandwidth() / 2}
                                    dy="0.35em"
                                    fontSize={12}
                                    fill="#333"
                                >
                                    {hours.toFixed(2)} hrs
                                </text>
                            </g>
                        );
                    })}

                    <AxisLeft
                        scale={yScale}
                        tickValues={data.map((d) => d.activity)}
                    />

                    <AxisBottom
                        top={innerHeight}
                        scale={xScale}
                        tickFormat={(v) => `${(v * 24).toFixed(0)}`}
                    />
                </g>
            </svg>
        </div>
    );
};

export default ActivityBarChart;