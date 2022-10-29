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
} from "@ionic/react";
import { UserContext } from "../../contexts/userContext";

interface UpdateUserInfoModalProps {
  show: boolean;
  onDismiss: any;
}

export const UpdateUserInfoModal: React.FC<UpdateUserInfoModalProps> = ({
  show,
  onDismiss,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { currentUser, token, setCurrentUser } = useContext(UserContext);
  const [name, setName] = useState("");

  useEffect(() => {
    setShowModal(show);
    if (currentUser) setName(currentUser.name);
    return () => {
      setShowModal(false);
    };
  }, [show, currentUser]);

  const updateUserProfile = async () => {
    if (!name || name === currentUser.name) return;

    let response = await fetch("/private/updateUserProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
      }),
    });

    const data = await response.json();
    if (data.name) {
      let newUser = { ...currentUser };
      newUser.name = name;
      setCurrentUser(newUser);
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
          <IonTitle>Update Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={updateUserProfile}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            placeholder={"Enter organization name"}
            value={name}
            type="text"
            onIonChange={(e) => setName(e.detail.value!)}
          ></IonInput>
        </IonItem>
      </IonContent>
    </IonModal>
  );
};
