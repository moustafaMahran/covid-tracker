import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { IonButton, IonIcon, IonAlert } from "@ionic/react";
import { UserContext } from "../../contexts/userContext";

function validateEmail(email: string) {
  const re =
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

const Login: React.FC = (props) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { signIn } = useContext(UserContext);
  const history = useHistory();

  const handleRegister = async () => {
    if (!email || !validateEmail(email)) {
      setMessage("Please enter a valid email");
      setIserror(true);
      return;
    }

    setShowLoading(true);
    await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
      }),
    })
      .then((res) => {
        setShowVerification(true);
      })
      .catch((error) => {
        setMessage(error);
        setIserror(true);
        return;
      })
      .finally(() => {
        setShowLoading(false);
      });
  };

  const verifyCode = async () => {
    setShowLoading(true);
    let response = await fetch("/verifyCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: verificationCode,
        email: email,
      }),
    });

    if (!response.ok) {
      setMessage(response.statusText);
      setIserror(true);
      return;
    }

    const data = await response.json();
    setShowLoading(false);
    if (data.access_token) {
      signIn(data);
      history.push("home");
    } else {
      setMessage(data.error);
      setIserror(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                header={"Error!"}
                message={message}
                buttons={["Dismiss"]}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonIcon
                style={{ fontSize: "70px", color: "white" }}
                icon={personCircle}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="white">
                <h1>
                  Welcome to <IonText color="primary">Covid Tracker</IonText>
                </h1>
              </IonText>
            </IonCol>
          </IonRow>
          {/* <IonRow>
            <IonCol>
              <IonText color="white">
                <h4>
                  Login to your account
                </h4>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
            <IonItem>
                <IonLabel position="stacked"> Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="white">
                <h4>
                  Or you can register
                </h4>
              </IonText>
            </IonCol>
          </IonRow> */}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Full Name</IonLabel>
                <IonInput
                  type="text"
                  value={name}
                  onIonChange={(e) => setName(e.detail.value!)}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked"> Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                expand="block"
                color="primary"
                onClick={handleRegister}
              >
                Send Verification Code
              </IonButton>
              <IonLoading isOpen={showLoading} message={"Please wait..."} />
            </IonCol>
          </IonRow>
          {showVerification && (
            <IonRow>
              <IonCol>
                <IonItem class="ion-margin-horizontal">
                  <IonLabel position="stacked"> Verification Code</IonLabel>
                  <IonInput
                    type="number"
                    value={verificationCode}
                    onIonChange={(e) => setVerificationCode(e.detail.value!)}
                  ></IonInput>
                </IonItem>
                <IonButton expand="block" color="success" onClick={verifyCode}>
                  Verify
                </IonButton>
                <IonLoading isOpen={showLoading} message={"Please wait..."} />
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
