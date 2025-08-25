import './table.css';
import  InvitationLink  from '../invitation-link/invitationLink';
const Table = ({ guestList }) => {
return (
    <>
    {guestList.length > 0 ?
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Invitado por</th>
            <th>Relación con los novios</th>
            <th>Tipo de invitado</th>
            <th>Prioridad de la invitación</th>
            <th>Fué invitado</th>
            <th>Número de pases</th>
            <th>Probabilidad de asistencia</th>
            <th>Asistirá</th>
            <th>Contacto</th>
            <th>Contacto secundario</th>
            <th>Se entregó invitacion impresa</th>
            <th>Invitación enviada</th>
            <th>Lenguaje</th>
            <th>Número de platillos de pollo</th>
            <th>Número de platillos de cerdo</th>
            <th>Es foraneo</th>
            <th>Solicito transporte</th>
            <th>Número de personas en transporte</th>
            <th>Link de la invitacion</th>
            <th>Número de mesa</th>
            <th>Enviar invitacion</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {guestList.map((guest, index) => (
            <tr key={index}>
              <td>{guest.guestName}</td>
              <td>{guest.guestSide}</td>
              <td>{guest.guestRelationship}</td>
              <td>{guest.guestType}</td>
              <td>{guest.guestPriority}</td>
             <td>{guest.guestInvited === 'YES' ? 'Sí' : 'No'}</td>
              <td>{guest.guestPassesNumberToRecibe}</td>
            <td>{guest.guestProbability}</td>
            <td>{!guest.guestInvitationDelivered ? 'Invitación aun no enciada' :guest.guestParticipation > 0 && guest.guestInvitationResponse ? 'Si' : 'No'}</td>
            <td>{guest.guestPrimaryContact}</td>
            <td>{guest.guestSecondaryContact ?? 'No tiene'}</td>
            <td>{guest.guestInvitationDelivered ? 'Sí' : 'No'}</td>
            <td>{guest.guestInvitationSent ? 'Sí' : 'No'}</td>
            <td>{guest.guestLanguage === 'Espanol' ? 'Español': guest.guestLanguage}</td>
            <td>{guest.guestChickenCountDesire}</td>
            <td>{guest.guestPorkCountDesire}</td>
            <td>{guest.guestForeigner === 'YES' ? 'Sí' : 'No'}</td>
            <td>{guest.guestTransportCount > 0 ? 'Sí' : 'No'}</td>
            <td>{guest.guestTransportCount}</td>
            <td>{<InvitationLink invitationId={guest.guestInvitationId}/>}</td>
            <td>{guest.guestTableNumber ?? 'No asignada'}</td>
            <td>{!guest.guestInvitationDelivered ? 'Pendiente' : guest.guestInvitationDelivered ? 'Enviada' : 'Pendiente'}</td>
            </tr>
          ))}
        </tbody>
      </table> : <p>No guests available</p>
    }
    </>
  );
}
export default Table;