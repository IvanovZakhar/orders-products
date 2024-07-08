import { useEffect, useState } from 'react';
import useOrderService from '../../services/OrderService';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import './InfoTableOrders.scss'


const InfoTableOrders = ({ordersOzn, allOrdersYandex, logs, productsOrdersBarcode, allOrdersWB}) => { 
     

    const [ordersCMA, setOrdersCMA] = useState([])
    const [ordersArsenal, setOrdersArsenal] = useState([])
    const [ordersPargolovo, setOrdersPargolovo] = useState([]) 
    const [ordersCMAPacked, setOrdersCMAPacked] = useState([])
    const [ordersArsenalPacked, setOrdersArsenalPacked] = useState([])
    const [ordersPargolovoPacked, setOrdersPargolovoPacked] = useState([]) 
    const [ordersToday, setOrdersToday] = useState([]) 
    const [ordersCMATomorrow , setOrdersCMATomorrow ] = useState([])
    const [ordersArsenalTomorrow , setOrdersArsenalTomorrow ] = useState([])
    const [ordersPargolovoTomorrow , setOrdersPargolovoTomorrow ] = useState([]) 
    const [ordersCMATomorrowPacked , setOrdersCMATomorrowPacked ] = useState([])
    const [ordersArsenalTomorrowPacked , setOrdersArsenalTomorrowPacked ] = useState([])
    const [ordersPargolovoTomorrowPacked , setOrdersPargolovoTomorrowPacked ] = useState([]) 
    const [ordersTomorrow , setOrdersTomorrow ] = useState([]) 
    const [ordersLargeYandex, setOrdersLargeYandex] = useState([])
    const [ordersYandex, setOrdersYandex] = useState([])
    const [ordersLargeYandexPacked, setOrdersLargeYandexPacked] = useState([])
    const [ordersYandexPacked, setOrdersYandexPacked] = useState([])
    const [ordersLargeYandexTomorrow, setOrdersLargeYandexTomorrow] = useState([])
    const [ordersYandexTomorrow, setOrdersYandexTomorrow] = useState([]) 
    const [ordersLargeYandexTomorrowPacked, setOrdersLargeYandexTomorrowPacked] = useState([])
    const [ordersYandexTomorrowPacked, setOrdersYandexTomorrowPacked] = useState([])
    const [ordersNotPackedWb, setOrdersNotPackedWb] = useState([])
    const {getStickersWB} = useOrderService()

    useEffect(() => { 
  
        const packedOrdersOzn = ordersOzn.map(item =>{  
            const filtRes = logs.find(log => log.comment == item.posting_number) 
            
            if(filtRes){
              return{
                ...item, packed: true
              }
            }else{
              return item
            }
          }) 
          

        const dateToday = getCurrentDate()
        const dateTomorrow = getTomorrowDate()
        if(ordersOzn.length){
            const ordersToday = packedOrdersOzn.filter(order => order.shipment_date.slice(0, 10) == dateToday) 
            const ordersPargolovo = ordersToday.filter(order => order.warehouse.slice(0, 9).toLowerCase() == "парголово")
            const orders = ordersToday.filter(order => order.warehouse.slice(0, 9).toLowerCase() !== "парголово")
            const ordersCMA = orders.filter(order => order.company == "ЦМА")
            const ordersArsenal = orders.filter(order => order.company == "Арсенал")
            setOrdersCMA(ordersCMA)
            setOrdersArsenal(ordersArsenal)
            setOrdersPargolovo(ordersPargolovo)
            setOrdersToday(ordersToday)
            setOrdersCMAPacked(ordersCMA.filter(order => {
                const res = productsOrdersBarcode.filter(item => item.article == order.offer_id)
                if(res.length){
                    return order
                }
            }).filter(item => !item.packed))
            setOrdersArsenalPacked(ordersArsenal.filter(order => {
                const res = productsOrdersBarcode.filter(item => item.article == order.offer_id)
                if(res.length){
                    return order
                }
            }).filter(item => !item.packed))
            setOrdersPargolovoPacked(ordersPargolovo.filter(order => {
                const res = productsOrdersBarcode.filter(item => item.article == order.offer_id)
                if(res.length){
                    return order
                }
            }).filter(item => !item.packed))

            const ordersTomorrow = packedOrdersOzn.filter(order => order.shipment_date.slice(0, 10) == dateTomorrow) 
            const ordersPargolovoTomorrow  = ordersTomorrow.filter(order => order.warehouse.slice(0, 9).toLowerCase() == "парголово") 
            const ordersLarge  = ordersTomorrow.filter(order => order.warehouse.slice(0, 9).toLowerCase() !== "парголово")
            const ordersCMATomorrow  = ordersLarge.filter(order => order.company == "ЦМА")
            const ordersArsenalTomorrow  = ordersLarge.filter(order => order.company == "Арсенал")
            setOrdersCMATomorrow (ordersCMATomorrow )
            setOrdersArsenalTomorrow ( ordersArsenalTomorrow)
            setOrdersPargolovoTomorrow (ordersPargolovoTomorrow)
            setOrdersCMATomorrowPacked (ordersCMATomorrow.filter(order => {
                const res = productsOrdersBarcode.filter(item => item.article == order.offer_id)
                if(res.length){
                    return order
                }
            }).filter(item => !item.packed))
            setOrdersArsenalTomorrowPacked ( ordersArsenalTomorrow.filter(order => {
                const res = productsOrdersBarcode.filter(item => item.article == order.offer_id)
                if(res.length){
                    return order
                }
            }).filter(item => !item.packed))
            setOrdersPargolovoTomorrowPacked (ordersPargolovoTomorrow.filter(order => {
                const res = productsOrdersBarcode.filter(item => item.article == order.offer_id)
                if(res.length){
                    return order
                }
            }).filter(item => !item.packed))
            setOrdersTomorrow (ordersToday)
        }

        
      }, [ordersOzn, logs, productsOrdersBarcode, allOrdersWB])


      useEffect(() => {
        if(allOrdersWB){  
            const packedOrdersWB = allOrdersWB.filter(orderWb => { 
                const res = logs.filter(log => log.comment == orderWb.id)
                if(!res.length){ 
                    return true;
                } 
                return false;
            })  
            const orders = packedOrdersWB.map(order => order.id)
 
            
            // Разбиваем orders на части по 100 элементов
            const chunkSize = 100;
            const chunks = [];
            for(let i = 0; i < orders.length; i += chunkSize) {
                const chunkOrders = orders.slice(i, i + chunkSize);
                chunks.push(getStickersWB([], JSON.stringify({'orders': chunkOrders})));
            }
    
            // Ожидаем завершения всех асинхронных вызовов
            Promise.all(chunks)
                .then((values) => {
                    // Объединение результатов (пример для сценария, когда результат - массив)
                    const combinedResults = [].concat(...values); 
                    setOrdersNotPackedWb(combinedResults);
                })
                .catch((error) => {
                    console.error('Ошибка при обработке запросов:', error);
                });
        } 
    }, [allOrdersWB, logs]);
    
 

      useEffect(() => {

        const packedOrdersYandex = allOrdersYandex.map(item =>{  
            const filtRes = logs.find(log => log.comment == item.id) 
            
            if(filtRes){
                return{
                ...item, packed: true
                }
            }else{
                return item
            }
        })   

        console.log(packedOrdersYandex)

        function formatToDate(dateString) { 
            const dateParts = dateString.split('-');
            // Следим за порядком - [гггг, мм, дд]
            const year = dateParts[0];
            const month = dateParts[1];
            const day = dateParts[2];
          
            return `${day}-${month}-${year}`;
          }
           
          
        if(allOrdersYandex.length){
            // Устанавливаем упакованные товары
            const ordersToday = packedOrdersYandex.filter(order => { 
                if(order.status == "PROCESSING"){ 
                    const currentDate =  formatToDate (order.delivery.shipments[0].shipmentDate) 
                    const todayDate = getCurrentDate()
                    return currentDate == todayDate 
                } 
            }) 
             

           // Раскидываем нужные компании
            const ordersLarge = ordersToday.filter(orders => orders.company == 'КГТ')
            const ordersYandex = ordersToday.filter(orders => !orders.company )
            
            // Выдаем полный список товаров. Вытаскивая из каждого заказа содержимое
            const allOrdersLarge = ordersLarge.flatMap(order => {
               
                return order.items.map(item => {
                    return {
                        ...item,
                        packed: order.packed === true ? true : false
                    };
                });
            })
            const allOrdersYandex = ordersYandex.flatMap(order => {
               
                return order.items.map(item => {
                    return {
                        ...item,
                        packed: order.packed === true ? true : false
                    };
                });
            })
 
            setOrdersLargeYandex(allOrdersLarge) 
            setOrdersYandex(allOrdersYandex)
 


            setOrdersYandexPacked(allOrdersYandex.filter(item => !item.packed))
            setOrdersLargeYandexPacked(allOrdersLarge.filter(item => !item.packed))


            const ordersTomorrow  = packedOrdersYandex.filter(order => { 
                if(order.status == "PROCESSING"){ 
                    const currentDate =  formatToDate (order.delivery.shipments[0].shipmentDate) 
                    const tomorrowDate = getTomorrowDate()
                    return currentDate == tomorrowDate 
                }
            })
 
        
            const ordersLargeTomorrow = ordersTomorrow.filter(orders => orders.company == 'КГТ') 
            const ordersYandexTomorrow = ordersTomorrow.filter(order => order.company === undefined) 
            // Выдаем полный список товаров. Вытаскивая из каждого заказа содержимое
            const allOrdersLargeTomorrow = ordersLargeTomorrow.flatMap(order => {
               
                return order.items.map(item => {
                    return {
                        ...item,
                        packed: order.packed === true ? true : false
                    };
                });
            });        
            
            const allOrdersYandexTomorrow = ordersYandexTomorrow.flatMap(order => {
               
                return order.items.map(item => {
                    return {
                        ...item,
                        packed: order.packed === true ? true : false
                    };
                });
            })
           
            setOrdersYandexTomorrowPacked(allOrdersYandexTomorrow.filter(item => !item.packed))
            setOrdersLargeYandexTomorrowPacked(allOrdersLargeTomorrow.filter(item => !item.packed))
    
            setOrdersLargeYandexTomorrow(allOrdersLargeTomorrow) 
            setOrdersYandexTomorrow(allOrdersYandexTomorrow)


          
        }
        
      }, [allOrdersYandex, logs])
 

    function getCurrentDate() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0 в JavaScript
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
      
        return `${year}-${month}-${day}`;
      }

      const date = new Date();

      function getTomorrowDate() {
    
        let dayPlus = getDayPlus(getDayOfWeek(date))
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + dayPlus);
      
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const year = tomorrow.getFullYear();
      
        return `${year}-${month}-${day}`;
      }

      function getDayOfWeek(date, num) {
        const dayNames = [
          'Воскресенье',
          'Понедельник',
          'Вторник',
          'Среда',
          'Четверг',
          'Пятница',
          'Суббота'
        ]; 
        return dayNames[num ? num : date.getDay()];
      }

      function getDayPlus (getDayOfWeek) {
        switch(getDayOfWeek) {
            case 'Пятница':   
                return 3 
            case 'Суббота':  
                return 2 
            default:
             return 1
          }
      } 
      
    return(
        <div className="info-table-order">
            <ListGroup style={{position: 'absolute', left: '150px'}}>   
                    <ListGroup.Item  style={{padding: '0px'}}>              
                        <Badge style={{fontSize: '32px', display: 'flex', height: '55px',  color: 'black', padding: '13px 3px  0px 3px',}} bg="light">
                            
                            <span style={{padding: '0px', borderBottom: '1px solid black', display: 'flex', width: '330px', justifyContent: 'space-between',}}>
                                {`${getCurrentDate().slice(8,10)}.${getCurrentDate().slice(5,7)}.${getCurrentDate().slice(0,4)}`} 
                                <Clock/>
                            </span>
                        </Badge>
                     </ListGroup.Item>
         
                <ListGroup.Item>
                  
                    <h3>
                        ЦМА 
                        <div>   
                            <Badge style={{fontSize: '20px'}} bg="success">{`${ordersCMAPacked.length} / ${ordersCMA.length}`}</Badge> 
                          
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Арсенал 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="success">{`${ordersArsenalPacked.length} / ${ordersArsenal.length}`}</Badge> 
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Парголово 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="primary">{`${ordersPargolovoPacked.length} / ${ordersPargolovo.length}`}</Badge> 
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Яндекс 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="success">{`${ordersYandexPacked.length} / ${ordersYandex.length}`}</Badge>
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Яндекс КГТ 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="primary"> {`${ordersLargeYandexPacked.length} / ${ordersLargeYandex.length}`}</Badge>
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Wildberries 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="primary"> {`${ordersNotPackedWb.length} / -`}</Badge>
                        </div>
                    </h3>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup style={{marginLeft: '20px', position: 'absolute', right: '150px'}}>   
                <ListGroup.Item  style={{padding: '0px'}}>              
                    <Badge style={{fontSize: '32px', width: '330px',display: 'flex',justifyContent: 'space-between',borderBottom: '1px solid black', height: '55px',  color: 'black', padding: '13px 3px  0px 3px',}} bg="light">
                        
                
                        <span style={{padding: '0px',  display: 'flex',  justifyContent: 'space-between',}}>
                            {`${ getTomorrowDate().slice(8,10)}.${ getTomorrowDate().slice(5,7)}.${ getTomorrowDate().slice(0,4)}`}     
                        </span>
                    </Badge>
                </ListGroup.Item> 
            </ListGroup>

              <ListGroup style={{marginLeft: '20px', position: 'absolute', right: '150px'}}>   
                <ListGroup.Item  style={{padding: '0px'}}>              
                    <Badge style={{fontSize: '32px', width: '330px',display: 'flex',justifyContent: 'space-between',borderBottom: '1px solid black', height: '55px',  color: 'black', padding: '13px 3px  0px 3px',}} bg="light">
                        
                
                        <span style={{padding: '0px',  display: 'flex',  justifyContent: 'space-between',}}>
                            {`${ getTomorrowDate().slice(8,10)}.${ getTomorrowDate().slice(5,7)}.${ getTomorrowDate().slice(0,4)}`}     
                        </span>
                    </Badge>
                </ListGroup.Item>
                   
                <ListGroup.Item > 
                  
                    <h3>
                        ЦМА 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="success">{ `${ordersCMATomorrowPacked.length} / ${ordersCMATomorrow.length}`} </Badge>
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Арсенал 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="success">{ `${ordersArsenalTomorrowPacked.length} / ${ordersArsenalTomorrow .length}`}</Badge>
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Парголово 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="primary"> {`${ordersPargolovoTomorrowPacked.length} / ${ordersPargolovoTomorrow .length}`}</Badge>
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Яндекс
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="success">  {`${ordersYandexTomorrowPacked.length} / ${ordersYandexTomorrow.length}`}</Badge>
                        </div>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Яндекс КГТ 
                        <div> 
                            <Badge style={{fontSize: '20px'}} bg="primary"> {`${ordersLargeYandexTomorrowPacked.length} / ${ordersLargeYandexTomorrow.length}`}</Badge>
                        </div>
                    </h3>
                </ListGroup.Item>

            </ListGroup>
        </div>
 )
}

function Clock() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
  
    useEffect(() => {
      // Создаем интервал, который вызывает setTime каждую секунду
      const intervalId = setInterval(() => {
        setTime(new Date().toLocaleTimeString());
      }, 1000);
  
      // Этот возвращаемый callback очистит интервал, когда компонент будет размонтирован
      return () => clearInterval(intervalId);
    }, []); // Пустой массив зависимостей, чтобы настроить интервал только один раз при монтировании
  
    return <div>{time}</div>;
  }

export default InfoTableOrders;