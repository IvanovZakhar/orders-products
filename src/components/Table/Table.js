import NavLink from '../NavLink/Nav-link'; 
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import onScan from 'onscan.js' 
import Card from 'react-bootstrap/Card';
import './Table.scss' 
import useOrderService from '../../services/OrderService';
import ModalSend from '../modal/modal-send';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import ModalStatus from '../modal/modal-status'; 
import { useBarcode } from 'next-barcode';
 

function Table({props, date, setDate, onLoadingProduct, loading, error, setCompany, company, warehouse, logs}) {
    const [barcode, setBarcode] = useState('');
    const [onScanInitialized, setOnScanInitialized] = useState(false) 
    const [addedOrdersBarcode, setAddedOrdersBarcode] = useState([]) 
    const [dataOrders,  setDataOrders] = useState([])
    const {updateProductQuantity} = useOrderService()
    // const [conditionOrders, serConditionOrders] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [numberPosting, setNumberPosting] = useState('')
    const [newOrders,  setNewDataOrders] = useState([])
    const [status, setStatus] = useState('')
    const [modalStatusOpen, setStatusModalOpen] = useState(false);
    console.log(props)
    useEffect(() => {  
        const handleScan = (e) => {
            const scanCode = e.detail.scanCode; 
            console.log(scanCode)
            if(scanCode === 'orders111'){
                window.location.href = `/table` 
              }else if(scanCode === 'ref111'){
                  window.location.href = `/adding-products`
              }else if(scanCode === 'listorder111'){
                  window.location.href = `/update-status-warehouse`
              }else if(scanCode === 'print111' ){
                window.location.href = '/print-barcode'
              }else if(scanCode === 'swipebot111'){
                console.log('swipe')
                window.scrollTo({ top: window.scrollY + 1970, behavior: 'smooth' });

              }else if(scanCode === 'swipetop111'){
                console.log('swipe')
                window.scrollTo({ top: window.scrollY - 1970, behavior: 'smooth' });


              }
          };

        document.addEventListener('scan', handleScan);

        // Очистка обработчика событий при размонтировании компонента
        return () => {
        document.removeEventListener('scan', handleScan);
        };
    }, []); 

    useEffect(()=> {
        if(props[0]){
            setNumberPosting(props[0].postingNumber) 
        }
    }, [props])


    useEffect(()=>{ 
        console.log(props)
        if(props.length && props[0].orders.length){
            const allOrders = props.flatMap(prop => prop.orders);

            setDataOrders(allOrders)
        }else{
            setDataOrders([])
        }
    }, [props])
           
            
    useEffect(() => { 

        const handleScan = (e) => {
            const scanCode = e.detail.scanCode;
            setBarcode(scanCode); 
            if (scanCode === 'SEND111') { 
              updateProductQuantity({ comment: `${numberPosting}`, productsToUpdate: newOrders })
                .then((res) => { 
                setModalOpen(false);
                setStatusModalOpen(true)
                setStatus('Успешно!')
               // Задержка перед перезагрузкой страницы
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
              }).catch(er => {
                setModalOpen(false)
                setStatusModalOpen(true)
                setStatus('Ошибка!')
                // Задержка перед перезагрузкой страницы
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
              })
            } 
          
            setDataOrders((prevOrders) => {
              const updatedOrders = prevOrders.map((order) => {
                if (order.barcode === scanCode) {
                  if (order.counter !== order.quantity) {
                    return {
                      ...order,
                      counter: order.counter + 1,
                    };
                  } else{
                    return{
                        ...order,
                        success: true
                    }

                  }
                }
                return order;
              });
              return updatedOrders;
            } );
          };

        document.addEventListener('scan', handleScan);

        // Очистка обработчика событий при размонтировании компонента
        return () => {
        document.removeEventListener('scan', handleScan);
        };
    }, [newOrders]); 
        console.log(newOrders)
 
 
    useEffect(() => {
        console.log(dataOrders)
        const updateData = dataOrders.map(order => {
            if(order.quantity === order.counter){
                return{
                    ...order,
                    success: true
                }
            }
            return order
        })
        setNewDataOrders(updateData)
    }, [dataOrders])
      console.log(dataOrders)
        

    useEffect(() => {
        if (!onScanInitialized) {
        onScan.attachTo(document);
        setOnScanInitialized(true);
        }
       
    }, []);

    useEffect(() => {
            if(barcode){
                onLoadingProduct(barcode);
            }
    }, [barcode]);

    useEffect(() => {
        // Проверяем, все ли элементы в массиве имеют success: true
        const allSuccess = newOrders.length ? newOrders.every((order) => order.success === true) : false
       
        if (allSuccess) {
        // Выполняем нужное действие, так как все элементы имеют success: true 
        setModalOpen(true)
        }
    }, [newOrders]) 
    const Barcode = ({barcodeOrders}) => {
        const options = {
            value: `${barcodeOrders}`,
            options: {
              background: '#ffffff',
              height: '100',
              width: '4', 
              display: 'flex',
              justifyContent: 'center'
            }
          };
        const { inputRef } = useBarcode(options);
      
        return <svg className='barcode' ref={inputRef} style={  {
            display: 'block',
            margin: '0 auto',
            textAlign: 'center', 
          }}/>;
      };

      
    const elem = props ? ( ) => {
         
        return props.map((prop) => {
            console.log(props)
            const {Column14, Column15, Column16, 
                Column17, Column18, Column19, Column20, Column22, 
                Column23, Column24, Column25, Station, article, 
                date, eyelet, height, loops, name, number_of_roll, postingNumber,
               price, roll, screws, weight, width, Column21, quantity, photo} = prop; 
           const packed = logs.length ? logs.find(log => log.comment == postingNumber) : null   
           return (
               <div className='main-table'>
                     
                   <table className='order'>   
                       <thead>
               
                       <tr className='main__head'>
                       <tr className='name_head'>
                           <th className='name'><h2>{company}</h2></th>
                       </tr> 
                           <tr  className='about-head'>
                               <th>Дата отгрузки</th>
                               <th className='about-head__time'>{date}</th>
                           </tr>
                           <tr className='about-head'>
                               <th>Время отгрузки</th>
                               <th className='about-head__time'> 13:00</th>
                           </tr>
                       </tr>
               
                           <tr className='data-order'>
                               <tr>
                                   <th>Артикул</th>
                                   <th className='data'>{article}</th>
                       
                               </tr>
                               <tr>
                                   <th>НОМЕР ОТПРАВЛЕНИЯ</th>
                                   <th className='data'>{postingNumber}</th>
                               </tr>
                           </tr>
                       </thead>
               
                       <tbody>
                           <tr className='head-body'>
                               <tr className='order-name'>
                                   <th><h1>{name}<span>x{quantity}</span></h1></th>
                                   {/* <th></th> */}
                               </tr>
       
                               
    
                           </tr>
               
                       <tr className='about-product'>
                           <tr className='params'>
                               <tr>
                                   <th><h3>Параметры</h3></th> 
                               </tr>
                               <tr>
                                   <th>Высота</th><th>{width}</th>
                               </tr>
                               <tr>
                                   <th>Ширина</th><th>{height}</th>
                               </tr>
                               <tr>
                                   <th>Вес</th><th>{weight}</th>
                               </tr>
                               <tr>
                                   <th>Габариты</th><th>{Column21}</th>
                               </tr>
                               <tr>
                                   <th>Цвет</th><th>{Column22}</th>
                               </tr>
                           </tr>
                           <tr className='complete'>
                           
                               <tr><th><h3>Комплектация</h3></th> </tr>
                               <tr>
                                   <th>Винты</th><th>{screws}</th>
                               </tr>
                               <tr>
                                   <th>Петли</th><th>{loops}</th>
                               </tr>
                               <tr>
                                   <th>Резьб. Вставки</th><th>-</th>
                               </tr>
                               <tr>
                                   <th>Ролики</th><th>{number_of_roll}</th>
                               </tr>
                           </tr>
                       </tr>
           
                       <div> 
                           {/* <tr className='compl'> 
                               <tr className='compl-name'><th><h3>Комплектация заказа</h3></th> </tr>
                               
                               <GetCompl quantity={quantity} article={article}/>
                           </tr> */}
       
                           <tr className='note'>
                               
                               <tr><th><h3>Примечание</h3></th> </tr>
                               <tr>
                                   <th>{roll}</th> 
                               </tr>
                               <tr>
                                   <th>{Column14}</th> 
                               </tr>
                               <tr>
                                   <th>{Column15}</th>
                               </tr>
                               <tr>
                                   <th>{Column16}</th>
                               </tr>
                               <tr>
                                   <th>{Column17}</th>
                               </tr>
                               <tr>
                                   <th>{Column18}</th>
                               </tr>
                               <tr>
                                   <th>{Column19}</th>
                               </tr>
                               <tr>
                                   <th>{Column20}</th>
                               </tr>
                               <tr>
                                   <th>-</th>
                               </tr>
                           </tr>
                   
                       </div>
                       </tbody>
                   </table>
                  <div className='card-item'> 
                     
                       <Container > 
                           {prop.orders.length ? <h2 style={{color: 'grey'}}>Отсканируйте штрихкоды:</h2> : null}
                           <Row>
                               {packed ? <h2 style={{color: 'green'}}>Упакован!</h2> : newOrders.map(item => {  
                                   return( 
                                       <Col>
                                           <Card style={{ width: '18rem'  }}>
                                               <Card.Img variant="top" style={{width: '150px', height: '150px', margin: '0 auto'}} src={item.main_photo_link} />
                                               <Card.Body>
                                                   <Card.Title style={{fontWeight: 'bold'}}>{item.article}</Card.Title>
                                                   <Card.Text style={{lineHeight: '18px'}}>
                                                       {item.name_of_product}
                                                   </Card.Text>
                                               </Card.Body>
                                               <Col style={{display: 'flex', justifyContent: 'center'}}>
                                                   <Badge bg={`${item.success ? "success":"secondary"}`} style={{fontSize: '25px'}}>{item.counter} / {item.quantity}</Badge>
                                               
                                               
                                               </Col>
                                           </Card>
                                       </Col>
                                           )
                                   
                               })}
                           </Row>
                      </Container>
                      <h6>Цвет: {Column22}</h6>    
                       <img className='photo-order' src={photo}/>
    
                          
                  </div>
               </div>
            
           )
        })
    }: null;

 
     const Order = elem ? elem() : <h4>Введите штрихкод</h4> 
    return (
        <>  
            <h5 onClick={() => {setBarcode('400175596448000')}}>{company}</h5>
            <tr className='warehouse'>
                <th className='name-warehouse'><h6>СКЛАД:</h6></th>
                <th className='address'><h6>{`${warehouse.slice(0, 8)}`}</h6></th>
            </tr>
            <tr className='warehouse'>
                <th className='name-warehouse'><h6>КОЛ-ВО:</h6></th>
                <th className='address'><h6>{`${props.length}`}</h6></th>
            </tr> 
            <NavLink date={date} setDate={setDate}  />
            {  loading ? <GetSpinner/> : Order}  
        
            <ModalSend modalOpen={modalOpen}  setModalOpen={setModalOpen}/>
            <ModalStatus modalStatusOpen={modalStatusOpen} setStatusModalOpen={setStatusModalOpen} status={status}/>
        </>
)}
    
export default Table;

 

function GetCompl({quantity, article}) {
    const divs = Array.from({ length: quantity }, (_, i) => (
        <tr key={i}>
            <th>{article}</th> 
            <th>1 шт.</th>
        </tr>
    ));
    
    return  divs;
    }

function GetSpinner(){
    return(
        <div className='spinner'>
            <Spinner animation="border" /> 
        </div>
    )
}

 

   