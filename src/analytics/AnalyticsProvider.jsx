import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initMixpanel, syncIdentityFromStorage, trackPageView } from "./mixpanel";

export default function AnalyticsProvider({ platform, children }) {
  const location = useLocation();

  useEffect(() => {
    initMixpanel(platform);
    syncIdentityFromStorage(platform);
  }, [platform]);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`, { platform });
  }, [location.pathname, location.search, platform]);

  return children;
}
