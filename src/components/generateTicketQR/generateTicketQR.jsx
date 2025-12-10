import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import './generateTicketQR.css';

const GenerateTicketQR = ({ guest }) => {
    const ticketRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Datos para el QR code (JSON stringificado)
    const qrData = JSON.stringify({
        nombre: guest?.guestName || 'N/A',
        pases: guest?.guestParticipation || 0,
        mesa: guest?.guestTableNumber || 'N/A',
        position: guest?.guestTablePosition,
        asientosEnTransporte: guest?.guestTransportCount,
    });

    const handleDownload = async () => {
        if (!guest) {
            alert('No hay datos del invitado disponibles');
            return;
        }

        // Validar que tenga los datos necesarios
        if (!guest.guestName) {
            alert('El invitado no tiene nombre asignado');
            return;
        }

        if (!guest.guestTableNumber) {
            alert('El invitado no tiene mesa asignada');
            return;
        }
        if(!guest.guestTablePosition){
            alert('El invitado no tiene posición de mesa asignada')
            return
        }

        setIsGenerating(true);

        try {
            // Esperar un momento para que el DOM se renderice completamente
            await new Promise(resolve => setTimeout(resolve, 100));

            if (!ticketRef.current) {
                throw new Error('No se pudo encontrar el elemento del ticket');
            }

            // Convertir el ticket a canvas
            const canvas = await html2canvas(ticketRef.current, {
                backgroundColor: '#ffffff',
                scale: 2, // Mayor resolución
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            // Convertir canvas a blob y descargar
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `ticket-${guest.guestName.replace(/\s+/g, '-')}-${guest.guestInvitationId}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');

        } catch (error) {
            console.error('Error al generar el ticket:', error);
            alert('Error al generar el ticket. Por favor, intenta de nuevo.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <button
                onClick={handleDownload}
                disabled={isGenerating || !guest?.guestName || !guest?.guestTableNumber || !guest?.guestTablePosition} 
                className="generate-ticket-btn"
                title={!guest?.guestTableNumber ? 'Asigna una mesa primero' : 'Generar ticket con QR'}
            >
                {isGenerating ? '⏳ Generando...' : '🎫 Generar Ticket'}
            </button>

            {/* Ticket oculto para generar la imagen */}
            <div ref={ticketRef} className="ticket-container" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div className="mark-circle top"></div>

                <div className="ticket-content">
                    {/* Decoración superior */}
                    <div className="ticket-decoration-top">
                        <div className="decoration-line"></div>
                        <div className="decoration-icon"></div>
                        <div className="decoration-line"></div>
                    </div>

                    {/* Header con logo */}
                    <div className="ticket-header">
                        {/* <div className="ticket-logo-placeholder">
                            <div className="logo-text">💐</div>
                        </div> */}
                        <h1 className="ticket-title">Bienvenido a nuestra boda</h1>
                        <p className="ticket-subtitle">Pase de Entrada</p>
                    </div>

                    {/* Información del invitado */}
                    <div className="ticket-guest-info">
                        <div className="guest-name">{guest?.guestName || 'N/A'}</div>
                        <div className="guest-details">
                            <span className="detail-item">
                                <span className="detail-icon">🎫</span>
                                <span className="detail-text">{guest?.guestParticipation || 0} {guest?.guestParticipation === 1 ? 'Pase' : 'Pases'}</span>
                            </span>
                            {guest?.guestTableNumber && (
                                <span className="detail-item">
                                    <span className="detail-icon">🪑</span>
                                    <span className="detail-text">Mesa {guest.guestTableNumber}</span>
                                </span>
                            )}
                            {guest?.guestTransportCount > 0 && (
                                <span className="detail-item">
                                    <span className="detail-icon">🚐</span>
                                    <span className="detail-text">Número de asientos en transporte {guest.guestTransportCount}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="ticket-qr-container">
                        <QRCodeSVG
                            value={qrData}
                            size={220}
                            level="H"
                            includeMargin={true}
                        />
                        {/* <p className="qr-instruction">Escanea este código QR</p> */}
                    </div>

                    {/* Decoración inferior
                    <div className="ticket-decoration-bottom">
                        <div className="decoration-line"></div>
                        <div className="decoration-icon">💐</div>
                        <div className="decoration-line"></div>
                    </div> */}

                    {/* Footer */}
                    <div className="ticket-footer">
                        <p className="footer-text">Gracias por acompañarnos en este día especial</p>
                    </div>
                </div>
                <div className="mark-circle bottom"></div>
                {
                    guest.guestTableCapitan ? (
                           <div className='seal'>
                    <p>Capitan</p>
                </div>
                    )
                    :
                    (<></>)
                }
             
            </div>
        </>
    );
};

export default GenerateTicketQR;

