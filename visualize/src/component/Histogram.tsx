import React, { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";

type Props = {
    width: number;
    height: number;
    data: number[];
    binCount?: number;
};

function createBins(data: number[], binCount: number) {
    const min = Math.min(...data);
    const max = Math.max(...data);

    const binSize = (max - min) / binCount;

    const bins = Array.from({ length: binCount }, () => []);

    data.forEach((d) => {
        const index = Math.min(
            binCount - 1,
            Math.floor((d - min) / binSize)
        );
        bins[index].push(d);
    });

    return {
        bins,
        min,
        max,
    };
}

export default function Histogram({
    width,
    height,
    data,
    binCount = 10,
}: Props) {
    if (width < 10) return null;

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const { bins, min, max } = useMemo(
        () => createBins(data, binCount),
        [data, binCount]
    );

    const xScale = scaleLinear({
        domain: [0, bins.length],
        range: [0, xMax],
    });

    const yScale = scaleLinear({
        domain: [0, Math.max(...bins.map((b) => b.length))],
        range: [yMax, 0],
        nice: true,
    });

    const xAxisScale = scaleLinear({
        domain: [min, max],
        range: [0, xMax],
    });

    return (
        <svg width={width} height={height}>
            <Group left={margin.left} top={margin.top}>
                {bins.map((bin, i) => {
                    const barWidth = xMax / bins.length - 2;

                    return (
                        <>
                            <Bar
                                key={i}
                                x={xScale(i)}
                                y={yScale(bin.length)}
                                width={barWidth}
                                height={yMax - yScale(bin.length)}
                                fill="#6366f1"
                                rx={2}
                            />
                            <text
                                x={xScale(i) + barWidth / 2}
                                y={yScale(bin.length) - 6}
                                fontSize={10}
                                fill="#111827"
                                textAnchor="middle"
                            >
                                {bin.length}
                            </text>
                        </>
                    );
                })}

                <AxisBottom
                    top={yMax}
                    scale={xAxisScale}
                    numTicks={5}
                />

                <AxisLeft scale={yScale} numTicks={5} />
            </Group>
        </svg>
    );
}