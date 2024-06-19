 
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
  const [CanceledProduct, setCanceledProduct] = useState(null)
  const {getInfoProducts, 
        getBaskets, 
        getAllProducts, 
        getBasketsProduct, 
        productBarcode, 
        getPhotoProducts, 
        getWerehouse, 
        setLoading,
        loading, 
        error , 
        productBarcodeYandex, 
        getAllProductsWarehouse,
        getProductsForOrdersBarcode,
        getAllOrders,
        getAllLogs,
        getAllOrdersWB,
        getAllOrdersOZN,
        getAllOrdersYandex, 
        clearError,
        getAllPostingCanceled 
      } = useOrderService();
  const [allProducts, setAllProducts] = useState([])
  const [photoProducts, setPhotoProducts] = useState([])
  const [productsWarehouse, setProductsWarehouse] = useState([])
  const [productsOrdersBarcode, setProductsOrdersBarcode] = useState([])
  const [allOrdersYandex, setAllOrdersYandex] = useState([])
  const [ordersOzn, setOrdersOzn] = useState([]) 
  const [postingCanceled, setPostingCanceled] = useState([]) 


    // Устанавливаем продукты для нарядов с базы
useEffect(() => {
    
    getInfoProducts().then(setAllProducts) 
    getPhotoProducts().then(setPhotoProducts) 
    getProductsForOrdersBarcode().then(setProductsOrdersBarcode)
    getAllLogs().then(setLogs) 
    // Получаем текущую дату
    const currentDate = new Date();

    // Дата неделю назад
    const weekAgo = new Date();
    weekAgo.setDate(currentDate.getDate() - 7);

    // Дата неделю вперед
    const weekLater = new Date();
    weekLater.setDate(currentDate.getDate() + 2);
    

    getAllOrdersWB(weekAgo.toISOString().split('T')[0], weekLater.toISOString().split('T')[0], JSON.parse(localStorage.apiData)[2].apiKey).then(setAllOrdersWB)
  }, [])
  

  useEffect(() => {
    getAllProductsWarehouse().then(setProductsWarehouse)
    getAllOrdersYandex(49023774).then(allOrders => { 
          setAllOrdersYandex([...allOrders   ])
      
    })

 

  getAllOrdersOZN().then(setOrdersOzn)
  getAllPostingCanceled().then(setPostingCanceled)
}, [])  
 
 
 

 console.log(allOrdersWB)
 


  
  useEffect(() => {
    onLoadingProducts();
  }, [localStorage.data]);
 
 
  const onLoadingProducts = (data = localStorage.data) => {
 
   };
  
const onLoadingProduct = (barcode) => {   
  if(barcode.slice(0, 3) !== 'OZN' && barcode.slice(0,3) !== 'ЩЯТ' && barcode !== '1110011' ){ 
      const resYandex = allOrdersYandex.filter(item => item.id == barcode) 
      const resOzn = ordersOzn.filter(item => item.barcode == barcode)
      const resWB = allOrdersWB.filter(orderWB => orderWB.id === +barcode.slice(2))    


      if(resYandex.length){ 
          setErrorTable(null)
          generateOrderInfoYandex (resYandex[0])
          setCompany('Яндекс')
          setWarehouse('Яндекс')
      }else if(resWB.length){  
          setErrorTable(null) 
          console.log(resWB)
          generateOrderInfoWB(resWB)
          setCompany('WB') 
          setWarehouse('Уткина заводь')
      }else if (resOzn.length){
        console.log(resOzn)
        setErrorTable(null)
        generateOrderInfo(resOzn)
        setCompany(resOzn[0].company) 
        setWarehouse(resOzn[0].warehouse)
      }else{ 
        setLoading(true) 
        searchCanceledOrders(barcode) 
      }
    
  }
}

function searchCanceledOrders (barcode) {
  const formData = { 
    "barcode": `${barcode}`
  }
   
  JSON.parse(localStorage.apiData).forEach((data, i) => {
    const headersDef = {  
      'Client-Id': `${data.clientId}` ,
        'Api-Key': `${data.apiKey}`
      }
    if(i < 2){ 
    productBarcode(JSON.stringify(formData), headersDef)
    .then(res => {
      setErrorTable(null)
      setLoading(false) 
        if(res.status == 'cancelled'){ 
          setErrorTable('Товар отменен') 
        }else{ 
          generateOrderInfo([res]) 
          setCompany(data.name)
        }
    
     }).catch(er => {
      setErrorTable('Штрихкод не найден')
    })


    }})
}





 
  function generateOrderInfo(dataProductList) { 
    const productMap = new Map(allProducts.map(product => [product.article, product]));
    const photoMap = new Map(photoProducts.map(photo => [photo.article, photo])); 
    const updatedProductBarcodes = dataProductList.map(dataProduct => {
      const offerId = dataProduct.offer_id || dataProduct.offerId;
      const productsForOrders = productsOrdersBarcode.filter(p => p.article === offerId);
     
          const updatedProductsForOrders = productsForOrders.map(productOrder => {
              const newOrders = productOrder.orders.map(orderObject => {
                
                  if(orderObject.article.slice(0,2) == "AR"){
                    console.log(orderObject.article.slice(0,8))
                    // Перебираем orders, фильтруем те, которые есть в productsWarehouse
                    const updatedOrders = productsWarehouse.filter(orderWarehouse => orderWarehouse.article.slice(0,8) == orderObject.article.slice(0,8))
                    
                    // Возвращаем новый объект заказа с обновленным массивом orders
                    return {
                      ...orderObject,
                      quantityWarehouse: updatedOrders[0].quantity
                    }
                  }else{
                    const updatedOrders = productsWarehouse.filter(orderWarehouse => orderWarehouse.article == orderObject.article)
                    
                    // Возвращаем новый объект заказа с обновленным массивом orders
                    return {
                      ...orderObject,
                      quantityWarehouse: updatedOrders[0].quantity
                    }
                  }
                  
                });

          return{
            ...productOrder,
            orders: newOrders
          }
      })
   
      
      let combinedOrders = [];
      if (updatedProductsForOrders.length) {
        combinedOrders = updatedProductsForOrders.flatMap(productForOrders =>
          productForOrders.orders.map(order => {
            const photo = photoMap.get(order.article);
            return {
              ...order,
              quantity: order.quantity * dataProduct.quantity,
              counter: 0,
              success: false,
              main_photo_link: photo ? photo.main_photo_link : null,
              name_of_product: photo ? photo.name_of_product : null, 
              warehouse: dataProduct.warehouse
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
      
  
      const updatedProductsForOrders = filteredOrders.map(productOrder => {
        const newOrders = productOrder.orders.map(orderObject => {
          console.log(orderObject.article.slice(0,8))
            if(orderObject.article.slice(0,2) == "AR"){
             
              // Перебираем orders, фильтруем те, которые есть в productsWarehouse
              const updatedOrders = productsWarehouse.filter(orderWarehouse => orderWarehouse.article.slice(0,8) == orderObject.article.slice(0,8))
              console.log(updatedOrders)
              // Возвращаем новый объект заказа с обновленным массивом orders
              return {
                ...orderObject,
                quantityWarehouse: updatedOrders[0].quantity
              }
            }else{
              const updatedOrders = productsWarehouse.filter(orderWarehouse => orderWarehouse.article == orderObject.article)
              
              // Возвращаем новый объект заказа с обновленным массивом orders
              return {
                ...orderObject,
                quantityWarehouse: updatedOrders[0].quantity
              }
            }
            
          });

    return{
      ...productOrder,
      orders: newOrders
    }
})

 
      const orders = updatedProductsForOrders.length ? 
      updatedProductsForOrders.flatMap(({ orders }) => orders.map(order => ({
          ...order,
          quantity: order.quantity * item.count,
          counter: 0,
          success: false,
          main_photo_link: photo ? photo.main_photo_link : null,
          name_of_product: photo ? photo.name_of_product : null  }))
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
    const updatedProductsForOrders = productsForOrders.map(productOrder => {
      const newOrders = productOrder.orders.map(orderObject => {
        
          if(orderObject.article.slice(0,2) == "AR"){
            console.log(orderObject.article.slice(0,8))
            // Перебираем orders, фильтруем те, которые есть в productsWarehouse
            const updatedOrders = productsWarehouse.filter(orderWarehouse => orderWarehouse.article.slice(0,8) == orderObject.article.slice(0,8))
            
            // Возвращаем новый объект заказа с обновленным массивом orders
            return {
              ...orderObject,
              quantityWarehouse: updatedOrders[0].quantity
            }
          }else{
            const updatedOrders = productsWarehouse.filter(orderWarehouse => orderWarehouse.article == orderObject.article)
            
            // Возвращаем новый объект заказа с обновленным массивом orders
            return {
              ...orderObject,
              quantityWarehouse: updatedOrders[0].quantity
            }
          }
          
        });

  return{
    ...productOrder,
    orders: newOrders
  }
})
  
    let orders;
    if (updatedProductsForOrders.length) {    
      orders = updatedProductsForOrders[0].orders.map(order => {
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
                                         errorTable={errorTable}
                                         setLoading={setLoading} 
                                         ordersOzn={ordersOzn}
                                         allOrdersYandex={allOrdersYandex}
                                         productsOrdersBarcode={productsOrdersBarcode} 
                                         allOrdersWB={allOrdersWB}
                                        />
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
