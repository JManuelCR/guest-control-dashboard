import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import "./GuestSendRemainingInvitationCounter.css";

const GuestSendRemainingInvitationCounter = () => {
  const { guests, socketConnected } = useContext(DataContext);
  const userCount = () => {
    return guests.reduce((acc, guest) => {
      const shouldCount =
      guest.guestInvited === "YES" &&
      guest.guestIsInvited &&
      !guest.guestInvitationDelivered;
      return acc + (shouldCount ? 1 : 0);
    }, 0);
  };

  return (
    <div className="guest-counter">
      <div className="counter-header">
        <h3>🤷‍♂️ Contador de invitaciones pendientes de enviar</h3>
        <div
          className={`connection-status ${
            socketConnected ? "online" : "offline"
          }`}
        >
          <span className="status-icon">{socketConnected ? "🟢" : "🔴"}</span>
          <span className="status-text">
            {socketConnected ? "En tiempo real" : "Sin conexión"}
          </span>
        </div>
      </div>

      <div className="counter-display">
        <div className="count-number">{userCount()}</div>
        <div className="count-label">Total de invitaciones pendientes de enviar</div>
      </div>

      <div className="counter-info">
        <small>
          {socketConnected
            ? "✅ Se actualiza automáticamente cuando hay cambios"
            : "❌ Solo se actualiza al recargar la página"}
        </small>
      </div>
    </div>
  );
};

export default GuestSendRemainingInvitationCounter;
