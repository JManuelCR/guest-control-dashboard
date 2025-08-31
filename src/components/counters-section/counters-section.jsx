import './counter-section.css';
import GuestCounter from '../guest-counter/GuestCounter';
import GestAcceptationCounter from '../guest-accept-invitation-counter/GestAceptationCounter';
import GuestChickenCounter from '../guest-chiken-counter/GuestChickenCounter';
import GuestPorkCounter from '../guest-pork-counter/GuestPorkCounter';
import GuestTransportationCounter from '../guest-tranportation counter/GuestTrasportationCounter';
import GuestRejectCounter from '../guest-reject-invitation-counter/GuestRejectCounter';

const CountersSection = () => {
    return (
        <section className="counters-section">
            <GuestCounter />
            <GestAcceptationCounter />
            <GuestRejectCounter />
            <GuestChickenCounter />
            <GuestPorkCounter />
            <GuestTransportationCounter />
        </section>
    )
}

export default CountersSection;