import {
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  useIonActionSheet,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { logOut, moon, pencil, person, settings } from "ionicons/icons";
import { useHistory } from "react-router";
import { Header } from "../../components/headers/header";
import { UpdateUserInfoModal } from "../../components/modals/updateUserInfoModal";

const ProfilePage: React.FC = () => {
  const [present, dismiss] = useIonActionSheet();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { currentUser, signOut, token } = useContext(UserContext);
  const history = useHistory();
  const toggleDarkModeHandler = () => document.body.classList.toggle("dark");

  useEffect(() => {}, [currentUser, token]);

  const openSettingsActionSheet = () => {
    present(
      [
        {
          text: "Change Light/Dark Mode",
          handler: () => {
            toggleDarkModeHandler();
            dismiss();
          },
          icon: moon,
        },
        { text: "Cancel" },
      ],
      "Settings"
    );
  };

  return (
    <IonPage>
      <Header
        title="Profile"
        actionName="Settings"
        icon={settings}
        action={openSettingsActionSheet}
      />
      <IonContent>
        <IonGrid>
          {currentUser && (
            <IonRow>
              <IonItem
                class="ion-margin mini-item-box"
                lines="none"
                button
                onClick={() => setShowModal(true)}
              >
                <IonLabel>
                  <p className="box-title">
                    <IonText color="dark">Name:</IonText> {currentUser?.name}
                  </p>
                  <p className="box-title">
                    <IonText color="dark">Email:</IonText> {currentUser?.email}
                  </p>
                </IonLabel>
                <IonIcon icon={person} slot="start" />
                <IonIcon icon={pencil} slot="end" />
              </IonItem>
            </IonRow>
          )}

          <IonItem
            button
            class="ion-margin-vertical"
            onClick={() => {
              signOut();
              history.push("/");
            }}
          >
            <IonLabel>
              <IonIcon
                class="inline ml-12"
                size="small"
                icon={logOut}
                slot="start"
              />
              <h2 className="box-title inline">Logout</h2>
            </IonLabel>
          </IonItem>
        </IonGrid>
        <UpdateUserInfoModal
          show={showModal}
          onDismiss={() => setShowModal(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
