import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import DevMenu from "../../components/DevMenu";
import Steps from "../../components/steps";
import Intro from "../../screens/Onboard/Intro";
import SetPassword from "../../screens/Onboard/SetPassword";
import ConnectLnd from "../../screens/Onboard/ConnectLnd";
import TestConnection from "../../screens/Onboard/TestConnection";
import LastStep from "../../screens/Onboard/LastStep";

const routes = [
  { path: "/", component: Intro, exact: true },
  { path: "/set-password", component: SetPassword },
  { path: "/connect-lnd", component: ConnectLnd },
  { path: "/test-connection", component: TestConnection },
  { path: "/last-step", component: LastStep },
];

const initialSteps = routes.map((route, index) => ({
  id: `Step ${index + 1}`,
  href: route.path,
  status: "upcoming",
}));

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
}

function WelcomeRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [steps, setSteps] = useState(initialSteps);
  let location = useLocation();

  // Update step progress based on active location.
  useEffect(() => {
    const { pathname } = location;
    const activeStepIndex = routes.findIndex(
      (route) => route.path === pathname
    );
    const updatedSteps = initialSteps.map((step, index) => {
      let status = "upcoming";
      if (index < activeStepIndex) {
        status = "complete";
      } else if (index === activeStepIndex) {
        status = "current";
      }
      return { ...step, status };
    });
    setSteps(updatedSteps);
  }, [location]);

  return (
    <div>
      <DevMenu />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Steps steps={steps} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </div>
    </div>
  );
}

export default WelcomeRouter;
