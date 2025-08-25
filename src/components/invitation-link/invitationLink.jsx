const InvitationLink = ({ invitationId }) => {
  const link = `https://invitation-nine-tan.vercel.app/?invitation=${invitationId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link)
      .then(() => {
        alert("Link copiado al portapapeles: " + link);
      })
      .catch(err => {
        console.error("Error al copiar: ", err);
      });
  };

  return (
    <button onClick={copyToClipboard}>
      {link}
    </button>
  );
};

export default InvitationLink;
