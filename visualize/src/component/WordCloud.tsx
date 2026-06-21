import { Wordcloud } from '@visx/wordcloud';
import activityOverview from "../data/overview/atus_activity_sums.json"
import { scaleLinear } from "@visx/scale";
const colors = [
    '#143059',
    '#2F6B9A',
    '#82A6C2',
    '#A5C8DD',
    '#C8DCEB',
];

export default function WordCloud() {
    const width = 1200;
    const height = 800;
    const words = activityOverview.map(item => ({
        text: item.label,
        value: item.total_minutes,
    }));
    const fontScale = scaleLinear({
        domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
        range: [16, 60],
    });
    return (
        <svg width={width} height={height}>
            <Wordcloud
                words={words}
                width={width}
                height={height}
                font="Fontdiner Swanky"
                fontSize={(word) => fontScale(word.value)}
                padding={2}
                rotate={() => (Math.random() > 0.5 ? 0 : 90)}
                spiral={'archimedean'}
            >
                {(cloudWords) =>
                    cloudWords.map((word, i) => (
                        <text
                            key={word.text}
                            fill={colors[i % colors.length]}
                            textAnchor="middle"
                            transform={`
                translate(${word.x}, ${word.y})
                rotate(${word.rotate})
              `}
                            fontSize={word.size}
                            fontFamily={word.font}
                        >
                            {word.text}
                        </text>
                    ))
                }
            </Wordcloud>
        </svg>
    );
}