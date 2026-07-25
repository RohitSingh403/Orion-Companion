import Card from "../ui/Card";

export default function AdvancedStats() {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">
        📊 Advanced Statistics
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Today's Focus</span>
          <span>0 Sessions</span>
        </div>

        <div className="flex justify-between">
          <span>Total Focus Time</span>
          <span>0 min</span>
        </div>

        <div className="flex justify-between">
          <span>Daily Goal</span>
          <span>0%</span>
        </div>

        <div className="flex justify-between">
          <span>Current Streak</span>
          <span>0 Days</span>
        </div>

      </div>
    </Card>
  );
}