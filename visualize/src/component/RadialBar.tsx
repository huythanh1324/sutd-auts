import React, { Activity } from 'react';
import { Arc } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import activityColors from "../constant/activityColor"
import { scaleOrdinal } from "@visx/scale";
import { LegendOrdinal } from "@visx/legend";


type Datum = {
    label: string;
    value: number;
};

const width = 500;
const height = 500;

const RadialBar = ({ selectedCluster }) => {

    const data = Object.entries(
        selectedCluster.activity_proportions
    ).map(([activity, proportion]) => ({
        activity,
        proportion,
    }));

    const centerX = width / 2;
    const centerY = height / 2;

    const innerRadius = 60;
    const maxOuterRadius = 180;



    const radiusScale = scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.proportion))],
        range: [innerRadius, maxOuterRadius],
    });

    const angleStep = (2 * Math.PI) / data.length;
    const gap = 0.05; // radians


    const colorScale = scaleOrdinal({
        domain: data.map((d) => d.activity),
        range: activityColors,
    });
    return (
        <div className='flex'>
            <svg width={width} height={height}>
                <g transform={`translate(${centerX}, ${centerY})`}>
                    {data.map((d, i) => {
                        const startAngle = i * angleStep + gap / 2;
                        const endAngle = (i + 1) * angleStep - gap / 2;

                        const outerRadius = radiusScale(d.proportion);

                        const midAngle = (startAngle + endAngle) / 2;

                        const labelRadius = outerRadius + 25;

                        const x =
                            Math.cos(midAngle - Math.PI / 2) * labelRadius;

                        const y =
                            Math.sin(midAngle - Math.PI / 2) * labelRadius;

                        return (
                            <g key={d.activity}>
                                <Arc
                                    innerRadius={innerRadius}
                                    outerRadius={outerRadius}
                                    startAngle={startAngle}
                                    endAngle={endAngle}
                                    fill={activityColors[i]}
                                />

                                {/* <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={11}
                                >
                                {d.activity}
                                </text> */}

                                {/* <text
                                x={x}
                                y={y + 14}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={10}
                                fill="#666"
                                >
                                {(d.proportion * 24).toFixed(1)}h
                                </text> */}
                            </g>
                        );
                    })}
                </g>
            </svg>
            <LegendOrdinal
                scale={colorScale}
                direction="column"
                labelMargin="0 0 0 8px"
            />
        </div>
    );
}

export default RadialBar;