import { IonContent, IonGrid, IonPage, IonToast } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { Header } from "../../components/headers/header";
import { MapComponent } from "../../components/Map";
import PinComponent from "../../components/Pin";

const DashboardPage: React.FC = () => {
  const { currentUser, token } = useContext(UserContext);
  const [logs, setLogs] = useState<any>(null);
  const [pins, setPins] = useState<any>(null);

  useEffect(() => {
    if (!logs && currentUser) getLogs();
  }, [currentUser, token, logs]);

  const getLogs = async () => {
    let response = await fetch("/getAllLogs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setLogs(data);
    let arr: any = [];
    data.forEach((log: any) => {
      let pin = (
        <PinComponent
          key={log.createdAt}
          lat={log.lat}
          lng={log.lng}
          text={log.temperature + "℃"}
          age={log.age + "yr"}
        />
      );
      arr.push(pin);
    });
    setPins(arr);
  };

  return (
    <IonPage>
      <Header title="Dashboard" />
      <IonContent>
        <IonGrid>
          {logs && pins && logs.length > 0 && <MapComponent children={pins} />}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
