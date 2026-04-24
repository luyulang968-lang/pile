import { formatNumber } from '../lib/format';

const VIEWBOX_WIDTH = 280;
const VIEWBOX_HEIGHT = 760;

export function getTremieDiagramGeometry(inputs, metrics) {
  const platformElevation = Number(inputs.platformElevation) || 0;
  const boreDepth = Number(inputs.boreDepth) || 0;
  const tremieTopElevation = metrics.tremieTipElevation + metrics.tremieLength;
  const topElevation = Math.max(platformElevation + 1, tremieTopElevation + 1);
  const bottomElevation = platformElevation - boreDepth - 1;
  const totalRange = Math.max(topElevation - bottomElevation, 1);
  const scaleY = (elevation) => 60 + ((topElevation - elevation) / totalRange) * 620;

  return {
    platformElevation,
    boreDepth,
    yPlatform: scaleY(platformElevation),
    yBottom: scaleY(platformElevation - boreDepth),
    yConcrete: scaleY(metrics.concreteElevation),
    yTip: scaleY(metrics.tremieTipElevation),
    yTremieTop: scaleY(tremieTopElevation),
  };
}

export function TremieDiagram({ inputs, metrics }) {
  const { platformElevation, boreDepth, yPlatform, yBottom, yConcrete, yTip, yTremieTop } =
    getTremieDiagramGeometry(inputs, metrics);

  return (
    <svg
      className="diagram-svg"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-label="导管灌注示意图"
    >
      <rect x="84" y="40" width="112" height="660" rx="24" fill="#f6fbf8" stroke="#cbd9d2" />
      <rect
        x="106"
        y={yConcrete}
        width="68"
        height={Math.max(yBottom - yConcrete, 0)}
        rx="20"
        fill="#d1612f"
        opacity="0.9"
      />
      <rect
        x="132"
        y={yTremieTop}
        width="16"
        height={Math.max(yTip - yTremieTop, 10)}
        rx="8"
        fill="#435965"
        data-testid="tremie-body"
      />
      <circle cx="140" cy={yTip} r="12" fill="#435965" />

      <line x1="40" y1={yPlatform} x2="240" y2={yPlatform} stroke="#1b4332" strokeWidth="3" strokeDasharray="10 6" />
      <line x1="40" y1={yConcrete} x2="240" y2={yConcrete} stroke="#d1612f" strokeWidth="3" />
      <line x1="40" y1={yBottom} x2="240" y2={yBottom} stroke="#8f4e2a" strokeWidth="2" />
      <line x1="40" y1={yTip} x2="240" y2={yTip} stroke="#435965" strokeWidth="2" strokeDasharray="8 5" />

      <DiagramLabel y={yPlatform} title="平台线" value={`${formatNumber(platformElevation)} m`} />
      <DiagramLabel y={yConcrete} title="混凝土面" value={`${formatNumber(metrics.concreteElevation)} m`} accent="#d1612f" />
      <DiagramLabel y={yTip} title="导管底端" value={`${formatNumber(metrics.tremieTipElevation)} m`} accent="#435965" />
      <DiagramLabel y={yBottom} title="孔底" value={`${formatNumber(platformElevation - boreDepth)} m`} />
    </svg>
  );
}

function DiagramLabel({ y, title, value, accent = '#365548' }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <text x="10" y="-6" fontSize="12" fill={accent}>
        {title}
      </text>
      <text x="10" y="10" fontSize="12" fill={accent}>
        {value}
      </text>
    </g>
  );
}
