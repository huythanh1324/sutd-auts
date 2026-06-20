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

const CombinedRadialBar = ({ selectedFirstCluster, selectedSecondCluster }) => {

    const dataFirstCluster = Object.entries(
        selectedFirstCluster.activity_proportions
    ).map(([activity, proportion]) => ({
        activity,
        proportion,
    }));

    const dataSecondCluster = Object.entries(
        selectedSecondCluster.activity_proportions
    ).map(([activity, proportion]) => ({
        activity,
        proportion,
    }));

    const centerX = width / 2;
    const centerY = height / 2;

    const innerRadius = 60;
    const maxOuterRadius = 180;



    const radiusScale = scaleLinear({
        domain: [0, Math.max(...dataFirstCluster.map((d) => d.proportion), ...dataSecondCluster.map((d) => d.proportion))],
        range: [innerRadius, maxOuterRadius],
    });

    const angleStep = (2 * Math.PI) / dataFirstCluster.length;
    const gap = 0.05; // radians


    const colorScale = scaleOrdinal({
        domain: dataFirstCluster.map((d) => d.activity),
        range: activityColors,
    });
    return (
        <div className='flex'>
            <svg width={width} height={height}>
                <g transform={`translate(${centerX}, ${centerY})`}>
                    {dataFirstCluster.map((d, i) => {
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
                                    opacity={0.5}
                                    innerRadius={innerRadius}
                                    outerRadius={outerRadius}
                                    startAngle={startAngle}
                                    endAngle={endAngle}
                                    fill={activityColors[i]}
                                />
                            </g>
                        );
                    })}

                    {dataSecondCluster.map((d, i) => {
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
                                    opacity={0.5}
                                    innerRadius={innerRadius}
                                    outerRadius={outerRadius}
                                    startAngle={startAngle}
                                    endAngle={endAngle}
                                    fill={activityColors[i]}
                                />
                            </g>
                        );
                    })}
                </g>
            </svg>
            {/* <LegendOrdinal
                scale={colorScale}
                direction="column"
                labelMargin="0 0 0 8px"
            /> */}
        </div>
    );
}

export default CombinedRadialBar;