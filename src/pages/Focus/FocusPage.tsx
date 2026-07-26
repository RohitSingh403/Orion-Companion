// src/pages/Focus/FocusPage.tsx

import PageLayout from "../../layouts/PageLayout";
import FocusTimer from "../../components/timer/FocusTimer";

export default function FocusPage() {
  return (
    <PageLayout
      title="🎯 Focus Session"
      subtitle="Stay focused and complete one task at a time."
    >
      <div className="flex h-full items-start justify-center pt-6">
        <FocusTimer />
      </div>
    </PageLayout>
  );
}