import React, { useContext, useEffect, useState } from "react";
import {
  IonModal,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonTitle,
  IonAlert,
} from "@ionic/react";
import { UserContext } from "../../contexts/userContext";
import { useGeolocated } from "react-geolocated";

interface AddLogModalProps {
  show: boolean;
  onDismiss: any;
  logs: any;
  setLogs: any;
}

export const AddLogModal: React.FC<AddLogModalProps> = ({
  show,
  onDismiss,
  logs,
  setLogs,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { currentUser, token } = useContext(UserContext);
  const [temperature, setTemperature] = useState("");
  const [age, setAge] = useState("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    setShowModal(show);
    return () => {
      setTemperature("");
      setShowModal(false);
    };
  }, [show, currentUser]);

  const addLog = async () => {
    if (!temperature || !age) return;
    if (!isGeolocationAvailable) {
      setIserror(true);
      setMessage("Your browser does not support Geolocation");
      return;
    }
    if (!isGeolocationEnabled) {
      setIserror(true);
      setMessage("Please enable access to geolocation");
      return;
    }

    let obj = {
      temperature: temperature,
      lat: coords?.latitude,
      lng: coords?.longitude,
      createdAt: new Date(),
      age: age,
      userId: currentUser.sub,
    };

    let response = await fetch("/addLog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });

    const data = await response.json();
    if (data.acknowledged) {
      let newLogs = [...logs];
      newLogs.push(obj);
      setLogs(newLogs);
    }
    onDismiss();
  };

  return (
    <IonModal isOpen={showModal} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                setShowModal(false);
                onDismiss();
              }}
            >
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Log Temperature</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={addLog}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Temperature</IonLabel>
          <IonInput
            placeholder={"Enter your current temperature in ℃"}
            value={temperature}
            type="text"
            onIonChange={(e) => setTemperature(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Age</IonLabel>
          <IonInput
            placeholder={"Enter your age"}
            value={age}
            type="text"
            onIonChange={(e) => setAge(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonAlert
          isOpen={iserror}
          onDidDismiss={() => setIserror(false)}
          header={"Error!"}
          message={message}
          buttons={["Dismiss"]}
        />
      </IonContent>
    </IonModal>
  );
};
