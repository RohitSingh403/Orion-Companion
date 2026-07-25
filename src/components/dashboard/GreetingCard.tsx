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
    <Card className="mb-6">
      <h2 className="text-3xl font-bold">
        {emoji} {greeting}
      </h2>

      <p className="mt-2 text-zinc-400">
        Ready to make today productive?
      </p>
    </Card>
  );
}