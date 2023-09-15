
import { useEffect, useState } from "react";
import useOrderService from "../../services/OrderService";
import onScan from 'onscan.js' 
import Table from 'react-bootstrap/Table';
import './AddingProducts.css'
import { useBarcode } from 'next-barcode';
import ModalStatus from "../modal/modal-status";
import debounce from 'lodash/debounce';

const AddingProducts = ({products}) => { 
    const {updateProductQuantityPlus, loading, updateProducts} = useOrderService() 
    const [onScanInitialized, setOnScanInitialized] = useState(false) 
    const [newProducts, setNewProducts] = useState([])
    const [modalStatusOpen, setStatusModalOpen] = useState(false);
    const [status, setStatus] = useState('') 
    const debouncedUpdate = debounce(updateProductQuantityPlus, 1000); // Настраиваем задержку в миллисекундах

    // Маршрут между страницами по barcode
    useEffect(() => { 

        const handleScan = (e) => {
            const scanCode = e.detail.scanCode;
            console.log(scanCode)
            if(scanCode === 'orders111'){
              window.location.href = `/table`
            }else if(scanCode === 'ref111'){
                window.location.href = `/adding-products`
            }else if(scanCode === 'listorder111'){
                window.location.href = `/update-status-warehouse`
            }else if(scanCode === 'print111' ){
              window.location.href = '/print-barcode'
            }
          };

        document.addEventListener('scan', handleScan);

        // Очистка обработчика событий при размонтировании компонента
        return () => {
        document.removeEventListener('scan', handleScan);
        };
    }, []); 


    useEffect(() => {
        const handleScan =  (e) => {  

              const scannedBarcode = e.detail.scanCode; 
              const addedProducts = products.filter(product => product.barcode === e.detail.scanCode) 
              if (addedProducts.length > 0) {
              setNewProducts(prevProducts => {
                  
                  addedProducts[0].comment = "Возврат"
                  const updatedProductsDict = {};
                  prevProducts.forEach(product => {
                      updatedProductsDict[product.barcode] = {
                          ...product,
                          comment: 'Возврат',
                          quantity: product.quantity + (updatedProductsDict[product.barcode]?.quantity || 0)
                      };
                  });
  
                  if (!updatedProductsDict[scannedBarcode]) {
                      updatedProductsDict[scannedBarcode] = {
                          ...addedProducts[0],
                          quantity: 1
                      };
                  } else {
                      updatedProductsDict[scannedBarcode].quantity += 1;
                  }
        
                  const updatedProductsArray = Object.values(updatedProductsDict);
          
                  return updatedProductsArray;
              }); 
          } 


        if(e.detail.scanCode === 'SEND111'){ 
          setNewProducts(prevProducts => { 
            console.log(prevProducts)
            // Где-то в вашем коде (например, в обработчике события)
            handleDebouncedUpdate(prevProducts);
            return prevProducts
          })
        }
      

        };
    
        document.addEventListener('scan', handleScan);
    
        // Очистка обработчика событий при размонтировании компонента
        return () => {
        document.removeEventListener('scan', handleScan);
        };
    }, [products]);


    
    useEffect(() => {
      if (!onScanInitialized && !loading) {
        onScan.attachTo(document);
        setOnScanInitialized(true);
      }
    }, []);

 
    
    const elems = newProducts.map((product, i) => {
      const {article, name_of_product, main_photo_link, quantity} = product
      return(
        <tr>
          <td className="item_product">{i+1}</td>
          <td ><img src={main_photo_link} className="photo"/></td>
          <td className="item_product">{article}</td>
          <td className="item_product">{name_of_product}</td>
          <td className="quantity-product">{quantity}</td>
      </tr>
      )
    })

    const Barcode = (barcodeOrders) => {
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

    // Оберните вызов debouncedUpdate в асинхронную функцию, чтобы обработать промис
async function handleDebouncedUpdate(prevProducts) {
  try {
    await debouncedUpdate(prevProducts);
    setStatusModalOpen(true);
    setStatus('Успешно!');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } catch (error) {
    setStatusModalOpen(true);
    setStatus('Ошибка');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
}



    return(
      <>
      <h1>Добавление товаров на Склад</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>№</th>
              <th>Фото</th>
              <th>Артикул</th>
              <th>Название</th>
              <th>Кол-во</th>
            </tr>
          </thead>
          <tbody>
            {elems}
          
          </tbody>
      </Table>

      <div className="submit">
        <h2>Вернуть товары на склад</h2>
        {Barcode('SEND111')}
      </div>
      <ModalStatus modalStatusOpen={modalStatusOpen} setStatusModalOpen={setStatusModalOpen} status={status}/>
    </>
    )
}

export default AddingProducts;