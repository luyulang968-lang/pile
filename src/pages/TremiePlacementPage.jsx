import { TremieDiagram } from '../components/TremieDiagram';
import { formatNumber } from '../lib/format';
import { createLocalStorageAdapter, usePersistentPageState } from '../lib/storage';
import { calculateTremieMetrics, tremieDefaults } from '../lib/tremie';

const tremieAdapter = createLocalStorageAdapter('pile:tremie-placement', tremieDefaults);

const baseFields = [
  ['pileDiameter', '桩径 (m)'],
  ['boreDepth', '成孔深度 (m)'],
  ['platformElevation', '平台标高 (m)'],
  ['bottomOffset', '导管底距孔底距离 (m)'],
  ['concreteVolume', '已灌混凝土方量 (m³)'],
  ['liftHeight', '提管高度 (m)'],
];

const statusMap = {
  insufficient: 'Insufficient embedment',
  acceptable: 'Embedment acceptable',
  too_deep: 'Embedment too deep',
  out_of_concrete: 'Tremie out of concrete',
};

const pullSteps = [0.5, 1, 2];

export function TremiePlacementPage() {
  const [inputs, setInputs] = usePersistentPageState(tremieAdapter, tremieDefaults);
  const metrics = calculateTremieMetrics(inputs);

  const handleBaseChange = (key, value) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSegmentChange = (index, value) => {
    setInputs((current) => {
      const next = [...current.tremieSegments];
      next[index] = value;
      return { ...current, tremieSegments: next };
    });
  };

  const addSegment = () => {
    setInputs((current) => ({
      ...current,
      tremieSegments: [...current.tremieSegments, 1],
    }));
  };

  const removeSegment = (index) => {
    setInputs((current) => {
      if (current.tremieSegments.length <= 1) {
        return current;
      }

      return {
        ...current,
        tremieSegments: current.tremieSegments.filter((_, currentIndex) => currentIndex !== index),
      };
    });
  };

  const pullTremie = (step) => {
    setInputs((current) => {
      const nextLiftHeight = (Number(current.liftHeight) || 0) + step;
      return {
        ...current,
        liftHeight: nextLiftHeight.toFixed(2),
      };
    });
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">页面二</p>
          <h2>导管提管与混凝土灌注模拟</h2>
          <p className="page-description">动态调整导管组合、混凝土方量和提管高度，实时查看混凝土面与埋深状态。</p>
        </div>
        <div className="status-pill status-neutral">{statusMap[metrics.embedmentStatus]}</div>
      </header>

      <div className="page-grid">
        <div className="panel">
          <h3>输入参数</h3>
          <div className="field-grid">
            {baseFields.map(([key, label]) => (
              <label key={key} className="field">
                <span>{label}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  aria-label={label}
                  value={inputs[key]}
                  onChange={(event) => handleBaseChange(key, event.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="segment-header">
            <h4>导管组合</h4>
            <button type="button" className="action-button" onClick={addSegment}>
              新增导管节段
            </button>
          </div>

          <div className="pull-panel">
            <span className="pull-label">提管操作</span>
            <div className="pull-actions">
              {pullSteps.map((step) => (
                <button
                  key={step}
                  type="button"
                  className="icon-button"
                  onClick={() => pullTremie(step)}
                >
                  {`提管 ${step.toFixed(1)} m`}
                </button>
              ))}
            </div>
          </div>

          <div className="segment-list">
            {inputs.tremieSegments.map((segment, index) => (
              <div key={`${index}-${segment}`} className="segment-item">
                <label className="field">
                  <span>{`导管节段长度 ${index + 1} (m)`}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    aria-label={`导管节段长度 ${index + 1} (m)`}
                    value={segment}
                    onChange={(event) => handleSegmentChange(index, event.target.value)}
                  />
                </label>
                <button type="button" className="icon-button" onClick={() => removeSegment(index)}>
                  删除节段
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>计算结果</h3>
          <div className="metric-grid">
            <MetricCard label="导管总长" value={`${formatNumber(metrics.tremieLength)} m`} />
            <MetricCard label="混凝土面高度" value={`${formatNumber(metrics.concreteHeight)} m`} />
            <MetricCard label="混凝土面标高" value={`${formatNumber(metrics.concreteElevation)} m`} />
            <MetricCard label="导管底端位置" value={`${formatNumber(metrics.tremieTipElevation)} m`} />
            <MetricCard label="导管埋深" value={`${formatNumber(metrics.embedmentDepth)} m`} />
          </div>
        </div>

        <div className="panel diagram-panel">
          <h3>纵向示意图</h3>
          <TremieDiagram inputs={inputs} metrics={metrics} />
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
