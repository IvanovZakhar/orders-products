import React, { useState } from "react";
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
    width:   530,
    minHeight: 200,
    borderRadius: 10
  },
};

function ModalSend({address, handleAddToAddress, modalOpen, setModalOpen}) {

    const Barcode = ({barcodeOrders}) => {
        const options = {
            value: `${barcodeOrders}`,
            options: {
              background: '#ffffff',
              height: '100',
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
      <div className="default_address">
           
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
        ariaHideApp={false}
     
      >
         <h3 style={{textAlign: 'center'}}>Отсканируйте для отправки</h3>
          {<Barcode barcodeOrders={'SEND111'}/>}
      </Modal>
    </div>
  );
}

export default ModalSend;