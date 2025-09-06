import './counter-section.css';
import GuestCounter from '../guest-counter/GuestCounter';
import GestAcceptationCounter from '../guest-accept-invitation-counter/GestAceptationCounter';
import GuestChickenCounter from '../guest-chiken-counter/GuestChickenCounter';
import GuestPorkCounter from '../guest-pork-counter/GuestPorkCounter';
import GuestTransportationCounter from '../guest-tranportation counter/GuestTrasportationCounter';
import GuestRejectCounter from '../guest-reject-invitation-counter/GuestRejectCounter';
import GuestChurchAssistance from '../guest-church-assitance/GuestChurchAssistance';
import GuestReceptionAssistance from '../guest-reception-assitance/GuestReceptionAssistance';
import GuestInvitationCounter from '../guest-invitation-counter/GuestInvitationCounter';
import GuestInvitationSendedCounter from '../guest-invitations-sended-counter/GuestInvitationSendedCounter';
import GuestSendRemainingInvitationCounter from '../guest-invitations-remaining-counter/GuestSendRemainingInvitationCounter';

const CountersSection = () => {
    return (
        <section className="counters-section">
            <GuestCounter />
            <GuestInvitationCounter />
            <GuestInvitationSendedCounter />
            <GuestSendRemainingInvitationCounter />
            <GestAcceptationCounter />
            <GuestRejectCounter />
            <GuestChurchAssistance />
            <GuestReceptionAssistance />
            <GuestChickenCounter />
            <GuestPorkCounter />
            <GuestTransportationCounter />
        </section>
    )
}

export default CountersSection;