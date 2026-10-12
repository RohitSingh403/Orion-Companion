import AppLayout from "../../layouts/AppLayout";
import PageHeading from "../../components/shell/PageHeading";

export default function DashboardPage() {
  return (
    <AppLayout>
      <PageHeading title="Dashboard" subtitle="Your focus command center" />
      <div className="p-10 text-white">
        Dashboard Page
      </div>
    </AppLayout>
  );
}