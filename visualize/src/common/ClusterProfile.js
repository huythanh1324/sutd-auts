const clusterProfiles = {
    0: "Work + moderate routine",
    1: "Stay-home caregiver",
    2: "Home-focused, low work",
    3: "High sleep + high TV",
    4: "Young adult, mixed",
    5: "Heavy TV, likely retired",
    6: "Working parent",
    7: "Heavy full-time worker",
    8: "Socially active, balanced",
    9: "Retired homeowners",
    10: "Moderate, low-intensity day",
    11: "Longest sleepers",
    12: "Active homemaker",
    13: "Students",
    14: "Working parent, full-time",
    15: "Full-time worker",
    16: "Primary caregiver, minimal work",
    17: "Heaviest workers",
    18: "Social leisure, low work",
    19: "Screen-dominant, part-time",
};

function getClusterId(cluster) {
    if (typeof cluster !== "string") return null;

    // "Cluster 0"
    let match = cluster.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);

    return null;
}

const getClusterProfile = (cluster) => {
    const id = getClusterId(cluster);
    return clusterProfiles[id] || "Unknown cluster";
}


export default getClusterProfile;