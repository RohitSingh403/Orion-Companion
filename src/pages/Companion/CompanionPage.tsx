import { useEffect } from "react";
import ScreenCompanion from "../../components/companion/ScreenCompanion";

export default function CompanionPage() {
  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  return <ScreenCompanion variant="desktop" />;
}
