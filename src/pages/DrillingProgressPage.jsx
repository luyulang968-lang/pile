import { DrillingDiagram } from '../components/DrillingDiagram';
import { calculateDrillingMetrics, drillingDefaults } from '../lib/drilling';
import { formatNumber } from '../lib/format';
import { createLocalStorageAdapter, usePersistentPageState } from '../lib/storage';

const drillingAdapter = createLocalStorageAdapter('pile:drilling-progress', drillingDefaults);

const drillingFields = [
  ['pileDiameter', '桩径 (m)'],
  ['platformElevation', '平台标高 (m)'],
  ['casingTopElevation', '护筒顶标高 (m)'],
  ['pileTopElevation', '设计桩顶标高 (m)'],
  ['pileToeElevation', '设计桩底标高 (m)'],
  ['currentDepth', '当前实测孔深 (m)'],
];

const statusMap = {
  drilling: '正常钻进',
  toe_reached: 'Reached design toe level',
  over_drilled: 'Over-drilled',
};

export function DrillingProgressPage() {
  const [inputs, setInputs] = usePersistentPageState(drillingAdapter, drillingDefaults);
  const metrics = calculateDrillingMetrics(inputs);

  const handleChange = (key, value) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">页面一</p>
          <h2>钻孔桩成孔进度</h2>
          <p className="page-description">录入孔深与设计标高，实时查看终孔进度、孔底标高与成孔纵向示意图。</p>
        </div>
        <div className={`status-pill status-${metrics.status}`}>{statusMap[metrics.status]}</div>
      </header>

      <div className="page-grid">
        <div className="panel">
          <h3>输入参数</h3>
          <div className="field-grid">
            {drillingFields.map(([key, label]) => (
              <label key={key} className="field">
                <span>{label}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label={label}
                  value={inputs[key]}
                  onChange={(event) => handleChange(key, event.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>计算结果</h3>
          <div className="metric-grid">
            <MetricCard label="当前孔底标高" value={`${formatNumber(metrics.currentBottomElevation)} m`} />
            <MetricCard label="设计终孔深度" value={`${formatNumber(metrics.designDepth)} m`} />
            <MetricCard label="已钻深度" value={`${formatNumber(metrics.drilledDepth)} m`} />
            <MetricCard label="剩余未钻深度" value={`${formatNumber(metrics.remainingDepth)} m`} />
            <MetricCard label="完成百分比" value={`${formatNumber(metrics.progressPercent)}%`} />
          </div>
        </div>

        <div className="panel diagram-panel">
          <h3>纵向示意图</h3>
          <DrillingDiagram inputs={inputs} metrics={metrics} />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
