 
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useOrderService from '../../services/OrderService';
import Table from '../Table/Table';
import NavLink from 'react-bootstrap/esm/NavLink';
import './App.css'; 
import AddingProducts from '../AddingProducts/AddingProducts';
import PrintBarcode from '../PrintBarcode/Print-barcode';
import UpdateStatusWarehouse from '../UpdateStatusWarehouse/update-status-warehouse';
import ListOrder from '../list-order/ListOrder';


function App() {
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState('');
  const [company, setCompany] = useState('');
  const [warehouse, setWarehouse] = useState('Неизвестен')
  const [date, setDate] = useState(''); 
  const [allOrders, setAllOrders] = useState([])
  const [logs, setLogs] = useState([])
  const {getInfoProducts, 
        getBaskets, 
        getAllProducts, 
        getBasketsProduct, 
        productBarcode, 
        getPhotoProducts, 
        getWerehouse, 
        loading, 
        error , 
        productBarcodeYandex, 
        getAllProductsWarehouse,
        getProductsForOrdersBarcode,
        getAllOrders,
        getAllLogs} = useOrderService();
  const [allProducts, setAllProducts] = useState([])
  const [photoProducts, setPhotoProducts] = useState([])
  const [productsWarehouse, setProductsWarehouse] = useState([])
  const [productsOrdersBarcode, setProductsOrdersBarcode] = useState([])
 

  
  useEffect(() => {
    getAllProductsWarehouse().then(setProductsWarehouse)
    
}, [])

 
  

  // Загрузка переменных среды из файла .env
  const arsenalClientId = process.env.REACT_APP_ARSENAL_CLIENT_ID;
  const arsenalApiKey = process.env.REACT_APP_ARSENAL_API_KEY;
  const cmaClientId = process.env.REACT_APP_CMA_CLIENT_ID;
  const cmaApiKey = process.env.REACT_APP_CMA_API_KEY;

  // Далее можно использовать эти переменные в коде
  const arsenal = {
    'Client-Id': JSON.parse(localStorage.apiData)[0].clientId,
    'Api-Key': JSON.parse(localStorage.apiData)[0].apiKey
  };

  const cma = {
    'Client-Id': JSON.parse(localStorage.apiData)[1].clientId,
    'Api-Key': JSON.parse(localStorage.apiData)[1].apiKey
  }; 
  
  const formData = JSON.stringify({
    dir: 'ASC',
    filter: {
      cutoff_from: `${localStorage.data}T00:00:00.000Z`,
      cutoff_to: `${localStorage.data}T17:00:00Z`,
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
})

  // Устанавливаем продукты для нарядов с базы
  useEffect(() => {
    
    getInfoProducts().then(setAllProducts) 
    getPhotoProducts().then(setPhotoProducts) 
    getProductsForOrdersBarcode().then(setProductsOrdersBarcode)
 
  }, [])
 
  useEffect(()=> {
    const key = {
      'Client-Id': localStorage.clientId,
      'Api-Key': localStorage.apiKey
    };

    getAllOrders(formData, key).then(orders => { 
      getAllLogs().then(logs => {
      
        const res = orders.map(order => {
          const filtRes = logs.find(log => log.comment === order.postingNumber)
           if(filtRes){
            return{
              ...order, packed: true
            }
           }else{
            return order
           }
           
        })
        setAllOrders(res)
      })
})
  }, [localStorage.clientId])
 

  useEffect(() => {
    onLoadingProducts();
  }, [localStorage.data]);
 
 
  const onLoadingProducts = (data = localStorage.data) => {
 
   };

    const onLoadingProduct = (barcode) => { 
      if(barcode.slice(0, 3) !== 'OZN' && barcode.slice(0,3) !== 'ЩЯТ' && barcode !== '1110011'){
        const formData = JSON.stringify({
          "barcode": `${barcode}`
      });
      
      const arr = [];
      console.log(barcode)
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
          // Устанавливаем информацию об складе
          getWerehouse(headDelivering, arsenal).then(data => setWarehouse(data.delivery_method.warehouse)).catch( setWarehouse("Неизвестно"))
          // Формируем информацию о заказе
          generateOrderInfo (dataProduct)
          // Устанавливаем информацию о компании
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
        // Устанавливаем информацию об складе
        getWerehouse(headDelivering, cma).then(data => setWarehouse(data.delivery_method.warehouse)).catch( setWarehouse("Неизвестно"))
        // Формируем информацию о заказе
        generateOrderInfo (dataProduct)
        // Устанавливаем информацию о компании
        setCompany('ЦМА')
      })
      .catch(er =>{  
        console.log(er)
        productBarcodeYandex(barcode).then(res => {
         
       
            const productBarcode = allProducts.filter(item => item.article === res.items[0].offerId)
      
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
      }
  }; 


  function generateOrderInfo (dataProduct) {
    console.log(dataProduct)
    console.log( productsOrdersBarcode)
    const productsForOrders = productsOrdersBarcode.filter(product => product.article === dataProduct[0].offer_id)
    // После данных взаимодействий в зависимости от результата устанавливаем режим сборщика или не устанавливаем
    // Так же включая режим сборщика умножаем dataProduct[0].quantity на все quantity в productsForOrders.orders 
    console.log(productsForOrders)
    if(productsForOrders.length){   
       const orders = productsForOrders[0].orders.map(order => {
          const elem = productsWarehouse.filter(product => product.article === order.article)
          
          console.log(elem)
          return{...order, 
                quantity: order.quantity * dataProduct[0].quantity, 
                counter: 0 , 
                success: false, 
                main_photo_link: elem[0].main_photo_link,
                name_of_product: elem[0].name_of_product}
       })
       setOrders(orders)
    }else{
      setOrders([])
    }
    const productBarcode = allProducts.filter(item => item.article === dataProduct[0].offer_id)
    console.log(productBarcode)
    productBarcode[0].postingNumber = dataProduct[0].posting_number;
    // productBarcode[0].warehouse = data.warehouse;
    productBarcode[0].quantity = dataProduct[0].quantity
    productBarcode[0].date = `${dataProduct[0].shipment_date.slice(8, 10)}.${dataProduct[0].shipment_date.slice(5, 7)}.${dataProduct[0].shipment_date.slice(0, 4)}`
    // productBarcode[0].quantity = dataProduct.products[0].quantity;
 
    const photo = photoProducts.filter(item => item.article === dataProduct[0].offer_id)
 
    productBarcode[0].photo = photo[0] ? photo[0].main_photo_link : null
    console.log(productBarcode)
    setProduct([
      productBarcode[0]
    ])
  }
 
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/table" element={<Table
                                         props={product}
                                         date={date}
                                         setDate={setDate} 
                                         onLoadingProduct={onLoadingProduct} 
                                         loading={loading} 
                                         error={error}
                                         setCompany={setCompany}
                                         company={company}
                                         warehouse={warehouse}
                                         orders={orders}/>} /> 
        <Route path="/adding-products" element={ <AddingProducts products={productsWarehouse}/>} /> 
        <Route path="/print-barcode" element={ <PrintBarcode />} /> 
        <Route path="/update-status-warehouse" element={ <UpdateStatusWarehouse photoProducts={productsWarehouse}/>} /> 
        <Route path="/list-order" element={<ListOrder 
                                                    props={allOrders} 
                                                    date={date} 
                                                    setDate={setDate} 
                                                    onLoadingProducts={onLoadingProducts}  
                                                    logs={logs}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
