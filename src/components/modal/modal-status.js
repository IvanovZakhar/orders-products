 
import Modal from "react-modal"; 
 
 


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    width: 600,
    minHeight: 150,
    borderRadius: 10
  },
};

function ModalStatus({ modalStatusOpen, setStatusModalOpen, status}) {
    
  return (
    <div className="modal-order">
       
      <Modal
        isOpen={modalStatusOpen}
        onRequestClose={() => setStatusModalOpen(false)}
        style={customStyles}
        ariaHideApp={false} 
      >
         <h2 style={{textAlign: 'center', fontSize:'86px', color: `${status === 'Успешно!' ? 'green' : 'red'}`}}>{status}</h2> 
      </Modal>
    </div>
  );
}

export default ModalStatus;