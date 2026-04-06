import FeatureHighlights from "@/components/onramp/feature-highlights";
import Onramp from "@/components/onramp/onramp";

export function OnrampLandingPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5">
      <FeatureHighlights />
      <Onramp />
    </div>
  );
}
