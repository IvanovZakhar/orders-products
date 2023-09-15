



import React, { useState } from "react";
import Modal from "react-modal"; 
import { useBarcode } from 'next-barcode';
import Badge from 'react-bootstrap/Badge';


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    width:   470,
    minHeight: 1000,
    borderRadius: 10
  },
};

function ModalMasters({modalOpenMasters, setModalOpenMasters}) {
   
    const Barcode = ({barcodeOrders}) => {
        const options = {
            value: `${barcodeOrders}`,
            options: {
              background: '#ffffff',
              height: '100',
              width: '3', 
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
        isOpen={modalOpenMasters}
        onRequestClose={() => setModalOpenMasters(false)}
        style={customStyles}
        ariaHideApp={false}
     
      >
        <h2>Укажите мастера: </h2>
        <br/>   <br/>   <br/>
         <h3 style={{textAlign: 'center'}}>
            <Badge bg= "secondary" style={{fontSize: '24px'}}>Манин</Badge> 
            {<Barcode barcodeOrders={'dima111'}/>}
         </h3> 
         <br/>   <br/>    <br/>
         <br/>   <br/>   <br/>
         <h3 style={{textAlign: 'center'}}>
            <Badge bg= "secondary" style={{fontSize: '24px'}}>Бегян</Badge> 
            {<Barcode barcodeOrders={'karlen111'}/>}
         </h3> 
   
        
      </Modal>
    </div>
  );
}

export default ModalMasters;