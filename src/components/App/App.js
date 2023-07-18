 
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useOrderService from '../../services/OrderService';
import Table from '../Table/Table';
import NavLink from 'react-bootstrap/esm/NavLink';
import './App.css'; 


function App() {
  const [orders, setOrders] = useState('');
  const [product, setProduct] = useState('');
  const [company, setCompany] = useState('');
  const [warehouse, setWarehouse] = useState('Неизвестен')
  const [date, setDate] = useState(''); 
  const {getInfoProducts, getBaskets, getAllProducts, getBasketsProduct, productBarcode, getPhotoProducts, getWerehouse, loading, error , productBarcodeYandex} = useOrderService();
  const [allProducts, setAllProducts] = useState([])
  const [photoProducts, setPhotoProducts] = useState([])

  // Загрузка переменных среды из файла .env
  const arsenalClientId = process.env.REACT_APP_ARSENAL_CLIENT_ID;
  const arsenalApiKey = process.env.REACT_APP_ARSENAL_API_KEY;
  const cmaClientId = process.env.REACT_APP_CMA_CLIENT_ID;
  const cmaApiKey = process.env.REACT_APP_CMA_API_KEY;

  // Далее можно использовать эти переменные в коде
  const arsenal = {
    'Client-Id': arsenalClientId,
    'Api-Key': arsenalApiKey
  };

  const cma = {
    'Client-Id': cmaClientId,
    'Api-Key': cmaApiKey
  }; 
 
  // Устанавливаем продукты для нарядов с базы
  useEffect(() => {
    getInfoProducts().then(setAllProducts) 
    getPhotoProducts().then(setPhotoProducts)
  }, [])

console.log(allProducts)

  useEffect(() => {
    onLoadingProducts();
  }, [localStorage.data]);
 

  const onLoadingProducts = (data = localStorage.data) => {
    const formData = JSON.stringify({
      dir: 'ASC',
      filter: {
        cutoff_from: `${data}T00:00:00.000Z`,
        cutoff_to: `${data}T17:00:00Z`,
        delivery_method_id: [],
        provider_id: [],
        status: 'awaiting_deliver',
        warehouse_id: [],
      },
      limit: 100,
      offset: 0,
      with: {
        analytics_data: true,
        barcodes: true,
        financial_data: true,
        translit: true,
      }
  })};

    const onLoadingProduct = (barcode) => {
      const formData = JSON.stringify({
        "barcode": `${barcode}`
    });
    
    const arr = [];
    productBarcode(formData, arsenal).then(dataProduct => {
     
      const headDelivering = JSON.stringify({
        "posting_number":  `${dataProduct[0].posting_number}`,
        "with": {
            "analytics_data": false,
            "barcodes": false,
            "financial_data": false,
            "product_exemplars": false,
            "translit": false
        }
    })
      getWerehouse(headDelivering, arsenal).then(data => setWarehouse(data.delivery_method.warehouse)).catch( setWarehouse("Неизвестно"))
     
        const productBarcode = allProducts.filter(item => item.article === dataProduct[0].offer_id)
 
        console.log(dataProduct)
        productBarcode[0].postingNumber = dataProduct[0].posting_number;
        // productBarcode[0].warehouse = data.warehouse;
        productBarcode[0].quantity = dataProduct[0].quantity
        productBarcode[0].date = `${dataProduct[0].shipment_date.slice(8, 10)}.${dataProduct[0].shipment_date.slice(5, 7)}.${dataProduct[0].shipment_date.slice(0, 4)}`
        // productBarcode[0].quantity = dataProduct.products[0].quantity;
     
        const photo = photoProducts.filter(item => item.article === dataProduct[0].offer_id)
        console.log(photo)
        productBarcode[0].photo = photo[0] ? photo[0].main_photo_link : null
        
        setProduct([
          productBarcode[0]
        ])
        setCompany('АрсеналЪ') 
    }).catch( 
      productBarcode(formData, cma).then(dataProduct => {

 
      const headDelivering = JSON.stringify({
        "posting_number":  `${dataProduct[0].posting_number}`,
        "with": {
            "analytics_data": false,
            "barcodes": false,
            "financial_data": false,
            "product_exemplars": false,
            "translit": false
        }
    })
      getWerehouse(headDelivering, cma).then(data => setWarehouse(data.delivery_method.warehouse)).catch( setWarehouse("Неизвестно"))
   
        const productBarcode = allProducts.filter(item => item.article === dataProduct[0].offer_id)
 
        console.log(dataProduct)
        productBarcode[0].postingNumber = dataProduct[0].posting_number;
        // productBarcode[0].warehouse = data.warehouse;
        productBarcode[0].quantity = dataProduct[0].quantity
        productBarcode[0].date =  `${dataProduct[0].shipment_date.slice(8, 10)}.${dataProduct[0].shipment_date.slice(5, 7)}.${dataProduct[0].shipment_date.slice(0, 4)}`
        // productBarcode[0].quantity = dataProduct.products[0].quantity;
     
        const photo = photoProducts.filter(item => item.article === dataProduct[0].offer_id)
        console.log(photo)
        productBarcode[0].photo = photo[0] ? photo[0].main_photo_link : null
        
        setProduct([
          productBarcode[0]
        ]) 
        setCompany('ЦМА')
    })
    .catch(er =>{ console.log(er)
      productBarcodeYandex(barcode).then(res => {
       
     
          const productBarcode = allProducts.filter(item => item.article === res.items[0].offerId)
          console.log(productBarcode)
          console.log(res)
          productBarcode[0].postingNumber = res.id; 
          productBarcode[0].quantity = res.items[0].count
          productBarcode[0].date = res.delivery.shipments[0].shipmentDate 
          productBarcode[0].warehouse = 'Яндекс' 
            const photo = photoProducts.filter(item => item.article === res.items[0].offerId)
    
            productBarcode[0].photo = photo[0] ? photo[0].main_photo_link : null
           
            setProduct([
              productBarcode[0]
            ])
            setCompany('Яндекс')
       
      
      })}
    ))
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<ListOrder props={orders} date={date} setDate={setDate} onLoadingProducts={onLoadingProducts} />} /> */}
        <Route path="/table" element={<Table
                                         props={product}
                                         date={date}
                                         setDate={setDate} 
                                         onLoadingProduct={onLoadingProduct} 
                                         loading={loading} 
                                         error={error}
                                         setCompany={setCompany}
                                         company={company}
                                         warehouse={warehouse}/>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App
