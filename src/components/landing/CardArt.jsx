// Generated circuit-board art for card backs that have no screenshot.
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export default function CardArt({ seed = '', color = 'hsl(180 100% 50%)' }) {
  const rand = rng(hash(seed));
  const traces = [];
  for (let i = 0; i < 14; i += 1) {
    let x = Math.floor(rand() * 16) * 20;
    let y = Math.floor(rand() * 12) * 20;
    let d = `M${x} ${y}`;
    const steps = 2 + Math.floor(rand() * 3);
    for (let k = 0; k < steps; k += 1) {
      if (rand() > 0.5) x += (Math.floor(rand() * 5) - 2) * 20;
      else y += (Math.floor(rand() * 5) - 2) * 20;
      d += `L${x} ${y}`;
    }
    traces.push({ d, x, y });
  }
  return (
    <svg
      data-card-art=""
      aria-hidden="true"
      viewBox="0 0 320 240"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <rect width="320" height="240" fill="hsl(240 10% 5%)" />
      <g stroke={color} strokeOpacity="0.55" strokeWidth="1.5" fill="none">
        {traces.map((t, i) => (
          <path key={i} d={t.d} />
        ))}
      </g>
      <g fill={color}>
        {traces.map((t, i) => (
          <circle key={i} cx={t.x} cy={t.y} r="3" fillOpacity="0.9" />
        ))}
      </g>
    </svg>
  );
}
