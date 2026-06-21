import { useState } from "react";
import PieChart from './component/PieChart'
import ActivityBarChart from './component/ActivityBarChart'
import clusterData from "./data/cluster_centroids.json";
import ScatterPlot from "./component/ScatterPlot";
import RadialBar from "./component/RadialBar";
import CombinedRadialBar from "./component/CombinedRadialBar";
import Dendrogram from "./component/Dendogram";
import WordCloud from "./component/WordCloud";

function App() {
  const [selectedFirstCluster, setSelectedFirstCluster] = useState(clusterData[0]);
  const [selectedSecondCluster, setSelectedSecondCluster] = useState(clusterData[1]);
  return (
    <>
      <PieChart clusterData={clusterData} setSelectedFirstCluster={setSelectedFirstCluster} setSelectedSecondCluster={setSelectedSecondCluster} />
      <div className="flex">
        <ActivityBarChart selectedCluster={selectedFirstCluster} />
        <ActivityBarChart selectedCluster={selectedSecondCluster} />
      </div>
      <div className="flex">
        <RadialBar selectedCluster={selectedFirstCluster} />
        <RadialBar selectedCluster={selectedSecondCluster} />
      </div>
      <CombinedRadialBar selectedFirstCluster={selectedFirstCluster} selectedSecondCluster={selectedSecondCluster} />
      {/* <ScatterPlot /> */}
      <Dendrogram />
      <WordCloud />
    </>
  )
}

export default App
