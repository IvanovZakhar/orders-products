import {useHttp} from '../hooks/http.hook';

const useOrderService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _url = "https://f9fd09879062.vps.myjino.ru:49256"
   const headersDef = {  
        'Client-Id': '' ,
        'Api-Key': ''
     }
     console.log(_url)
  


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
        const res = await request(`${_url}/yandex-barcode/${barcode}`, 'GET', null); 
        return res.order
       }
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

    const getWerehouse = async (formData, headersOzon = headersDef) => { 
        const res = await request(`https://api-seller.ozon.ru/v3/posting/fbs/get`, 'POST', formData, headersOzon);
        console.log(res)
      
        return res.result
    }

    const updateData = async (url,method, headersOzon, body) => {
        const res = await request(url, method,  body, headersOzon,);
    }

 




    const getPhotoProducts = async () => {
        const res = await request(`${_url}/allproducts`, 'GET');
      return res 
  }

   

 

    const transformBaskets = (baskets) => {
         
        return{
            art: baskets.articles,
            sku: baskets.sku_id
        } 
     } 
    
 

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


    return {loading, error, clearError, getAllOrders, getInfoProducts, updateData, productBarcode, getPhotoProducts, getWerehouse, productBarcodeYandex}

}

export default useOrderService