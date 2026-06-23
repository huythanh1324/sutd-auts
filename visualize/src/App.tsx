import { useMemo, useState } from "react";
import PieChart from './component/PieChart'
import ActivityBarChart from './component/ActivityBarChart'
import clusterData from "./data/cluster_centroids.json";
import RadialBar from "./component/RadialBar";
import CombinedRadialBar from "./component/CombinedRadialBar";
import WordCloud from "./component/WordCloud";

function App() {
  const clusters = Object.values(clusterData);
  const [selectedFirstCluster, setSelectedFirstCluster] = useState(clusters[0]);
  const [selectedSecondCluster, setSelectedSecondCluster] = useState(clusters[1]);

  const activities = Object.keys(clusters[0].activity_proportions);

  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);
  const [operator, setOperator] = useState<string>(">=");
  const [threshold, setThreshold] = useState<number>(0);

  const filteredClusters = useMemo(() => {
    return clusters.filter((cluster) => {
      if (selectedActivity === undefined || operator === undefined || threshold === undefined) return true;
      const value = (cluster.activity_proportions[selectedActivity] ?? 0) * 24;
      switch (operator) {
        case ">":  return value > Number(threshold);
        case "<":  return value < Number(threshold);
        case ">=": return value >= Number(threshold);
        case "<=": return value <= Number(threshold);
        default:   return true;
      }
    });
  }, [clusters, selectedActivity, operator, threshold]);

  return (
    <div className="page">

      {/* ── Top Navigation ─────────────────────────────────── */}
      <nav className="nav">
        <a className="nav__brand" href="#">
          <div className="nav__logo">A</div>
          <span className="nav__title">
            SUTD AUTS
            <span className="nav__subtitle"> / Dashboard</span>
          </span>
        </a>
        <div className="nav__spacer" />
        <span className="nav__badge">American Time Use Survey</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <header className="page__hero">
        <p className="page__hero-label">Analytics Dashboard</p>
        <h1 className="page__hero-title">Time Use Cluster Explorer</h1>
        <p className="page__hero-desc">
          Explore how Americans allocate their time across daily activities.
          Select clusters from the pie chart to compare profiles side-by-side.
        </p>
        <div className="stats-strip">
          <div className="stat-pill">
            <span className="stat-pill__value">{clusters.length}</span>
            <span className="stat-pill__label">Total Clusters</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill__value">{activities.length}</span>
            <span className="stat-pill__label">Activities Tracked</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill__value">{filteredClusters.length}</span>
            <span className="stat-pill__label">Filtered Clusters</span>
          </div>
        </div>
      </header>

      {/* ── Page Body ──────────────────────────────────────── */}
      <main className="page__body">

        {/* ── Section 1: Activity Overview ─────────────────── */}
        <section className="section animate-fade-in">
          <div className="section__header">
            <h2 className="section__title">Activity Overview</h2>
            <span className="section__desc">Word size reflects total time spent across all respondents</span>
          </div>
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Activity Word Cloud</div>
                <div className="card__subtitle">Proportional to total minutes logged per activity</div>
              </div>
              <span className="tag tag--blue">Overview</span>
            </div>
            <div className="card__body">
              <WordCloud />
            </div>
          </div>
        </section>

        {/* ── Section 2: Cluster Distribution ──────────────── */}
        <section className="section animate-fade-in">
          <div className="section__header">
            <h2 className="section__title">Cluster Distribution</h2>
            <span className="section__desc">
              Left-click a slice to set the primary cluster · Right-click to set the comparison cluster
            </span>
          </div>
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Cluster Size Breakdown</div>
                <div className="card__subtitle">Proportion of respondents per cluster</div>
              </div>
              <span className="tag tag--green">Interactive</span>
            </div>
            <div className="card__body">
              <PieChart
                clusterData={filteredClusters}
                setSelectedFirstCluster={setSelectedFirstCluster}
                setSelectedSecondCluster={setSelectedSecondCluster}
              />
            </div>
          </div>
        </section>

        {/* ── Section 3: Filter Clusters ────────────────────── */}
        <section className="section animate-fade-in">
          <div className="section__header">
            <h2 className="section__title">Filter Clusters</h2>
            <span className="section__desc">Narrow clusters by average daily hours spent on an activity</span>
          </div>

          <div className="filter-bar">
            <span className="filter-bar__label">Activity</span>
            <select
              className="filter-bar__select"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
            >
              {activities.map((activity, i) => (
                <option key={`${activity}-${i}`} value={activity}>{activity}</option>
              ))}
            </select>

            <div className="filter-bar__divider" />

            <span className="filter-bar__label">Hours</span>
            <select
              className="filter-bar__select"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            >
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value=">=">&ge;</option>
              <option value="<=">&le;</option>
            </select>

            <input
              type="number"
              className="filter-bar__input"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />

            <div className="filter-bar__divider" />

            <div className="filter-bar__result">
              <span className="filter-bar__result-count">{filteredClusters.length}</span>
              clusters matched
            </div>
          </div>
        </section>

        {/* ── Section 4: Cluster Profiles ───────────────────── */}
        <section className="section animate-fade-in">
          <div className="section__header">
            <h2 className="section__title">Cluster Profiles</h2>
            <span className="section__desc">Radial breakdown of activity time for each selected cluster</span>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card__header">
                <div>
                  <div className="card__title">Primary Cluster</div>
                  <div className="card__subtitle">Left-click a pie slice to change</div>
                </div>
                <span className="tag tag--blue">Cluster A</span>
              </div>
              <div className="card__body">
                <RadialBar selectedCluster={selectedFirstCluster} />
              </div>
            </div>
            <div className="card">
              <div className="card__header">
                <div>
                  <div className="card__title">Comparison Cluster</div>
                  <div className="card__subtitle">Right-click a pie slice to change</div>
                </div>
                <span className="tag tag--yellow">Cluster B</span>
              </div>
              <div className="card__body">
                <RadialBar selectedCluster={selectedSecondCluster} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: Comparison & Activity Detail ───────── */}
        <section className="section animate-fade-in">
          <div className="section__header">
            <h2 className="section__title">Side-by-Side Comparison</h2>
            <span className="section__desc">Overlay and bar views for the two selected clusters</span>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card__header">
                <div>
                  <div className="card__title">Combined Radial Overlay</div>
                  <div className="card__subtitle">Hover an arc to see hours per activity</div>
                </div>
                <span className="tag tag--green">Comparison</span>
              </div>
              <div className="card__body">
                <CombinedRadialBar
                  selectedFirstCluster={selectedFirstCluster}
                  selectedSecondCluster={selectedSecondCluster}
                />
              </div>
            </div>
            <div className="card">
              <div className="card__header">
                <div>
                  <div className="card__title">Activity Bar Chart</div>
                  <div className="card__subtitle">Hours per activity for the primary cluster</div>
                </div>
                <span className="tag tag--blue">Primary</span>
              </div>
              <div className="card__body">
                <ActivityBarChart selectedCluster={selectedFirstCluster} />
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
