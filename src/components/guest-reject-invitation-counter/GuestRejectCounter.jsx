import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import "./GuestRejectCounter.css";

const GuestRejectCounter = () => {
  const { guests, socketConnected } = useContext(DataContext);
  const userCount = () => {
    return guests.reduce((acc, guest) => {
      const shouldCount =
        guest.guestInvited === "YES" &&
        guest.guestInvitationResponse &&
        guest.guestInvitationDelivered;

      const totalPasses =
        guest.guestParticipation === 0
          ? guest.guestPassesNumberToRecibe
          : guest.guestPassesNumberToRecibe - guest.guestParticipation;

      return acc + (shouldCount ? totalPasses : 0);
    }, 0);
  };

  return (
    <div className="guest-counter">
      <div className="counter-header">
        <h3>📊 Contador de Invitados que no asistirán</h3>
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
        <div className="count-label">
          Invitados que rechazaron la invitación
        </div>
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

export default GuestRejectCounter;
