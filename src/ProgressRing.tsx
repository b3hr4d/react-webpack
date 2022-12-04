import { useEffect, useState } from "react"

interface circleProgressProps {
  radius: number
  stroke: number
  duration: number
}

let timer: NodeJS.Timeout

const ProgressRing: React.FC<circleProgressProps> = ({
  radius,
  stroke,
  duration,
}) => {
  const [progress, setProgress] = useState(0)
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI

  useEffect(() => {
    timer = setInterval(
      () =>
        setProgress((prevProgress) =>
          prevProgress >= 98 ? 0 : prevProgress + 1
        ),
      duration / 100
    )

    return () => clearInterval(timer)
  }, [])

  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="white"
        fill={progress < 50 ? "#14A44D" : progress < 75 ? "#E4A11B" : "#ff1717"}
        style={{
          fill: progress % 3 ? "transparent" : "",
          transition: "fill 1s ease",
        }}
        strokeWidth={stroke}
        r={normalizedRadius - 0.5}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#0394fc"
        fill="transparent"
        strokeLinecap="round"
        strokeWidth={stroke}
        transform={`rotate(-90 ${radius} ${radius})`}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  )
}

export default ProgressRing
