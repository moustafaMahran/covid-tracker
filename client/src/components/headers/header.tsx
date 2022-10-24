import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import "./header.css";

interface HeaderProps {
  title?: string;
  icon?: any;
  actionName?: string;
  action?: any;
  showBackButton?: any;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  actionName,
  action,
  icon,
  showBackButton,
}) => {
  return (
    <IonHeader>
      <IonToolbar class="header-toolbar">
        {showBackButton && (
          <IonButtons slot="start" class="ion-padding-horizontal">
            <IonBackButton text="" icon={arrowForward} color="dark" />
          </IonButtons>
        )}

        <IonTitle class="header-title ion-text-start ion-padding-horizontal">
          {title}
        </IonTitle>

        {(actionName || icon) && (
          <IonButton
            fill="clear"
            color="primary"
            slot="end"
            class="header-action"
            onClick={action}
          >
            {icon && <IonIcon icon={icon} slot="end" />}
            {actionName}
          </IonButton>
        )}
      </IonToolbar>
    </IonHeader>
  );
};
