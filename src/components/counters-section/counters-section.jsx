import './counters-section.css';
import GuestCounter from '../guest-counter/GuestCounter';
import GestAceptationCounter from '../guest-accept-invitation-counter/GestAceptationCounter';
import GuestChickenCounter from '../guest-chiken-counter/GuestChickenCounter';
import GuestPorkCounter from '../guest-pork-counter/GuestPorkCounter';
import GuestTrasportationCounter from '../guest-tranportation counter/GuestTrasportationCounter';
import GuestRejectCounter from '../guest-reject-invitation-counter/GuestRejectCounter';

const countersSection = () => {
    return (
        <section className="counters-section">
            <GuestCounter />
            <GestAceptationCounter />
            <GuestChickenCounter />
            <GuestPorkCounter />
            <GuestTrasportationCounter />
            <GuestRejectCounter />
        </section>
    )
}

export default countersSection;