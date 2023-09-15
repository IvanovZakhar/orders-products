 
import Modal from "react-modal"; 
import { useBarcode } from 'next-barcode';
 


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
    minHeight: 300,
    borderRadius: 10
  },
};

function ModalPrint({ modalOpen, setModalOpen, photo }) { 
    const Barcode = ({barcodeOrders}) => {
        const options = {
            value: `${barcodeOrders}`,
            options: {
              background: '#ffffff',
              height: '70',
              width: '4', 
              display: 'flex',
              justifyContent: 'center'
            }
          };
        const { inputRef } = useBarcode(options);
      
        return <svg className='barcode' ref={inputRef} style={  {
            display: 'block',
            margin: '0 auto',
            textAlign: 'center'
          }}/>;
      };
  return (
    <div className="modal-order">
       
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
        ariaHideApp={false} 
      >
            <img src={photo ? photo.main_photo_link : null} style={{width: '300px', marginLeft: '140px'}}/>
         <h2 style={{textAlign: 'center', fontSize:'86px' }}>1 шт</h2> 
         <Barcode barcodeOrders='print222' />
         <h2 style={{textAlign: 'center', fontSize:'86px' }}>5 шт</h2> 
         <Barcode barcodeOrders='print555' />
         <h2 style={{textAlign: 'center', fontSize:'86px' }}>10 шт</h2> 
         <Barcode barcodeOrders='print101' />
         <h2 style={{textAlign: 'center', fontSize:'86px' }}>30 шт</h2> 
         <Barcode barcodeOrders='print301' />
      </Modal>
    </div>
  );
}

export default ModalPrint;