import { useMemo, useState } from "react";
import PieChart from './component/PieChart'
import ActivityBarChart from './component/ActivityBarChart'
import clusterData from "./data/cluster_centroids.json";
import ScatterPlot from "./component/ScatterPlot";
import RadialBar from "./component/RadialBar";
import CombinedRadialBar from "./component/CombinedRadialBar";
import Dendrogram from "./component/Dendogram";
import WordCloud from "./component/WordCloud";

function App() {
  const clusters = Object.values(clusterData);
  const [selectedFirstCluster, setSelectedFirstCluster] = useState(clusters[0]);
  const [selectedSecondCluster, setSelectedSecondCluster] = useState(clusters[1]);

  const activities = Object.keys(
    clusters[0].activity_proportions
  );

  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);
  const [operator, setOperator] = useState<string>(">=");
  const [threshold, setThreshold] = useState<number>(0);
  const filteredClusters = useMemo(() => {
    return clusters.filter((cluster) => {
      if (selectedActivity === undefined || operator === undefined || threshold === undefined) return true
      const value =
        (cluster.activity_proportions[selectedActivity] ?? 0) * 24;
      console.log(value, threshold)
      switch (operator) {
        case ">":
          return value > Number(threshold);
        case "<":
          return value < Number(threshold);
        case ">=":
          return value >= Number(threshold);
        case "<=":
          return value <= Number(threshold);
        default:
          return true;
      }
    });
  }, [clusters, selectedActivity, operator, threshold]);
  return (
    <>
      <WordCloud />
      <PieChart clusterData={filteredClusters} setSelectedFirstCluster={setSelectedFirstCluster} setSelectedSecondCluster={setSelectedSecondCluster} />
      <div className="flex gap-4 p-4 items-center">
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="border p-2 rounded"
        >
          {activities.map((activity, i) => (
            <option key={`${activity}-${i}`} value={activity}>
              {activity}
            </option>
          ))}
        </select>

        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="border p-2 rounded"
        >
          <option value=">">{">"}</option>
          <option value="<">{"<"}</option>
          <option value=">=">{">="}</option>
          <option value="<=">{"<="}</option>
        </select>

        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value) * 24}
          className="border p-2 rounded w-32"
        />

        <span>
          {filteredClusters.length} clusters matched
        </span>
      </div>
      <div className="flex">
        <RadialBar selectedCluster={selectedFirstCluster} />
        <RadialBar selectedCluster={selectedSecondCluster} />
      </div>
      <div className="flex">
        <CombinedRadialBar selectedFirstCluster={selectedFirstCluster} selectedSecondCluster={selectedSecondCluster} />
        <ActivityBarChart selectedCluster={selectedFirstCluster} />
        {/* <ActivityBarChart selectedCluster={selectedSecondCluster} /> */}
      </div>
      {/* <ScatterPlot /> */}
      {/* <Dendrogram /> */}
    </>
  )
}

export default App
