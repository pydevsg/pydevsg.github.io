/**
 * Stand-in for a real recording: an infra graph that traces itself, flags an
 * orphan and a drifted resource, then loops. Inline SVG so it picks up the
 * accent colour via currentColor. Swap it out by setting
 * site.featured.demo to a gif path.
 */
export function SudivizDemo() {
  const edges = [
    "M120 96 L232 96",
    "M232 96 L232 168",
    "M232 168 L344 168",
    "M120 96 L120 224",
    "M120 224 L232 224",
    "M344 168 L440 120",
    "M232 224 L344 248",
  ];

  return (
    <svg
      viewBox="0 0 560 320"
      className="h-full w-full text-accent"
      role="img"
      aria-label="animated diagram of an AWS resource graph being scanned by sudiviz"
    >
      <rect width="560" height="320" fill="#0B0D0E" />

      {/* faint blueprint grid */}
      <g stroke="rgba(237,234,224,0.055)" strokeWidth="1">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 44} y1="0" x2={i * 44} y2="320" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 44} x2="560" y2={i * 44} />
        ))}
      </g>

      {/* vpc boundary */}
      <rect
        x="64"
        y="56"
        width="420"
        height="216"
        fill="none"
        stroke="rgba(237,234,224,0.16)"
        strokeDasharray="4 5"
      />
      <text x="72" y="48" fill="rgba(237,234,224,0.45)" fontSize="10" fontFamily="monospace">
        vpc-0a91 · eu-west-2
      </text>

      {/* edges drawing themselves */}
      <g stroke="currentColor" strokeWidth="1.25" fill="none" opacity="0.55">
        {edges.map((d, i) => (
          <path key={d} d={d} strokeDasharray="160" strokeDashoffset="160">
            <animate
              attributeName="stroke-dashoffset"
              from="160"
              to="0"
              dur="0.9s"
              begin={`${i * 0.18}s`}
              fill="freeze"
            />
          </path>
        ))}
      </g>

      {/* travelling packets */}
      {edges.slice(0, 4).map((d, i) => (
        <circle key={`p${i}`} r="2.5" fill="currentColor">
          <animateMotion dur="2.6s" begin={`${1.4 + i * 0.4}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}

      {/* nodes */}
      {(
        [
          [120, 96, "igw"],
          [232, 96, "alb"],
          [232, 168, "eks"],
          [344, 168, "rds"],
          [120, 224, "s3"],
          [232, 224, "lambda"],
          [344, 248, "sqs"],
          [440, 120, "ec2"],
        ] as const
      ).map(([x, y, label], i) => (
        <g key={label}>
          <rect
            x={x - 26}
            y={y - 13}
            width="52"
            height="26"
            fill="#101314"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="0.9"
              dur="0.3s"
              begin={`${i * 0.16}s`}
              fill="freeze"
            />
          </rect>
          <text
            x={x}
            y={y + 3.5}
            textAnchor="middle"
            fill="#EDEAE0"
            fontSize="9"
            fontFamily="monospace"
            opacity="0"
          >
            {label}
            <animate
              attributeName="opacity"
              from="0"
              to="0.85"
              dur="0.3s"
              begin={`${i * 0.16 + 0.1}s`}
              fill="freeze"
            />
          </text>
        </g>
      ))}

      {/* orphan callout */}
      <g opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="2.4s" fill="freeze" />
        <circle cx="440" cy="120" r="22" fill="none" stroke="#FF6B6B" strokeWidth="1">
          <animate
            attributeName="r"
            values="18;24;18"
            dur="2s"
            begin="2.4s"
            repeatCount="indefinite"
          />
        </circle>
        <text x="470" y="112" fill="#FF6B6B" fontSize="9" fontFamily="monospace">
          orphan
        </text>
        <text x="470" y="124" fill="rgba(255,107,107,0.6)" fontSize="8" fontFamily="monospace">
          no refs
        </text>
      </g>

      {/* drift callout */}
      <g opacity="0">
        <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="3s" fill="freeze" />
        <text x="352" y="196" fill="#FFB84D" fontSize="9" fontFamily="monospace">
          ± drift vs terraform
        </text>
      </g>

      {/* scan beam */}
      <rect x="0" y="0" width="2" height="320" fill="currentColor" opacity="0.5">
        <animate attributeName="x" from="0" to="560" dur="3.4s" repeatCount="indefinite" />
      </rect>

      {/* status line */}
      <text x="16" y="306" fill="rgba(237,234,224,0.4)" fontSize="10" fontFamily="monospace">
        $ sudiviz scan --region eu-west-2
      </text>
      <text x="410" y="306" fill="currentColor" fontSize="10" fontFamily="monospace" opacity="0">
        8 nodes · 2 findings
        <animate attributeName="opacity" from="0" to="0.9" dur="0.4s" begin="3.2s" fill="freeze" />
      </text>
    </svg>
  );
}
