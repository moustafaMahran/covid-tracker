import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { setupIonicReact } from "@ionic/react";
import { isPlatform } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Pages & Components*/
import Login from "./pages/Login/login";
import { UserContext } from "./contexts/userContext";
import { home, map, person } from "ionicons/icons";
import ProfilePage from "./pages/Profile/Profile";
import HomePage from "./pages/Home/Home";
import DashboardPage from "./pages/Dashboard/Dashboard";

setupIonicReact({
  mode: isPlatform("ios") ? "ios" : "md",
});

const App: React.FC = () => {
  const { isAuthenticated } = useContext(UserContext);

  useEffect(() => {}, [isAuthenticated]);

  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/login">
          {isAuthenticated ? <Redirect to="/home" /> : <Login />}
        </Route>
        {!isAuthenticated && (
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        )}
        {!isAuthenticated && (
          <Route exact path="/profile">
            <Redirect to="/login" />
          </Route>
        )}
        {!isAuthenticated && (
          <Route exact path="/home">
            <Redirect to="/login" />
          </Route>
        )}
        {!isAuthenticated && (
          <Route exact path="/dashboard">
            <Redirect to="/login" />
          </Route>
        )}
        {isAuthenticated && (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home">
                {isAuthenticated ? <HomePage /> : <Login />}
              </Route>
              <Route exact path="/dashboard">
                {isAuthenticated ? <DashboardPage /> : <Login />}
              </Route>
              <Route exact path="/profile">
                {isAuthenticated ? <ProfilePage /> : <Login />}
              </Route>
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/home">
                <IonIcon icon={home} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/dashboard">
                <IonIcon icon={map} />
                <IonLabel>Dashboard</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/profile">
                <IonIcon icon={person} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
