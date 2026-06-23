import { useMemo, useRef, useState, useEffect } from "react";
import PieChart from './component/PieChart'
import ActivityBarChart from './component/ActivityBarChart'
import clusterData from "./data/cluster_centroids.json";
import RadialBar from "./component/RadialBar";
import CombinedRadialBar from "./component/CombinedRadialBar";
import WordCloud from "./component/WordCloud";
import getClusterProfile from "./common/ClusterProfile.js";
import colors from "./constant/colors";
import activityColors from "./constant/activityColor";

function App() {
  const clusters = Object.values(clusterData);
  const [selectedFirstCluster, setSelectedFirstCluster] = useState(clusters[0]);
  const [selectedSecondCluster, setSelectedSecondCluster] = useState(clusters[1]);

  const activities = Object.keys(clusters[0].activity_proportions);

  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);
  const [operator, setOperator] = useState<string>(">=");
  const [threshold, setThreshold] = useState<number>(0);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Radial section visibility for sticky legend panel
  const radialSectionRef = useRef<HTMLDivElement>(null);
  const [showLegendPanel, setShowLegendPanel] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowLegendPanel(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (radialSectionRef.current) observer.observe(radialSectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredClusters = useMemo(() => {
    return clusters.filter((cluster) => {
      if (selectedActivity === undefined) return true;
      const value = (cluster.activity_proportions[selectedActivity] ?? 0) * 24;
      switch (operator) {
        case ">": return value > Number(threshold);
        case "<": return value < Number(threshold);
        case ">=": return value >= Number(threshold);
        case "<=": return value <= Number(threshold);
        default: return true;
      }
    });
  }, [clusters, selectedActivity, operator, threshold]);

  // Build activity legend entries from the selected primary cluster
  const activityEntries = Object.entries(selectedFirstCluster.activity_proportions).map(
    ([activity, proportion], i) => ({ activity, proportion: proportion as number, color: activityColors[i] })
  );

  return (
    <div className="page">

      {/* ── Top Navigation ── */}
      <nav className="nav">
        <a className="nav__brand" href="#">
          <div className="nav__logo">A</div>
          <span className="nav__title">
            SUTD AUTS
            <span className="nav__subtitle"> / Dashboard</span>
          </span>
        </a>
        <div className="nav__spacer" />
        {/* Drawer trigger button */}
        <button className="drawer-trigger" onClick={() => setDrawerOpen(true)}>
          <span className="drawer-trigger__swatches">
            {clusters.slice(0, 5).map((c, i) => (
              <span key={c.cluster_id} className="drawer-trigger__dot" style={{ background: colors[i % colors.length] }} />
            ))}
          </span>
          <span className="drawer-trigger__label">Clusters</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="nav__badge" style={{ marginLeft: 12 }}>American Time Use Survey</span>
      </nav>

      {/* ── Cluster Drawer ── */}
      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}
      <div className={`drawer ${drawerOpen ? 'drawer--open' : ''}`}>
        <div className="drawer__header">
          <span className="drawer__title">Select Clusters</span>
          <button className="drawer__close" onClick={() => setDrawerOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="drawer__hint">Left-click = Cluster A &nbsp;·&nbsp; Right-click = Cluster B</p>

        <div className="drawer__selected">
          <div className="drawer__selected-row">
            <span className="cluster-slider__role cluster-slider__role--a">A</span>
            <span className="drawer__selected-name">{getClusterProfile(`Cluster ${selectedFirstCluster.cluster_id}`)}</span>
          </div>
          <div className="drawer__selected-row">
            <span className="cluster-slider__role cluster-slider__role--b">B</span>
            <span className="drawer__selected-name">{getClusterProfile(`Cluster ${selectedSecondCluster.cluster_id}`)}</span>
          </div>
        </div>

        <div className="drawer__divider" />

        <div className="drawer__list">
          {clusters.map((c, i) => {
            const isFirst = c.cluster_id === selectedFirstCluster.cluster_id;
            const isSecond = c.cluster_id === selectedSecondCluster.cluster_id;
            return (
              <button
                key={c.cluster_id}
                className={[
                  'drawer__item',
                  isFirst ? 'drawer__item--a' : '',
                  isSecond ? 'drawer__item--b' : '',
                ].join(' ')}
                onClick={() => setSelectedFirstCluster(c)}
                onContextMenu={(e) => { e.preventDefault(); setSelectedSecondCluster(c); }}
              >
                <span className="drawer__item-swatch" style={{ background: colors[i % colors.length] }} />
                <span className="drawer__item-name">{getClusterProfile(`Cluster ${c.cluster_id}`)}</span>
                <span className="drawer__item-badges">
                  {isFirst && <span className="cluster-slider__role cluster-slider__role--a" style={{ width: 18, height: 18, fontSize: 10 }}>A</span>}
                  {isSecond && <span className="cluster-slider__role cluster-slider__role--b" style={{ width: 18, height: 18, fontSize: 10 }}>B</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Hero ── */}
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

      {/* ── Page Body ── */}
      <main className="page__body">

        {/* Section 1: Activity Overview */}
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

        {/* Section 2: Cluster Explorer */}
        <section className="section animate-fade-in">
          <div className="section__header">
            <h2 className="section__title">Cluster Explorer</h2>
            <span className="section__desc">
              Filter clusters by activity · Left-click a slice to set primary · Right-click to set comparison
            </span>
          </div>
          <div className="card">
            <div className="card__header">
              <div>
                <div className="card__title">Filter &amp; Select Clusters</div>
                <div className="card__subtitle">Narrow by average daily hours, then pick clusters from the chart</div>
              </div>
              <span className="tag tag--green">Interactive</span>
            </div>
            <div className="cluster-explorer">
              <div className="filter-bar filter-bar--inline">
                <span className="filter-bar__label">Activity</span>
                <select className="filter-bar__select" value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)}>
                  {activities.map((activity, i) => (
                    <option key={`${activity}-${i}`} value={activity}>{activity}</option>
                  ))}
                </select>
                <div className="filter-bar__divider" />
                <span className="filter-bar__label">Hours</span>
                <select className="filter-bar__select" value={operator} onChange={(e) => setOperator(e.target.value)}>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value=">=">&ge;</option>
                  <option value="<=">&le;</option>
                </select>
                <input type="number" className="filter-bar__input" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
                <div className="filter-bar__divider" />
                <div className="filter-bar__result">
                  <span className="filter-bar__result-count">{filteredClusters.length}</span>
                  clusters matched
                </div>
              </div>
              <div className="cluster-explorer__chart">
                <PieChart
                  clusterData={filteredClusters}
                  selectedFirstCluster={selectedFirstCluster}
                  selectedSecondCluster={selectedSecondCluster}
                  setSelectedFirstCluster={setSelectedFirstCluster}
                  setSelectedSecondCluster={setSelectedSecondCluster}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Cluster Profiles — radial charts with sticky legend panel */}
        <section className="section animate-fade-in" ref={radialSectionRef}>
          <div className="section__header">
            <h2 className="section__title">Cluster Profiles</h2>
            <span className="section__desc">Radial breakdown of activity time · hover an arc for details</span>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card__header">
                <div>
                  <div className="card__title">Primary Cluster</div>
                  <div className="card__subtitle">Left-click a pie slice to change</div>
                </div>
                <span className="tag tag--blue">{`${getClusterProfile(`Cluster ${selectedFirstCluster.cluster_id}`)}`}</span>
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
                <span className="tag tag--yellow">{`${getClusterProfile(`Cluster ${selectedSecondCluster.cluster_id}`)}`}</span>
              </div>
              <div className="card__body">
                <RadialBar selectedCluster={selectedSecondCluster} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Comparison */}
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
                <CombinedRadialBar selectedFirstCluster={selectedFirstCluster} selectedSecondCluster={selectedSecondCluster} />
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

      {/* ── Sticky Legend Panel (visible only when Radial section is in view) ── */}
      <aside className={`legend-panel ${showLegendPanel ? 'legend-panel--visible' : ''}`}>
        <div className="legend-panel__header">
          <span className="legend-panel__title">Activity Legend</span>
          <span className="legend-panel__sub">Cluster A</span>
        </div>
        <div className="legend-panel__list">
          {activityEntries.map(({ activity, proportion, color }) => (
            <div key={activity} className="legend-panel__item">
              <span className="legend-panel__dot" style={{ background: color }} />
              <span className="legend-panel__label">{activity}</span>
              {/* <span className="legend-panel__value">{(proportion * 24).toFixed(1)}h</span> */}
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
}

export default App;
