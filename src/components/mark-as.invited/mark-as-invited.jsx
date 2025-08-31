import './mark-as-invited.css';
import { useContext, useState } from 'react';
import { DataContext } from '../../context/DataContext';

const MarkAsInvited = ({ userId, guestData }) => {
  const { updateGuest } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determinar el estado inicial basado en los datos recibidos
  const [isInvited, setIsInvited] = useState(() => {
    if (!guestData) return false;
    return guestData.guestInvitationDelivered === true;
  });

  const handleMarkAsInvited = async () => {
    if (!userId || isLoading) return;

    setIsLoading(true);
    try {
      // Preparar los datos para el PATCH
      const updateData = {
        // Campo principal para el estado de invitación
        wasInvited: !isInvited,
        
        // Campos adicionales para compatibilidad
        guestInvited: !isInvited ? 'YES' : 'NO',
        guestInvitationSent: !isInvited,
        guestInvitationDelivered: !isInvited,
        
        // Fecha de la invitación
        invitationDate: !isInvited ? new Date().toISOString() : null,
        
        // Campo para tracking de cambios
        lastUpdated: new Date().toISOString()
      };

      // Llamar a la función PATCH
      await updateGuest(userId, updateData);
      
      // Actualizar el estado local
      setIsInvited(!isInvited);
      
    } catch (error) {
      console.error('Error al actualizar el estado del invitado:', error);
      // Aquí podrías mostrar un toast o mensaje de error
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar el icono y texto basado en el estado
  const getButtonContent = () => {
    if (isLoading) {
      return { icon: '⏳', text: 'Actualizando...' };
    }
    
    if (isInvited) {
      return { icon: '✅', text: 'Ya Invitado' };
    } else {
      return { icon: '📧', text: 'Marcar como Invitado' };
    }
  };

  const { icon, text } = getButtonContent();

  return (
    <button
      onClick={handleMarkAsInvited}
      disabled={isLoading}
      className={`mark-as-invited-btn ${isInvited ? 'invited' : 'not-invited'} ${isLoading ? 'loading' : ''}`}
      title={isInvited ? 'Click para marcar como no invitado' : 'Click para marcar como invitado'}
    >
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

export default MarkAsInvited;