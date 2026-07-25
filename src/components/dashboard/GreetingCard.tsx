import Card from "../ui/Card";

export default function GreetingCard() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";
  let emoji = "🌙";

  if (hour < 12) {
    greeting = "Good Morning";
    emoji = "☀️";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
    emoji = "🌤";
  }

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="text-5xl">{emoji}</div>

        <div>
          <h2 className="text-2xl font-bold">{greeting}</h2>

          <p className="text-zinc-400 mt-1">Ready to make today count?</p>
        </div>
      </div>
    </Card>
  );
}
