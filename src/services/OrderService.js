import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError} = useHttp();
<<<<<<< HEAD

   const headersDef = {  
        'Client-Id': '' ,
        'Api-Key': ''
     }

  


    const getAllOrders = async (formData, headersOzon = headersDef) => { 
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/unfulfilled/list`, 'POST', formData, headersOzon); 
        return res.result.postings.map(transformProduct)
    }

    const productBarcode = async (formData, headersOzon = headersDef) => { 
        const res = await request(`https://api-seller.ozon.ru/v2/posting/fbs/get-by-barcode`, 'POST', formData, headersOzon);
        console.log(res)
        res.result.products[0].shipment_date = res.result.shipment_date
        res.result.products[0].posting_number = res.result.posting_number
        return res.result.products
    }

    const productBarcodeYandex = async (barcode) => {  
       if(barcode.length <= 10){
        const res = await request(`http://10.0.0.4:3004/yandex-barcode/${barcode}`, 'GET', null); 
        return res.order
       }
    }
=======
 

    const getAllOrders = async (formData, headersOzon) => {
  
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/unfulfilled/list`, 'POST', formData, headersOzon);
            console.log(res)
        return res.result.postings.map(transformProduct)
    }

    const getAllProducts = async () => {
        const res = await request(`https://server-market-arsenal.vercel.app/products-for-orders`, 'GET');
     
        return res;
    }

    const getLabelOzon = async (url, method, body, headersOzon) => {
        const res = await request(url, method, body, headersOzon);
        return res
    }

 

    const getInfoProducts = async (article) => {

        const res = article.map(async (item) => {
           
          const res = await request(`https://server-market-arsenal.vercel.app/products-for-orders?article=${item.productArt}`, 'GET');
      
          res.postingNumber = item.postingNumber;
          res.date = item.date;
          res.price = item.productPrice
          res.warehouse = item.warehouse
          res.quantity = item.quantity
          return res;  
        })
        return res 
>>>>>>> 17484926198a6b3bed63c3d407cc01e9bb5ecbad

    const getWerehouse = async (formData, headersOzon = headersDef) => { 
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/get`, 'POST', formData, headersOzon);
        console.log(res)
      
        return res.result
    }

    const updateData = async (url,method, headersOzon, body) => {
        const res = await request(url, method,  body, headersOzon,);
    }

    const getBaskets = async (product = 'baskets') => {
        const res = await request(`http://localhost:3002/${product}`, 'GET');
        return res 
       
    }

    const transformBaskets = (baskets) => {
         
        return{
            art: baskets.articles,
            sku: baskets.sku_id
        } 
     } 
    
 
<<<<<<< HEAD

 

    const getInfoProducts = async () => {
          const res = await request(`http://10.0.0.4:3004/products-for-orders`, 'GET');
        return res 
    }

    const getPhotoProducts = async () => {
        const res = await request(`http://10.0.0.4:3004/allproducts`, 'GET');
      return res 
  }

    const updateData = async (url,method, body) => {
        const res = await request(url, method, body);
    }

 

    const transformBaskets = (baskets) => {
         
        return{
            art: baskets.articles,
            sku: baskets.sku_id
        } 
     } 
    
 
=======
>>>>>>> 17484926198a6b3bed63c3d407cc01e9bb5ecbad
    const transformProduct = (product) => {
        
        return{
            postingNumber: product.posting_number,
            date: product.shipment_date,
            productArt: product.products[0].offer_id,
            productName: product.products[0].name,
            productPrice: product.products[0].price,
            quantity: product.products[0].quantity,
            warehouse: product.delivery_method.warehouse
        
        } 
     }



<<<<<<< HEAD
    return {loading, error, clearError, getAllOrders, getInfoProducts, updateData, productBarcode, getPhotoProducts, getWerehouse, productBarcodeYandex}
=======
    return {loading, error, clearError, getAllOrders, getInfoProducts, getBaskets , getAllProducts, updateData, getLabelOzon}
>>>>>>> 17484926198a6b3bed63c3d407cc01e9bb5ecbad
}

export default useOrderService;