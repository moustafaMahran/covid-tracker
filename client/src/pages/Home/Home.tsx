import {
  IonBadge,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
} from "@ionic/react";
import { pin } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import { Header } from "../../components/headers/header";
import { AddLogModal } from "../../components/modals/addLog";
import { UserContext } from "../../contexts/userContext";
import "./Home.css";

const HomePage: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { currentUser, token } = useContext(UserContext);
  const [logs, setLogs] = useState<any>(null);

  useEffect(() => {
    if (!logs && currentUser) getLogs();
  }, [currentUser, token, logs]);

  const getLogs = async () => {
    let response = await fetch("/getLogs?userId=" + currentUser?.sub, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setLogs(data);
  };
  return (
    <IonPage>
      <Header title="Home" />
      <IonContent>
        <IonGrid>
          <IonRow class="ion-justify-content-center ion-margin">
            <IonItem lines="none">
              <div className="pin-icon-container ion-padding">
                <IonIcon
                  color="medium"
                  class="pin-icon ion-padding"
                  icon={pin}
                />
              </div>
            </IonItem>
          </IonRow>
          <IonRow class="ion-justify-content-center">
            <IonItem lines="none">
              <IonText>
                <h2 className="box-title">Protect your loved ones!</h2>
              </IonText>
            </IonItem>
          </IonRow>
          <IonRow class="ion-justify-content-center">
            <IonItem lines="none">
              <IonText
                color="dark"
                className="ion-text-justify ion-text-center"
              >
                <p className="ion-text-center box-subtitle">
                  Help us tracking covid-19 for having a better and safe world,
                  your life matters
                </p>
              </IonText>
            </IonItem>
          </IonRow>
          <IonRow class="ion-align-items-center">
            <IonCol class="ion-text-center">
              <IonButton onClick={() => setShowModal(true)}>
                Log Temperature
              </IonButton>
            </IonCol>
          </IonRow>
          {logs && logs.length > 0 && (
            <IonRow class="mt-48">
              <IonCol class="ion-text-center">
                <IonTitle class="box-title">
                  Data you entered hepled us chasing the virus!
                </IonTitle>
              </IonCol>
            </IonRow>
          )}
          {logs && logs.length > 0 && (
            <IonRow>
              {logs.map((log: any, index: number) => {
                return (
                  <IonCol sizeXs="6" sizeSm="3" key={index}>
                    <IonItem
                      class="log-box ion-no-margin ion-align-items-start"
                      lines="none"
                    >
                      <IonLabel class="ion-margin-vertical ion-text-center">
                        <h3 className="box-title">Temperature</h3>
                        <IonBadge color="warning">{log.temperature}℃</IonBadge>

                        <IonLabel class="mt-32" color="primary">
                          <p className="text-small">
                            {new Date(log.createdAt).toDateString()}
                          </p>
                          <p className="text-small">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </p>
                        </IonLabel>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                );
              })}
            </IonRow>
          )}
        </IonGrid>
        <AddLogModal
          show={showModal}
          logs={logs}
          setLogs={setLogs}
          onDismiss={() => setShowModal(false)}
        />
      </IonContent>
    </IonPage>
  );
};
export default HomePage;
