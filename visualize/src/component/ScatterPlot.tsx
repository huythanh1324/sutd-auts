import React, { useMemo, useState } from 'react'
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { LegendOrdinal } from "@visx/legend";
import { AxisBottom, AxisLeft } from "@visx/axis";
import ScatterPlotData from "../data/clusters/output.json";
import colors from '../constant/colors';
import getClusterProfile from "../common/ClusterProfile.js"

const width = 800;
const height = 500;
const margin = 40;

const numericFields = [
    "age",
    "education",
    "Sleep",
    "TV/Screen",
    "Exercise",
    "Work (main)",
    "Work (other)",
    "Eating/Drinking",
    "Grooming/Self-care",
    "Housework",
    "Food Prep",
    "Home Maintenance",
    "Childcare",
    "Adult Care",
    "Education",
    "Shopping",
    "Professional Services",
    "Household Services",
    "Civic/Government",
    "Socializing (family)",
    "Socializing (friends)",
    "Leisure/Relaxing",
    "Arts/Entertainment",
    "Religious/Volunteer",
    "Phone/Communication",
    "Travel",
    "Other",
];

const ScatterPlot = () => {
    const [xField, setXField] = useState<string>("Sleep");
    const [yField, setYField] = useState<string>("Work (main)");
    const clusters = [
        "cluster_00",
        "cluster_01",
        "cluster_02",
        "cluster_03",
        "cluster_04",
        "cluster_05",
        "cluster_06",
        "cluster_07",
        "cluster_08",
        "cluster_09",
        "cluster_10",
        "cluster_11",
        "cluster_12",
        "cluster_13",
        "cluster_14",
        "cluster_15",
        "cluster_16",
        "cluster_17",
        "cluster_18",
        "cluster_19",
    ]
    const plotData = useMemo(() => ScatterPlotData.map(d => ({
        x: d[xField],
        y: d[yField],
        cluster: d["cluster"]
    })), [xField, yField]);

    const xScale = useMemo(() =>
        scaleLinear({
            domain: [0, Math.max(...plotData.map(d => +d.x))],
            range: [margin, width - margin],
        }), [plotData, xField]
    );
    const yScale = useMemo(() =>
        scaleLinear({
            domain: [0, Math.max(...plotData.map(d => +d.y))],
            range: [height - margin, margin],
        }), [plotData, yField]
    );

    const colorScale = scaleOrdinal({
        domain: clusters,
        range: colors,
    });
    return (
        <>
            <div style={{ marginBottom: 10 }}>
                <label>X:</label>
                <select value={xField} onChange={e => setXField(e.target.value)}>
                    {numericFields.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>

                <label style={{ marginLeft: 10 }}>Y:</label>
                <select value={yField} onChange={e => setYField(e.target.value)}>
                    {numericFields.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
            </div>
            <div className='flex'>
                <svg width={width} height={height}>
                    <Group>
                        <AxisBottom
                            top={height - margin}
                            scale={xScale}
                        />

                        <AxisLeft
                            left={margin}
                            scale={yScale}
                        />
                        {plotData.map((d, i) => (
                            <circle
                                key={i}
                                cx={xScale(d.x)}
                                cy={yScale(d.y)}
                                r={5}
                                fill={colorScale(d.cluster)}
                                style={{
                                    opacity: 0,
                                    animation: "fadeIn 0.6s ease forwards",
                                }}
                            />
                        ))}
                    </Group>
                </svg >

                <LegendOrdinal
                    scale={colorScale}
                    direction="column"
                    labelMargin="0 0 0 8px"
                />
            </div>
        </>

    )
}

export default ScatterPlot