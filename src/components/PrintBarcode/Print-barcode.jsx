import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import useOrderService from '../../services/OrderService';
import { useBarcode } from 'next-barcode';
import Badge from 'react-bootstrap/Badge';
import onScan from 'onscan.js' 
import ModalPrint from '../modal/modal-print'; 

const PrintBarcode = ({photoProducts, productsWarehouse}) => {
    const [products, setProducts] = useState([])
    const [productsWB, setProductsWB] = useState([])
    const {getAllProductsWarehouse, printBarcode, getAllProductsWB} = useOrderService()
    const [onScanInitialized, setOnScanInitialized] = useState(false) 
    const [modalOpen, setModalOpen] = useState(false)
    const [printName, setPrintName] = useState('')
    const [photo, setPhoto] = useState('')
 
    
    useEffect(() => {
        getAllProductsWarehouse().then(productsWarehouse =>  {
          setProducts(productsWarehouse)
          
          // Данная фильтрация предназначена для WB

          // getAllProductsWB().then(prodWb => {
          //   setProductsWB(prodWb)
          //   const res = productsWarehouse.map(item => {
          //       const resFilter = prodWb.filter(prod => prod.article === item.article)
          //       if(resFilter.length){
          //         return{
          //           ...item, 
          //           barcodeWb: resFilter[0].barcode
          //       } 
          //       } else{
          //         return item
          //       }
          //   })
          //   const filtResult = res.filter(item => item.barcodeWb)
          //   setProducts(filtResult)
          // })
        })
       
    }, [])

    useEffect(() => {
      console.log('photoProducts:', photoProducts);
      console.log('newProducts до фильтрации:', photoProducts);
      const newProductsFiltered = photoProducts.filter(product => product.article.slice(0, 4) === 'AR19');
      console.log('newProducts после фильтрации:', newProductsFiltered);
    }, [photoProducts]);
    


    useEffect(() => {
      let lastScanTime = 0;
      const handleScan = (e) => {
        console.log(e.detail.scanCode);
        const scanCode = e.detail.scanCode;
        console.log(typeof scanCode)
        const currentTime = Date.now();
        if (currentTime - lastScanTime < 1000) {
          // Игнорировать повторное событие, если прошло менее секунды
          return;
        }
    
        lastScanTime = currentTime;
        
        // Ваш обработчик события scanCode
        if(scanCode.slice(0,3) === 'OZN' || scanCode.slice(0,3) === 'BAR'  || scanCode.slice(0,1) === '2'){
          setModalOpen(true)
          setPrintName(scanCode)
        }
        if(scanCode === 'print222'){ 
          setPrintName(prevPrint => {
            printBarcode(prevPrint, 1).then(() => {
            
              setModalOpen(false)
            })
            return prevPrint
          })
          
        }else if(scanCode === 'print555'){
          setPrintName(prevPrint => {
            printBarcode(prevPrint, 5).then(() => {
              setModalOpen(false)
            })
            return prevPrint
          })
        }else if(scanCode === 'print101'){
          setPrintName(prevPrint => {
            printBarcode(prevPrint, 10).then(() => {
              setModalOpen(false)
            })
            return prevPrint
          })
        }else if(scanCode === 'print301'){
          setPrintName(prevPrint => {
            printBarcode(prevPrint, 30).then(() => {
              setModalOpen(false)
            })
            return prevPrint
          })
        }

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
      if (!onScanInitialized) {
      onScan.attachTo(document);
      setOnScanInitialized(true);
      }
     
  }, []);

    useEffect(() => { 
        const res = products.filter(product => product.barcode.slice(3,10) === printName.slice(3, 10))
       setPhoto(res[0])
    }, [printName])

 
    const Barcode = ({barcodeOrders}) => {
      const options = {
          value: `${barcodeOrders}`,
          options: {
            background: '#ffffff',
            height: '50',
            width: '2', 
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

    const articlesToFilter = [
      'КК-1',
      'КД-З',
      'КД-Б', 
      
      
    ];
    
    // const newProducts = photoProducts.filter(product => {
    //   return articlesToFilter.includes(product.article);
    // }); 
    console.log(photoProducts)

    const newProducts = photoProducts.filter(product => product.article.slice(0, 4) == 'AR19')
    
    console.log(newProducts)
    return(
       
 
            <Row> 
                 <ModalPrint modalOpen={modalOpen} setModalOpen={setModalOpen} photo={photo} printName={printName}/>
                  {newProducts.map((product, i) => {
                    console.log(newProducts)
                    const {article, main_photo_link, name_of_product, barcode, barcode_serial_number_ean} = product 
                  
                    if(barcode_serial_number_ean){

                      return(
                        <Card style={{ width: '20rem', height: '525px', marginLeft: '70px',  marginTop: '20px' }}> 
                          <Card.Img variant="top" src={main_photo_link} style={{ width: '150px' }}/>
                          <Card.Body style={{padding: '0'}}>
                            <Card.Title style={{fontWeight: 'bold'}}>{article}</Card.Title>
                            <Card.Title>{name_of_product.slice(0, 100)}</Card.Title>
                            Штрихкод
                            <Barcode barcodeOrders={barcode_serial_number_ean}/>
                            Наклейка
                            <Barcode barcodeOrders={`BAR${barcode_serial_number_ean.slice(3, 13)}`}/>
                          </Card.Body>
                         </Card>
                        )
                    }
             
                    
                  })
                    
                  }
            </Row>
        
    )
}


export default PrintBarcode