import { motion } from "framer-motion";
import "../styles/spinnerwheel.css";

export const Wheel = ({rotation, prizes}) => {
  function calculate(x) {
    if (x === 2 || x === 10) return 0;
    if (x === 3) return 27;
    if (x === 4) return 45;
    if (x === 5) return 54;
    if (x === 6) return 60;
    if (x === 7) return 64;
    if (x === 8) return 22.5;
    if (x === 9) return 30;
  }

  const getSectorPath = (index, total) => {
    const angle = (2 * Math.PI) / total;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;

    const x1 = 150 + 150 * Math.cos(startAngle);
    const y1 = 150 + 150 * Math.sin(startAngle);
    const x2 = 150 + 150 * Math.cos(endAngle);
    const y2 = 150 + 150 * Math.sin(endAngle);

    return `M150,150 L${x1},${y1} A150,150 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <div className="wheel-wrapper">
        <motion.svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="wheel"
          animate={{ rotate: rotation }}
          transition={{ type: "tween", duration: 4, ease: "easeOut" }}
        >
            {prizes.map((prize, i) => (
              <g key={i}>
                <path
                  d={getSectorPath(i, prizes.length)}
                  fill={
                    [
                      "#5733FF",
                      "#FF5733",
                      "#00E629",
                      "#9F2B68",
                      "#C70039",
                      "#FFC300",
                      "#00A8E8",
                      "#123892",
                      "#12FC9A",
                      "#A123C2",
                    ][i % 10]
                  }
                  stroke="white"
                  strokeWidth="2"
                />
              </g>
            ))}
            {prizes.map((prize, i) => (
              <g key={i}>
                <text
                  x="150"
                  y="50"
                  transform={`rotate(${(360 / prizes.length) * i + calculate(prizes.length)} 150 150)`}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {prize}
                </text>
              </g>
            ))}
        </motion.svg>
        <div className="pointer"></div>
      </div>
  );
}