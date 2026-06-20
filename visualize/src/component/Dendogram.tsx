import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Cluster, hierarchy } from '@visx/hierarchy';
import type {
    HierarchyPointNode,
    HierarchyPointLink,
} from '@visx/hierarchy';
import { LinkHorizontal } from '@visx/shape';
import clustersData from '../data/cluster_centroids.json'

const background = '#FFFFFF';
const branchColor = '#94a3b8';
const activityColor = '#38bdf8';
const clusterColor = '#facc15';
const rootColor = '#22c55e';

interface ClusterInfo {
    cluster_id: number;
    dominant: string[];
}

interface TreeNode {
    name: string;
    children?: TreeNode[];
}

type ClusterMap = Record<string, ClusterInfo>;

/**
 * Replace this with your full JSON
 */
// const clustersData: ClusterMap = {
//     0: {
//         cluster_id: 0,
//         dominant: ['Sleep', 'Work (main)', 'TV/Screen'],
//     },
//     1: {
//         cluster_id: 1,
//         dominant: ['Sleep', 'Childcare', 'TV/Screen'],
//     },
//     2: {
//         cluster_id: 2,
//         dominant: ['Sleep', 'TV/Screen', 'Childcare'],
//     },
//     3: {
//         cluster_id: 3,
//         dominant: ['Sleep', 'TV/Screen', 'Eating/Drinking'],
//     },
//     4: {
//         cluster_id: 4,
//         dominant: ['Sleep', 'TV/Screen', 'Work (main)'],
//     },
// };

/**
 * Insert:
 * Root
 *  └─ Sleep
 *      └─ Work (main)
 *          └─ TV/Screen
 *              └─ Cluster 0
 */
function insertPath(
    root: TreeNode,
    path: string[],
    clusterId: number,
) {
    let current = root;

    for (const activity of path) {
        current.children ??= [];

        let child = current.children.find(
            c => c.name === activity,
        );

        if (!child) {
            child = {
                name: activity,
                children: [],
            };

            current.children.push(child);
        }

        current = child;
    }

    current.children ??= [];

    current.children.push({
        name: `Cluster ${clusterId}`,
    });
}

function buildTree(clusters: ClusterMap): TreeNode {
    const root: TreeNode = {
        name: 'Root',
        children: [],
    };

    Object.values(clusters).forEach(cluster => {
        insertPath(
            root,
            cluster.dominant,
            cluster.cluster_id,
        );
    });

    return root;
}

function TreeNodeComponent({
    node,
}: {
    node: HierarchyPointNode<TreeNode>;
}) {
    const isRoot = node.depth === 0;

    const isClusterLeaf =
        !node.children &&
        node.data.name.startsWith('Cluster');

    const fillColor = isRoot
        ? rootColor
        : isClusterLeaf
            ? clusterColor
            : activityColor;

    const radius = isRoot
        ? 10
        : isClusterLeaf
            ? 5
            : 7;

    return (
        <Group top={node.x} left={node.y}>
            <circle
                r={radius}
                fill={fillColor}
            />

            <text
                dx={12}
                dy=".33em"
                fontSize={12}
                fontFamily="Arial"
                fill="black"
            >
                {node.data.name}
            </text>
        </Group>
    );
}

export interface DendrogramProps {
    width: number;
    height: number;
}

export default function Dendrogram({
    width = 1400,
    height = 900,
}: DendrogramProps) {
    const treeData = useMemo(
        () => buildTree(clustersData),
        [],
    );

    const root = useMemo(
        () => hierarchy<TreeNode>(treeData),
        [treeData],
    );

    const margin = {
        top: 40,
        right: 250,
        bottom: 40,
        left: 40,
    };

    const innerWidth =
        width - margin.left - margin.right;

    const innerHeight =
        height - margin.top - margin.bottom;

    if (width < 10 || height < 10) {
        return null;
    }

    return (
        <svg
            width={width}
            height={height}
        >
            <rect
                width={width}
                height={height}
                fill={background}
            />

            <Cluster<TreeNode>
                root={root}
                size={[innerHeight, innerWidth]}
            >
                {cluster => (
                    <Group
                        top={margin.top}
                        left={margin.left}
                    >
                        {cluster.links().map(
                            (
                                link: HierarchyPointLink<TreeNode>,
                                i,
                            ) => (
                                <LinkHorizontal<
                                    HierarchyPointLink<TreeNode>,
                                    HierarchyPointNode<TreeNode>
                                >
                                    key={i}
                                    data={link}
                                    stroke={branchColor}
                                    strokeWidth={1.5}
                                    strokeOpacity={0.7}
                                    fill="none"
                                />
                            ),
                        )}

                        {cluster
                            .descendants()
                            .map((node, i) => (
                                <TreeNodeComponent
                                    key={i}
                                    node={node}
                                />
                            ))}
                    </Group>
                )}
            </Cluster>
        </svg>
    );
}