import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError, setLoading} = useHttp();

    const _url = "https://f9fd09879062.vps.myjino.ru:49256"
   const headersDef = {  
        'Client-Id': '' ,
        'Api-Key': ''
     } 

     // Получение текущей даты и времени в Московском времени
const moscowTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' });
const currentDateTime = new Date(moscowTime);
const currentFormattedDate = currentDateTime.toISOString().slice(0, 19) + 'Z'; 

// Получение даты и времени через неделю от текущего времени в Московском времени
const nextWeekDateTime = new Date(currentDateTime);
nextWeekDateTime.setDate(nextWeekDateTime.getDate() + 10);
const nextWeekFormattedDate = nextWeekDateTime.toISOString().slice(0, 19) + 'Z'; 



     const formDataOZN = JSON.stringify({
        dir: 'ASC',
        filter: {
          cutoff_from: `${currentFormattedDate}`,
          cutoff_to: `${nextWeekFormattedDate}`,
          delivery_method_id: [],
          provider_id: [],
          status: 'awaiting_deliver',
          warehouse_id: [],
        },
        limit: 1000,
        offset: 0,
        with: {
          analytics_data: true,
          barcodes: true,
          financial_data: true,
          translit: true,
        }
    })
 

    const getAllOrders = async (formData, headersOzon = headersDef) => {  
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/unfulfilled/list`, 'POST', formData, headersOzon); 
        return res.result.postings.map(transformProduct)
    }

    const productBarcode = async (formData, headersOzon = headersDef) => { 
        console.log(formData)
        console.log(headersOzon)
        const res = await request(`https://api-seller.ozon.ru/v2/posting/fbs/get-by-barcode`, 'POST', formData, headersOzon);
        console.log(res)
        res.result.products[0].posting_number = res.result.posting_number
        res.result.products[0].shipment_date = res.result.shipment_date 
        res.result.products[0].status = res.result.status
        return res.result.products[0]
    }

    const productBarcodeYandex = async (barcode) => {   
       if(barcode.length <= 10){ 
        console.log('send')
        const res = await request(`${_url}/yandex-barcode/${barcode}`, 'GET', null);  
        console.log(res)
        return res.order
       }
    }

    const getStickersWB = async (apiKey, body) => {   
        console.log(body)
        const res = await request(`https://f9fd09879062.vps.myjino.ru:49256/wb-stickers`, 'POST', body); 
        return res.stickers
    }




    const getLabelOzon = async (url, method, body, headersOzon) => {
        const res = await request(url, method, body, headersOzon);
        return res
    }

 

    // const getInfoProducts = async (article) => {

    //     const res = article.map(async (item) => {
           
    //       const res = await request(`https://server-market-arsenal.vercel.app/products-for-orders?article=${item.productArt}`, 'GET');
      
    //       res.postingNumber = item.postingNumber;
    //       res.date = item.date;
    //       res.price = item.productPrice
    //       res.warehouse = item.warehouse
    //       res.quantity = item.quantity
    //       return res;  
    //     })
    // }

    const getInfoProducts = async () => {

        const res = await request(`${_url}/products-for-orders`, 'GET')
        return res
    }

    const getAllOrdersWarehouse = async () => { 
        const res = await request(`${_url}/all-orders-warehouse`, 
                                    'GET') 
        return res
    }

    const getWerehouse = async (formData, headersOzon = headersDef) => { 
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/get`, 'POST', formData, headersOzon);
  
        return res.result
    }

    const updateData = async (url,method, headersOzon, body) => {
        const res = await request(url, method,  body, headersOzon,);
    }

 
    const getAllOrdersOZN = async () => {  
        const res = await request(`${_url}/arsenal-orders`, 'GET' );  
        console.log(res)
        return res
    }



    const getPhotoProducts = async () => {
        const res = await request(`${_url}/allproducts`, 'GET');
      return res 
    }

    const getProductsForOrdersBarcode = async () => {
        const res = await request(`${_url}/products-for-orders-barcode`, 'GET');
    return res 
    }

   
  const getAllProductsWarehouse = async () => { 
    const res = await request( `${_url}/products-for-warehouse`, 'GET') 
    return res
}

    const transformBaskets = (baskets) => {
         
        return{
            art: baskets.articles,
            sku: baskets.sku_id
        } 
     } 
    

     const printBarcode = async (barcode, quantity) => {
        
        const res = await request(
                                    `http://localhost:3001/print?filename=${barcode}&copies=${quantity}`, 
                                    'GET' 
                                    )
      
        return res
    }
 
    const getAllOrdersWB = async (dateFrom, dateTo, apiKey) => { 
      
        const unixDateFrom = getNewDate(dateFrom)
        const unixDateTo = getNewDate(dateTo)
        const res = await request(`https://f9fd09879062.vps.myjino.ru:49256/wb-orders/${unixDateFrom}/${unixDateTo}`, 'GET', null );
     
        return res.orders
    }

    const getAllOrdersYandex = async (companyId) => {  
        const res = await request(`https://f9fd09879062.vps.myjino.ru:49256/yandex-orders`, 'GET'); 
        return res 
    }
    

    function getNewDate (date) {
        // Создаем объект Date из строки
        const dateObject = new Date(date);

        // Получаем Unix timestamp (количество миллисекунд с 1 января 1970 года)
        const unixTimestamp = dateObject.getTime();
        return  Math.floor(unixTimestamp / 1000);

}

    const transformProduct = (product) => {
        
        return{
            postingNumber: product.posting_number,
            date: product.shipment_date,
            productArt: product.products[0].offer_id,
            productName: product.products[0].name,
            productPrice: product.products[0].price,
            quantity: product.products[0].quantity,
            warehouse: product.delivery_method.warehouse,
            
        
        } 
     }

     const transformProductOzn = (product) => {
        
        return{
            posting_number: product.posting_number,
            shipment_date: product.shipment_date,
            offer_id: product.products[0].offer_id,
            name: product.products[0].name,
            price: product.products[0].price,
            quantity: product.products[0].quantity,
            warehouse: product.delivery_method.warehouse,
            barcode: product.barcodes.upper_barcode 
        
        } 
     }
    
     const updateProducts = async (data) => {
        const res = await request(
            `${_url}/update/products-for-warehouse/`, 
            'POST', 
            JSON.stringify(data) 
            )

        return res
    }

 

    const updateProductQuantity = async (data) => {
        const res = await request(
            `${_url}/update/products-for-warehouse/updateQuantity`, 
            'POST', 
            JSON.stringify(data) 
            )

        return res
    }

    const updateProductQuantityPlus = async (productsToUpdate) => {
        const res = await request(
            `${_url}/update/products-for-warehouse/updateQuantity-plus`, 
            'POST', 
            JSON.stringify({productsToUpdate}) 
            )

        return res
    }

    const updateWarehouseOrderStatus = async (data) => {
        const res = await request(
            `${_url}/updateOrderWarehouseStatus`, 
            'POST', 
            JSON.stringify(data) 
            )

        return res
    }

   
    const getAllLogs = async () => {
        
        const res = await request(`${_url}/logs/products-for-warehouse`, 
                                    'GET') 
        return res
    }
    
    const getAllProductsWB = async () => {
        
        const res = await request(
                                    `http://localhost:3000/products`, 
                                    'GET' 
                                    ) 
        return res
    }

    const getAllPostingCanceled = async () => {
        
        const res = await request(
                                    `${_url}/posting-canceled`, 
                                    'GET' 
                                    ) 
        return res
    }
 

    return {loading, 
            error, 
            clearError, 
            getAllOrders, 
            getInfoProducts, 
            updateData, 
            productBarcode, 
            getPhotoProducts, 
            getWerehouse, 
            productBarcodeYandex, 
            getAllProductsWarehouse,
            setLoading,
            loading,
            printBarcode, 
            updateProducts,
            getAllOrdersWarehouse,
            getProductsForOrdersBarcode,
            updateProductQuantity,
            updateProductQuantityPlus,
            updateWarehouseOrderStatus,
            getAllLogs,
            getAllProductsWB,
            getAllOrdersWB, 
            getAllOrdersYandex,
            getAllOrdersOZN,
            getAllPostingCanceled,
            getStickersWB  }

}

export default useOrderService