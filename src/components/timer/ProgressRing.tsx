// import { CountdownCircleTimer } from "react-countdown-circle-timer";
// import { useFocusStore } from "../../store/focusStore";
// import { formatTime } from "../../utils/time";

// export default function ProgressRing() {
//   const { remainingTime, session, running, focusDuration, breakDuration } =
//     useFocusStore();

//   const duration =
//     session === "focus" ? focusDuration : breakDuration;

//   return (
//     <div className="flex justify-center mb-8">
//       <CountdownCircleTimer
//         isPlaying={running}
//         duration={duration}
//         initialRemainingTime={remainingTime}
//         colors={["#22c55e", "#f59e0b", "#ef4444"]}
//         colorsTime={[duration, duration / 2, 0]}
//         strokeWidth={12}
//         size={260}
//       >
//         {() => (
//           <div className="flex flex-col items-center">
//             <span className="text-6xl font-bold">
//               {formatTime(remainingTime)}
//             </span>

//             <span className="text-zinc-400 mt-2 capitalize">
//               {session}
//             </span>
//           </div>
//         )}
//       </CountdownCircleTimer>
//     </div>
//   );
// }
import { useMemo } from "react";
import { useFocusStore } from "../../store/focusStore";
import { formatTime } from "../../utils/time";

export default function ProgressRing() {
  const { remainingTime, session, focusDuration, breakDuration } =
    useFocusStore();

  console.log("Remaining:", remainingTime);

  const duration = session === "focus" ? focusDuration : breakDuration;

  const radius = 110;

  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;

  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = useMemo(() => {
    return remainingTime / duration;
  }, [remainingTime, duration]);

  const strokeDashoffset = circumference - progress * circumference;

  console.log("Progress:", progress);
  console.log("Offset:", strokeDashoffset);

  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-[240px] h-[240px]">
        <svg width="240" height="240">
          <circle
            stroke="#27272a"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="120"
            cy="120"
          />

          <circle
            cx="120"
            cy="120"
            r={normalizedRadius}
            fill="none"
            stroke="#22c55e"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 120 120)"
            style={{
              transition: "stroke-dashoffset 1s linear",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold">
            {formatTime(remainingTime)}
          </span>

          <span className="text-zinc-400 mt-2 capitalize">{session}</span>
        </div>
      </div>
    </div>
  );
}
