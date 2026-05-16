
import { useEffect } from "react";
import NProgress from "nprogress";
import { useLocation } from "react-router-dom";

const TopLoadingBar: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

    // Simulate route change start
    console.log("Route change started to:", pathname);
    NProgress.start();

    // Simulate route change complete after a delay
    const timer = setTimeout(() => {
      console.log("Route change completed to:", pathname);
      NProgress.done();
    }, 400); // Match NProgress speed

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
};

export default TopLoadingBar;
