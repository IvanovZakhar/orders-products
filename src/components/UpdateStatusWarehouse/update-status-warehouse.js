import { useEffect, useState } from "react"
import useOrderService from "../../services/OrderService"
import onScan from 'onscan.js' 
import Table from 'react-bootstrap/Table'; 
import { useBarcode } from 'next-barcode';
import Badge from 'react-bootstrap/Badge';
import ModalSendUpdateStatus from "../modal/modal-update-status";
import ModalStatus from "../modal/modal-status";
import ModalMasters from "../modal/modal-masters";

const UpdateStatusWarehouse = ({photoProducts}) => {
    const {getAllOrdersWarehouse, updateWarehouseOrderStatus} = useOrderService()
    const [orders, setOrders] = useState(false)
    const [order, setOrder] = useState(false)
    const [onScanInitialized, setOnScanInitialized] = useState(false) 
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState('')
    const [modalStatusOpen, setStatusModalOpen] = useState(false);
    const [photos, setPhotos] = useState([])
    const [modalOpenMasters, setModalOpenMasters] = useState(false)
    console.log(photoProducts)
    // Маршрут между страницами по barcode
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
              }
          };

        document.addEventListener('scan', handleScan);

        // Очистка обработчика событий при размонтировании компонента
        return () => {
        document.removeEventListener('scan', handleScan);
        };
    }, []); 

    useEffect(() => {
        getAllOrdersWarehouse().then(setOrders)
    }, [])

    useEffect(() => {
        setPhotos(photoProducts)
        const elem = photoProducts.filter(item => item.article === 'AR15С101955-06')
        console.log(elem)
    }, [photoProducts])

    useEffect(() => {
        const handleScan = (e) => {
          console.log(e.detail.scanCode);
          const scanCode = e.detail.scanCode;
            
            
           if(scanCode === 'modal111'){
                setModalOpen(true)
           }else if(scanCode === 'prod111') {
                setOrder(prevOrder => {
                    const res = {...prevOrder, status: 'Изготовление'}  
                        setModalOpen(false)
                       setModalOpenMasters(true) 
                    return res})
           }else if(scanCode === 'pain111') {
                setOrder(prevOrder => {
                    const res = {...prevOrder, status: 'Покраска'}
                    setModalOpen(false)
                    setModalOpenMasters(true) 
                    return res   })
           }else if(scanCode === 'pack111') {
                setOrder(prevOrder => {
                    const res = {...prevOrder, status: 'Упакован'}
                    setModalOpen(false)
                    setModalOpenMasters(true) 
                    return res})
           }else{
            const res = orders.filter(item => item.barcodeOrders === scanCode) 
            if(res.length) {
                setPhotos(prevPhotos => {
                    setOrder({
                        ...res[0],
                        products: res[0].products.map(product => {
                            console.log(prevPhotos)
                            const photo = prevPhotos.filter(photo => photo.article === product.article) 
                            return{
                                ...product,
                                main_photo_link: photo[0].main_photo_link
                            }
                        })
                    }) 
                    return prevPhotos
                })
            }

            if(scanCode === 'dima111'){
                setOrder(prevOrder => {
                    const res = {...prevOrder, master: 'Манин'}
                    
                    updateWarehouseOrderStatus(res)
                        .then(res => {
                            setModalOpenMasters(false) 
                            setStatus('Успешно!')
                            setStatusModalOpen(true)
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        }).catch(er => {
                            setStatus('Ошибка')
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        })
                    return res})
            }else if(scanCode === 'karlen111'){
                setOrder(prevOrder => {
                    const res = {...prevOrder, master: 'Бегян'}
                    updateWarehouseOrderStatus(res)
                    .then(res => {
                        setModalOpenMasters(false) 
                        setStatus('Успешно!')
                        setStatusModalOpen(true)
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    }).catch(er => {
                        setStatus('Ошибка')
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    })
                    return res})
            }
           }
        };
    
        document.addEventListener('scan', handleScan);
    
        // Очистка обработчика событий при размонтировании компонента
        return () => {
          document.removeEventListener('scan', handleScan);
        };
      }, [orders]);
 
      useEffect(() => {
        if (!onScanInitialized) {
        onScan.attachTo(document);
        setOnScanInitialized(true);
        }
       
    }, []);
    
    const Barcode = ({barcodeOrders}) => {
        const options = {
            value: `${barcodeOrders}`,
            options: {
              background: '#ffffff',
              height: '100',
              width: '3', 
              display: 'flex',
              justifyContent: 'center'
            }
          };
        const { inputRef } = useBarcode(options);
      
        return <svg className='barcode' ref={inputRef} style={  {
            display: 'block',
            margin: '0 auto',
            textAlign: 'center'
          }}/>;
      };

    const elem = order ?  () => {
        const {barcodeOrders, products, master, status, createdAt} = order 
        const newDate = `${createdAt.slice(8,10)}.${createdAt.slice(5,7)}.${createdAt.slice(0,4)}`
        const newTime = `${+createdAt.slice(11,13) + 3}:${createdAt.slice(14,16)}` 
        return(
            <>
                <Table striped bordered hover id={`${barcodeOrders}`}> 
                    <thead>
                        <tr>
                            <th className='item_time' style={{fontSize: '26px'}} colSpan={2}>
                                Дата 
                                <br/>
                                <Badge bg="secondary">{newDate}</Badge> 
                                <br/> 
                            </th>
                            <th className='item_time' style={{fontSize: '26px'}}>
                                Время
                                <br/>
                                <Badge bg="secondary">{newTime}</Badge>
                            </th>
                            <th  > 
                            {<Barcode barcodeOrders={barcodeOrders}/>}</th>
                            <th colSpan={3} style={{fontSize: '26px'}}>
                                Статус
                                <br/>
                                <Badge bg={ status === "Упакован" ?  "success" :  status === "Изготовление" ? "primary" : "warning"  } 
                                    style={{fontSize: '26px'}}>
                                    {status}
                                </Badge></th>
                        
                            <th colSpan={2} className='master' style={{fontSize: '26px'}}>Мастер
                            <br/> <Badge bg="secondary">{master}</Badge></th> 
                        </tr>
                    </thead>
                        <thead>
                            <tr style={{fontSize: '22px'}}>
                                <th>№</th>
                                <th>Фото</th>
                                <th>Артикул</th>
                                <th>Название</th>
                                <th>3пл/шт.</th>
                                <th>Кол-во</th>
                                <th>Общая 3пл/шт.</th>
                                <th>Кол-во компл.</th>
                                <th>Сварщик</th>
                            </tr>
                        </thead>
                        <tbody style={{fontSize: '22px'}}>
                            {products.map((product, i) => {
                                const {article, name_of_product, salary, quantity, quantityCompl, worker, main_photo_link} = product
                                return(
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td className='item_orders' ><img src={main_photo_link} style={{width: '100px'}}/></td>
                                        <td className='item_orders'>{article}</td>
                                        <td className='item_orders'>{name_of_product}</td>
                                        <td className='item_orders'>{salary}</td>
                                        <td className='item_orders' style={{fontSize: '30px', fontWeight: 'bold'}}>{quantity}</td>
                                        <td className='item_orders'>{quantity * salary}</td>
                                        <td className='item_orders'>{quantityCompl}</td> 
                                        <td className='item_orders'>{worker}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </Table>
                    <br/>      <br/>      <br/>
                    <h2 style={{margin: '0 auto'}}>Обновить статус
                        <br/>
                        {<Barcode barcodeOrders={'modal111'} />} {/* Неправильный способ вызова */}
                    </h2>

              </>
        )
    } : null 
    console.log(order)
 
    function updateStatus (status){
        
        setStatusModalOpen(true)
        setStatus(status)
      // Задержка перед перезагрузкой страницы
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
    return (
        <>
            {elem ? elem() : <h1>Введите штрихкод НАРЯДА</h1>}
 

            <ModalSendUpdateStatus modalOpen={modalOpen}  setModalOpen={setModalOpen} order={order}/>
            <ModalStatus modalStatusOpen={modalStatusOpen} setStatusModalOpen={setStatusModalOpen} status={status}/>
            <ModalMasters modalOpenMasters={modalOpenMasters} setModalOpenMasters={setModalOpenMasters}/>
        </>       
    )
}

export default UpdateStatusWarehouse