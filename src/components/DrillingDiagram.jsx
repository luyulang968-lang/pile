import { formatNumber } from '../lib/format';

const VIEWBOX_WIDTH = 280;
const VIEWBOX_HEIGHT = 760;

export function DrillingDiagram({ inputs, metrics }) {
  const casingTopElevation = Number(inputs.casingTopElevation) || 0;
  const platformElevation = Number(inputs.platformElevation) || 0;
  const pileTopElevation = Number(inputs.pileTopElevation) || 0;
  const pileToeElevation = Number(inputs.pileToeElevation) || 0;
  const topElevation = Math.max(casingTopElevation, platformElevation) + 1;
  const bottomElevation = Math.min(pileToeElevation, metrics.currentBottomElevation) - 1;
  const totalRange = Math.max(topElevation - bottomElevation, 1);
  const shaftX = 110;
  const shaftWidth = 60;
  const scaleY = (elevation) => 60 + ((topElevation - elevation) / totalRange) * 620;

  const yPlatform = scaleY(platformElevation);
  const yCasingTop = scaleY(casingTopElevation);
  const yPileTop = scaleY(pileTopElevation);
  const yPileToe = scaleY(pileToeElevation);
  const yCurrentBottom = scaleY(metrics.currentBottomElevation);

  return (
    <svg className="diagram-svg" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} role="img" aria-label="成孔进度示意图">
      <defs>
        <pattern id="undrilledPattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#e8ddd0" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#cab396" strokeWidth="2" />
        </pattern>
      </defs>

      <rect x="84" y="40" width="112" height="660" rx="24" fill="#f6fbf8" stroke="#cbd9d2" />
      <rect x={shaftX} y={yPileTop} width={shaftWidth} height={Math.max(yPileToe - yPileTop, 10)} fill="url(#undrilledPattern)" rx="24" />
      <rect
        x={shaftX}
        y={yPileTop}
        width={shaftWidth}
        height={Math.max(yCurrentBottom - yPileTop, 0)}
        fill="#3f8f74"
        rx="24"
      />
      <rect x="100" y={yCasingTop} width="80" height={Math.max(yPileTop - yCasingTop, 18)} fill="#758c83" opacity="0.3" stroke="#486358" />

      <line x1="40" y1={yPlatform} x2="240" y2={yPlatform} stroke="#1b4332" strokeWidth="3" strokeDasharray="10 6" />
      <line x1="36" y1={yPileTop} x2="240" y2={yPileTop} stroke="#2d6a4f" strokeWidth="2" />
      <line x1="36" y1={yPileToe} x2="240" y2={yPileToe} stroke="#8f4e2a" strokeWidth="2" />
      <line x1="36" y1={yCurrentBottom} x2="240" y2={yCurrentBottom} stroke="#d9480f" strokeWidth="3" />

      <Label y={yPlatform} title="平台线" value={`${formatNumber(platformElevation)} m`} />
      <Label y={yCasingTop} title="护筒顶" value={`${formatNumber(casingTopElevation)} m`} />
      <Label y={yPileTop} title="设计桩顶" value={`${formatNumber(pileTopElevation)} m`} />
      <Label y={yPileToe} title="设计桩底" value={`${formatNumber(pileToeElevation)} m`} />
      <Label y={yCurrentBottom} title="当前孔底" value={`${formatNumber(metrics.currentBottomElevation)} m`} accent />
    </svg>
  );
}

function Label({ y, title, value, accent = false }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <text x="10" y="-6" fontSize="12" fill={accent ? '#d9480f' : '#365548'}>
        {title}
      </text>
      <text x="10" y="10" fontSize="12" fill={accent ? '#d9480f' : '#60756b'}>
        {value}
      </text>
    </g>
  );
}
