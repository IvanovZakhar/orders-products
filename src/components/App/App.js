 
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
  const [allOrdersWB, setAllOrdersWB] = useState([])
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
        getAllLogs,
        getAllOrdersWB,
        getAllOrdersYandex, clearError} = useOrderService();
  const [allProducts, setAllProducts] = useState([])
  const [photoProducts, setPhotoProducts] = useState([])
  const [productsWarehouse, setProductsWarehouse] = useState([])
  const [productsOrdersBarcode, setProductsOrdersBarcode] = useState([])
  const [allOrdersYandex, setAllOrdersYandex] = useState([])

  
  useEffect(() => {
    getAllProductsWarehouse().then(setProductsWarehouse)
    getAllOrdersYandex().then(setAllOrdersYandex)
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
    // Получаем текущую дату
    const currentDate = new Date();

    // Дата неделю назад
    const weekAgo = new Date();
    weekAgo.setDate(currentDate.getDate() - 7);

    // Дата неделю вперед
    const weekLater = new Date();
    weekLater.setDate(currentDate.getDate() + 7);
    

    getAllOrdersWB(weekAgo.toISOString().split('T')[0], weekLater.toISOString().split('T')[0], JSON.parse(localStorage.apiData)[2].apiKey).then(setAllOrdersWB)
  }, [])
 
  useEffect(()=> {
    const key = {
      'Client-Id': localStorage.clientId,
      'Api-Key': localStorage.apiKey
    };

    console.log(localStorage.nameCompany)
    if(localStorage.nameCompany === 'Яндекс'){
      console.log(localStorage.nameCompany)
      getAllOrdersYandex().then(setAllOrdersYandex)
    }else{
      getAllOrders(formData, key).then(orders => { 
        getAllLogs().then(logs => {
          setLogs(logs)
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
    }
  
       
  }, [localStorage.clientId])
 

  useEffect(() => {
    onLoadingProducts();
  }, [localStorage.data]);
 
 
  const onLoadingProducts = (data = localStorage.data) => {
 
   };

    const onLoadingProduct = (barcode) => { 
  
 
      if(barcode.slice(0, 3) !== 'OZN' && barcode.slice(0,3) !== 'ЩЯТ' && barcode !== '1110011' && barcode.slice(0, 2) !== 'WB'){
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
          
          const res = allOrdersYandex.filter(item => item.id == barcode)
      
          if(res.length){
            clearError()
            console.log(res)
            generateOrderInfoYandex (res[0])
                setCompany('Яндекс')
          }
    

        }
        ))
      }else if(barcode.slice(0, 2) === 'WB'){
        const order = allOrdersWB.filter(orderWB => orderWB.id === +barcode.slice(2)) 
        generateOrderInfoWB(order)
        setCompany('WB')
      }
  }; 


  function generateOrderInfo (dataProduct) {
    
    console.log(dataProduct)
    const productsForOrders = productsOrdersBarcode.filter(product => product.article === dataProduct[0].offer_id || dataProduct[0].offerId)
    // После данных взаимодействий в зависимости от результата устанавливаем режим сборщика или не устанавливаем
    // Так же включая режим сборщика умножаем dataProduct[0].quantity на все quantity в productsForOrders.orders  
    if(productsForOrders.length){   
       const orders = productsForOrders[0].orders.map(order => {
          const elem =  photoProducts.filter(item => item.article === order.article)
          
          return{...order, 
                quantity: order.quantity * dataProduct[0].quantity, 
                counter: 0 , 
                success: false, 
                main_photo_link: elem.length ?  elem[0].main_photo_link : null,
                name_of_product: elem.length ?  elem[0].name_of_product : null}
       })
       setOrders(orders)
    }else{
      setOrders([])
    }
    const productBarcode = allProducts.filter(item => item.article === dataProduct[0].offer_id) 
    productBarcode[0].postingNumber = dataProduct[0].posting_number;
    // productBarcode[0].warehouse = data.warehouse;
    productBarcode[0].quantity = dataProduct[0].quantity
    productBarcode[0].date = `${dataProduct[0].shipment_date.slice(8, 10)}.${dataProduct[0].shipment_date.slice(5, 7)}.${dataProduct[0].shipment_date.slice(0, 4)}`
    // productBarcode[0].quantity = dataProduct.products[0].quantity;
 
    const photo = photoProducts.filter(item => item.article === dataProduct[0].offer_id)
 
    productBarcode[0].photo = photo[0] ? photo[0].main_photo_link : null 
    setProduct([
      productBarcode[0]
    ])
  }

  function generateOrderInfoYandex (res) { 
    const productsForOrders = productsOrdersBarcode.filter(product => product.article === res.items[0].offerId) 
    // После данных взаимодействий в зависимости от результата устанавливаем режим сборщика или не устанавливаем
    // Так же включая режим сборщика умножаем dataProduct[0].quantity на все quantity в productsForOrders.orders  
    if(productsForOrders.length){   
       const orders = productsForOrders[0].orders.map(order => {
          const elem =  photoProducts.filter(item => item.article === order.article)
          
          return{...order, 
                quantity: order.quantity * res.items[0].count, 
                counter: 0 , 
                success: false, 
                main_photo_link: elem.length ? elem[0].main_photo_link : null,
                name_of_product: elem.length ? elem[0].name_of_product : null}
       })
       setOrders(orders)
    }else{
      setOrders([])
    }
    const productBarcode = allProducts.filter(item => item.article === res.items[0].offerId) 
    productBarcode[0].postingNumber = res.id; 
    productBarcode[0].quantity = res.items[0].count
    productBarcode[0].date = res.delivery.shipments[0].shipmentDate 
    productBarcode[0].warehouse = 'Яндекс' 
      const photo = photoProducts.filter(item => item.article === res.items[0].offerId)
      
      productBarcode[0].photo = photo[0] ? photo[0].main_photo_link : null
      console.log(productBarcode)
      setProduct([
        productBarcode[0]
      ])
  }

 function generateOrderInfoWB (dataProduct) {
    console.log(dataProduct)
    const productsForOrders = productsOrdersBarcode.filter(product => product.article === dataProduct[0].article)
    // После данных взаимодействий в зависимости от результата устанавливаем режим сборщика или не устанавливаем
    // Так же включая режим сборщика умножаем dataProduct[0].quantity на все quantity в productsForOrders.orders  
    if(productsForOrders.length){   
       const orders = productsForOrders[0].orders.map(order => {
          const elem =  photoProducts.filter(item => item.article === order.article) 
          return{...order, 
                quantity: order.quantity * 1, 
                counter: 0 , 
                success: false, 
                main_photo_link: elem.length ?  elem[0].main_photo_link : null,
                name_of_product: elem.length ?  elem[0].name_of_product : null}
       })
       setOrders(orders)
    }else{
      setOrders([])
    } 
    const productBarcode = allProducts.filter(item => item.article === dataProduct[0].article) 
    productBarcode[0].postingNumber = dataProduct[0].id;
    // productBarcode[0].warehouse = data.warehouse;
    productBarcode[0].quantity = 1
    productBarcode[0].date = `Не указан`
    // productBarcode[0].quantity = dataProduct.products[0].quantity;
 
    const photo = photoProducts.filter(item => item.article === dataProduct[0].article);

    if (photo.length > 0) {
      productBarcode[0].photo = photo[0].main_photo_link;
    } else {
      // Если массив photo пуст, устанавливаем productBarcode[0].photo в null (или что-то другое по умолчанию)
      productBarcode[0].photo = null;
    }
     

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
                                         orders={orders} 
                                        logs={logs}/>} /> 
        <Route path="/adding-products" element={ <AddingProducts products={productsWarehouse}/>} /> 
        <Route path="/print-barcode" element={ <PrintBarcode photoProducts={photoProducts}/>} /> 
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
