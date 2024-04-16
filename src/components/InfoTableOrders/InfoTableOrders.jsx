import { useEffect, useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import './InfoTableOrders.scss'


const InfoTableOrders = ({ordersOzn, allOrdersYandex}) => {
    const [ordersCMA, setOrdersCMA] = useState([])
    const [ordersArsenal, setOrdersArsenal] = useState([])
    const [ordersPargolovo, setOrdersPargolovo] = useState([]) 
    const [ordersToday, setOrdersToday] = useState([]) 
    const [ordersLargeYandex, setOrdersLargeYandex] = useState([])
    const [ordersYandex, setOrdersYandex] = useState([])
    const [ordersCMATomorrow , setOrdersCMATomorrow ] = useState([])
    const [ordersArsenalTomorrow , setOrdersArsenalTomorrow ] = useState([])
    const [ordersPargolovoTomorrow , setOrdersPargolovoTomorrow ] = useState([]) 
    const [ordersTomorrow , setOrdersTomorrow ] = useState([]) 
    const [ordersLargeYandexTomorrow, setOrdersLargeYandexTomorrow] = useState([])
    const [ordersYandexTomorrow, setOrdersYandexTomorrow] = useState([])

    useEffect(() => { 
        const dateToday = getCurrentDate()
        const dateTomorrow = getTomorrowDate()
        if(ordersOzn.length){
            const ordersToday = ordersOzn.filter(order => order.shipment_date.slice(0, 10) == dateToday) 
            const ordersPargolovo = ordersToday.filter(order => order.warehouse.slice(0, 9).toLowerCase() == "парголово")
            const orders = ordersToday.filter(order => order.warehouse.slice(0, 9).toLowerCase() !== "парголово")
            const ordersCMA = orders.filter(order => order.company == "ЦМА")
            const ordersArsenal = orders.filter(order => order.company == "Арсенал")
            setOrdersCMA(ordersCMA)
            setOrdersArsenal(ordersArsenal)
            setOrdersPargolovo(ordersPargolovo)
            setOrdersToday(ordersToday)

            const ordersTomorrow = ordersOzn.filter(order => order.shipment_date.slice(0, 10) == dateTomorrow) 
            const ordersPargolovoTomorrow  = ordersTomorrow.filter(order => order.warehouse.slice(0, 9).toLowerCase() == "парголово")
            const ordersLarge  = ordersTomorrow.filter(order => order.warehouse.slice(0, 9).toLowerCase() !== "парголово")
            const ordersCMATomorrow  = ordersLarge.filter(order => order.company == "ЦМА")
            const ordersArsenalTomorrow  = ordersLarge.filter(order => order.company == "Арсенал")
            setOrdersCMATomorrow (ordersCMATomorrow )
            setOrdersArsenalTomorrow ( ordersArsenalTomorrow)
            setOrdersPargolovoTomorrow (ordersPargolovoTomorrow)
            setOrdersTomorrow (ordersToday)
        }

        
      }, [ordersOzn])

      useEffect(() => {
        function formatToDate(dateString) {
            const dateParts = dateString.split('-');
            // Следим за порядком - [гггг, мм, дд]
            const year = dateParts[0];
            const month = dateParts[1];
            const day = dateParts[2];
          
            return `${day}-${month}-${year}`;
          }
           
          
        if(allOrdersYandex.length){
            
            const ordersToday = allOrdersYandex.filter(order => { 
                const currentDate =  formatToDate (order.delivery.shipments[0].shipmentDate) 
                const todayDate = getCurrentDate()
                return currentDate == todayDate && order.status == "PROCESSING" 
            })
           
            const ordersLarge = ordersToday.filter(orders => orders.company == 'КГТ')
            const ordersYandex = ordersToday.filter(orders => !orders.company )
            const uniqueOrdersYandex = ordersYandex.filter(yandexOrder => 
                !ordersLarge.some(largeOrder => largeOrder.id === yandexOrder.id)
              );
            setOrdersLargeYandex(ordersLarge) 
            setOrdersYandex(uniqueOrdersYandex )
            
            const ordersTomorrow  = allOrdersYandex.filter(order => { 
                const currentDate =  formatToDate (order.delivery.shipments[0].shipmentDate) 
                const tomorrowDate = getTomorrowDate()
                return currentDate == tomorrowDate && order.status == "PROCESSING" 
            })
        
            const ordersLargeTomorrow = ordersTomorrow.filter(orders => orders.company == 'КГТ')
            const ordersYandexTomorrow = ordersTomorrow.filter(order => order.company === undefined); 
            const uniqueOrdersTomorrow = ordersYandexTomorrow.filter(yandexOrder => 
                !ordersLargeTomorrow.some(largeOrder => largeOrder.id === yandexOrder.id)
              );
            setOrdersLargeYandexTomorrow(ordersLargeTomorrow) 
            setOrdersYandexTomorrow(uniqueOrdersTomorrow)
        }
        
      }, [allOrdersYandex])

    function getCurrentDate() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0 в JavaScript
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
      
        return `${year}-${month}-${day}`;
      }
      
      function getTomorrowDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
      
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const year = tomorrow.getFullYear();
      
        return `${year}-${month}-${day}`;
      }

      
    return(
        <div className="info-table-order">
            <ListGroup>   
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
                        ЦМА <Badge style={{fontSize: '24px'}} bg="success">{ordersCMA.length}</Badge>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Арсенал <Badge style={{fontSize: '24px'}} bg="success">{ordersArsenal.length}</Badge>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Парголово <Badge style={{fontSize: '24px'}} bg="primary">{ordersPargolovo.length}</Badge>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Яндекс <Badge style={{fontSize: '24px'}} bg="success">{ordersYandex.length}</Badge>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Яндекс КГТ <Badge style={{fontSize: '24px'}} bg="primary">{ordersLargeYandex.length}</Badge>
                    </h3>
                </ListGroup.Item>

            </ListGroup>
            <ListGroup style={{marginLeft: '20px'}}>   
                    <ListGroup.Item  style={{padding: '0px'}}>              
                        <Badge style={{fontSize: '32px', width: '330px',display: 'flex',justifyContent: 'space-between',borderBottom: '1px solid black', height: '55px',  color: 'black', padding: '13px 3px  0px 3px',}} bg="light">
                            
                            <span style={{padding: '0px',  display: 'flex',   }}>
                                {`Завтра`}   
                            </span>
                            <span style={{padding: '0px',  display: 'flex',  justifyContent: 'space-between',}}>
                            {`${ getTomorrowDate().slice(8,10)}.${ getTomorrowDate().slice(5,7)}.${ getTomorrowDate().slice(0,4)}`}    

                           
                            </span>
                        </Badge>
                     </ListGroup.Item>
                   
                <ListGroup.Item>
                  
                    <h3>
                        ЦМА <Badge style={{fontSize: '24px'}} bg="success">{ordersCMATomorrow .length}</Badge>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Арсенал <Badge style={{fontSize: '24px'}} bg="success">{ordersArsenalTomorrow .length}</Badge>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Парголово <Badge style={{fontSize: '24px'}} bg="primary">{ordersPargolovoTomorrow .length}</Badge>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Яндекс <Badge style={{fontSize: '24px'}} bg="success">{ordersYandexTomorrow.length}</Badge>
                    </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h3>
                        Яндекс КГТ <Badge style={{fontSize: '24px'}} bg="primary">{ordersLargeYandexTomorrow.length}</Badge>
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