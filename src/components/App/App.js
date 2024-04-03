 
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
  const [errorTable, setErrorTable] = useState(null)
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
        getAllOrdersOZN,
        getAllOrdersYandex, clearError} = useOrderService();
  const [allProducts, setAllProducts] = useState([])
  const [photoProducts, setPhotoProducts] = useState([])
  const [productsWarehouse, setProductsWarehouse] = useState([])
  const [productsOrdersBarcode, setProductsOrdersBarcode] = useState([])
  const [allOrdersYandex, setAllOrdersYandex] = useState([])
  const [ordersOzn, setOrdersOzn] = useState([])
 
  
  useEffect(() => {
    getAllProductsWarehouse().then(setProductsWarehouse)
    getAllOrdersYandex(49023774).then(allOrders => {
      getAllOrdersYandex(77640946).then(allOrdersLarge => {
        getAllOrdersYandex(77640946).then(allOrdersComp => {
          setAllOrdersYandex([...allOrders, ...allOrdersLarge, allOrdersComp])
        })
      })
    })

    JSON.parse(localStorage.getItem('apiData')).forEach(item => {
      const headersOzn = {  
          'Client-Id': `${item.clientId}` ,
          'Api-Key': `${item.apiKey}`
       } 
       console.log(item.clientId)
       getAllOrdersOZN(headersOzn).then(data => {
          if(item.clientId == 634359){
            const ordersArsenal = data.map(item => {return {...item, company: 'Арсенал'}})
            setOrdersOzn(prevOzn => {
              return[...prevOzn, ...ordersArsenal]
              
          })
          }else if(item.clientId == 611694){
            const ordersCma = data.map(item => {return {...item, company: 'ЦМА'}})
            setOrdersOzn(prevOzn => {
              return[...prevOzn, ...ordersCma]
              
          })
          }
       })
  })
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
 
    if(localStorage.nameCompany === 'Яндекс'){ 
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
   
           
        
          
          const resYandex = allOrdersYandex.filter(item => item.id == barcode) 
          const resOzn = ordersOzn.filter(item => item.barcode == barcode)
          console.log(resOzn)
        if(resYandex.length){ 
            setErrorTable(null)
            generateOrderInfoYandex (resYandex[0])
            setCompany('Яндекс')
        }else if(barcode.slice(0, 2) === 'WB'){ 
            setErrorTable(null)
            const order = allOrdersWB.filter(orderWB => orderWB.id === +barcode.slice(2)) 
            generateOrderInfoWB(order)
            setCompany('WB') 
        }else if (resOzn.length){
          setErrorTable(null)
          generateOrderInfo(resOzn)
          setCompany(resOzn[0].company) 
        }else{
          setErrorTable('Штрихкод не найден')
        }
       
  }
}



//   const onLoadingProduct = (barcode) => { 
  
 
//     if(barcode.slice(0, 3) !== 'OZN' && barcode.slice(0,3) !== 'ЩЯТ' && barcode !== '1110011' && barcode.slice(0, 2) !== 'WB'){
//         const formData = JSON.stringify({
//           "barcode": `${barcode}`
//       });
      
//       const arr = []; 
//       productBarcode(formData, arsenal).then(dataProduct => {
      
//         const headDelivering = JSON.stringify({
//           "posting_number":  `${dataProduct[0].posting_number}`,
//           "with": {
//               "analytics_data": false,
//               "barcodes": false,
//               "financial_data": false,
//               "product_exemplars": false,
//               "translit": false
//           }
//       })
//           // Устанавливаем информацию об складе
//           getWerehouse(headDelivering, arsenal).then(data => setWarehouse(data.delivery_method.warehouse)).catch( setWarehouse("Неизвестно"))
//           // Формируем информацию о заказе
//           generateOrderInfo (dataProduct)
//           console.log(dataProduct)
//           // Устанавливаем информацию о компании
//           setCompany('АрсеналЪ') 
//       }).catch( 
//         productBarcode(formData, cma).then(dataProduct => {
  
  
//         const headDelivering = JSON.stringify({
//           "posting_number":  `${dataProduct[0].posting_number}`,
//           "with": {
//               "analytics_data": false,
//               "barcodes": false,
//               "financial_data": false,
//               "product_exemplars": false,
//               "translit": false
//           }
//       })
//         // Устанавливаем информацию об складе
//         getWerehouse(headDelivering, cma).then(data => setWarehouse(data.delivery_method.warehouse)).catch( setWarehouse("Неизвестно"))

//         // Формируем информацию о заказе
//         generateOrderInfo (dataProduct)
//         // Устанавливаем информацию о компании
//         setCompany('ЦМА')
//       })
//       .catch(er =>{    
        
//         const res = allOrdersYandex.filter(item => item.id == barcode) 
//         if(res.length){
//           clearError() 
//           generateOrderInfoYandex (res[0])
//               setCompany('Яндекс')
//         }
  

//       }
//       ))} else if(barcode.slice(0, 2) === 'WB'){ 
//       const order = allOrdersWB.filter(orderWB => orderWB.id === +barcode.slice(2)) 
//       generateOrderInfoWB(order)
//       setCompany('WB')
//     }
// }; 

 


  function generateOrderInfo(dataProductList) {
    console.log(dataProductList)
    const productMap = new Map(allProducts.map(product => [product.article, product]));
    const photoMap = new Map(photoProducts.map(photo => [photo.article, photo]));
    console.log(dataProductList)
    const updatedProductBarcodes = dataProductList.map(dataProduct => {
      const offerId = dataProduct.offer_id || dataProduct.offerId;
      const productsForOrders = productsOrdersBarcode.filter(p => p.article === offerId);
  
      let combinedOrders = [];
      if (productsForOrders.length) {
        combinedOrders = productsForOrders.flatMap(productForOrders =>
          productForOrders.orders.map(order => {
            const photo = photoMap.get(order.article);
            return {
              ...order,
              quantity: order.quantity * dataProduct.quantity,
              counter: 0,
              success: false,
              main_photo_link: photo ? photo.main_photo_link : null,
              name_of_product: photo ? photo.name_of_product : null
            };
          })
        );
      }  
      const product = productMap.get(offerId);
      if (product) {
        product.postingNumber = dataProduct.posting_number;
        product.quantity = dataProduct.quantity;
        product.date = `${dataProduct.shipment_date.slice(8, 10)}.${dataProduct.shipment_date.slice(5, 7)}.${dataProduct.shipment_date.slice(0, 4)}`;
        const photo = photoMap.get(offerId);
        product.photo = photo ? photo.main_photo_link : null;
  
        return {
          ...product,
          orders: combinedOrders
        };
      } else {
        console.error('Продукт не найден по указанному артикулу:', offerId);
      }
  
      return null;
    }).filter(p => p !== null); // Фильтруем пустые значения, чтобы только верные продукты были включены
  
    // Теперь каждый объект product содержит все свои orders внутри
    setProduct(updatedProductBarcodes); 
  }
  
  

  function generateOrderInfoYandex(res) {
    const productMap = new Map(allProducts.map(product => [product.article, product]));
    const photoMap = new Map(photoProducts.map(photo => [photo.article, photo])); 
    const productBarcode = res.items.map((item, i) => {
      const product = productMap.get(item.offerId);
      const photo = photoMap.get(item.offerId); 
      const filteredOrders = productsOrdersBarcode.filter(p => p.article === item.offerId); 
      const orders = filteredOrders.length ? 
        filteredOrders.flatMap(({ orders }) => orders.map(order => ({
          ...order,
          quantity: order.quantity * item.count,
          counter: 0,
          success: false,
          main_photo_link: photo ? photo.main_photo_link : null,
          name_of_product: photo ? photo.name_of_product : null }))
      ) : [];
          
      return {
        ...product,
        postingNumber: res.id,
        quantity: item.count,
        date: res.delivery.shipments[0].shipmentDate,
        warehouse: 'Яндекс', 
        photo: photo ? photo.main_photo_link : [],
        orders: orders
      };
    });
  
    setProduct(productBarcode);
  }
  
 
  function generateOrderInfoWB(dataProduct) {  
    const productsForOrders = productsOrdersBarcode.filter(product => product.article === dataProduct[0].article); 
    // Количество для умножения = dataProduct[0].quantity, если есть productsForOrders
    const multiplier = 1
  
    let orders;
    if (productsForOrders.length) {    
      orders = productsForOrders[0].orders.map(order => {
        const elem = photoProducts.find(item => item.article === order.article);
        return {
          ...order,
          quantity: order.quantity * multiplier,
          counter: 0,
          success: false,
          main_photo_link: elem?.main_photo_link || null,
          name_of_product: elem?.name_of_product || null
        };
      });
    } else { 
      orders = [];
    } 
  
    const productBarcode = allProducts.find(item => item.article === dataProduct[0].article);
    if (productBarcode) {
      productBarcode.postingNumber = dataProduct[0].id;
      productBarcode.quantity = multiplier;
      productBarcode.date = 'Не указан'; 
      productBarcode.photo = photoProducts.find(item => item.article === dataProduct[0].article)?.main_photo_link || null;
      productBarcode.orders = orders
      setProduct([productBarcode]);
    } else {
      console.error('Продукт не найден по артикулу:', dataProduct[0].article);
    }
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
                                        logs={logs}
                                        errorTable={errorTable}/>
                                        } /> 
        <Route path="/adding-products" element={ <AddingProducts products={productsWarehouse}/>} /> 
        <Route path="/print-barcode" element={ <PrintBarcode photoProducts={photoProducts} productsWarehouse={productsWarehouse}/>} /> 
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
