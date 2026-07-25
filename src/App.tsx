// import usePomodoro from "./hooks/usePomodoro";
// import { useFocusStore } from "./store/focusStore";
// import { formatTime } from "./utils/time";
// import "./index.css";

// function App() {
//   usePomodoro();

//   const {
//     session,
//     remainingTime,
//     running,
//     completedSessions,
//     start,
//     pause,
//     reset,
//   } = useFocusStore();

//   return (
//     <div className="h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
//       <h1 className="text-6xl font-bold mb-8">
//         Focus Companion
//       </h1>

//       <p className="text-xl text-zinc-400 mb-6 capitalize">
//         {session} Session
//       </p>

//       <h2 className="text-8xl font-bold mb-10">
//         {formatTime(remainingTime)}
//       </h2>

//       <div className="flex gap-4">
//         {!running ? (
//           <button
//             onClick={start}
//             className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700"
//           >
//             Start
//           </button>
//         ) : (
//           <button
//             onClick={pause}
//             className="px-8 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-700"
//           >
//             Pause
//           </button>
//         )}

//         <button
//           onClick={reset}
//           className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700"
//         >
//           Reset
//         </button>
//       </div>

//       <p className="mt-10 text-zinc-400">
//         Completed Sessions: {completedSessions}
//       </p>
//     </div>
//   );
// }

// export default App;
// export default function App() {
//   return (
//     <div className="h-screen bg-red-500 flex items-center justify-center">
//       <h1 className="text-6xl font-bold text-white">
//         Tailwind Works 🚀
//       </h1>
//     </div>
//   );
// }
import FocusTimer from "./components/timer/FocusTimer";
import usePomodoro from "./hooks/usePomodoro";

export default function App() {
  usePomodoro();

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <FocusTimer />
    </main>
  );
}