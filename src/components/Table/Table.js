import NavLink from '../NavLink/Nav-link';
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import onScan from 'onscan.js'
import './Table.scss'

function Table({props, date, setDate, onLoadingProduct, loading, error, setCompany, company, warehouse}) {
    const [barcode, setBarcode] = useState('');
    const [onScanInitialized, setOnScanInitialized] = useState(false) 
    console.log(props)
  useEffect(() => {
    if (!onScanInitialized) {
      onScan.attachTo(document);
      setOnScanInitialized(true);
    }
  }, []);

  useEffect(() => {
    onLoadingProduct(barcode);
  }, [barcode]);
 
  useEffect(() => {
    const handleScan = (e) => {
      console.log(e.detail.scanCode);
      const scanCode = e.detail.scanCode;
    //   if (scanCode === '634359') {
    //     setCompanyName('АрсеналЪ');
    //     setCompany({
    //       'Client-Id': '634359',
    //       'Api-Key': '88e173c2-16ad-4a13-a3a5-c322f8a6e305'
    //     });
    //   } else if (scanCode === '611694') {
    //     setCompanyName('ЦМА');
    //     setCompany({
    //       'Client-Id': '611694',
    //       'Api-Key': '95596469-5a81-4bac-a052-7aa473a405f9'
    //     });
    //   }
      setBarcode(scanCode);
    };

    document.addEventListener('scan', handleScan);

    // Очистка обработчика событий при размонтировании компонента
    return () => {
      document.removeEventListener('scan', handleScan);
    };
  }, []);

    const elem = props ? ( ) => {
         
        const {Column14, Column15, Column16, 
             Column17, Column18, Column19, Column20, Column22, 
             Column23, Column24, Column25, Station, article, 
             date, eyelet, height, loops, name, number_of_roll, postingNumber,
            price, roll, screws, weight, width, Column21, quantity, photo} = props[0];
            console.log(date)
    
        return (
            <div className='main-table'>
                <table className='order'>   
                    <thead>
            
                    <tr className='main__head'>
                    <tr>
                        <th className='name'><h2>{company}</h2></th>
                    </tr>
                        <tr className='info'>
                            <th>Дата оформления</th>
                            <th>  {getCurrentDate()}</th>
                            <tr>
                                <th>Оформил</th>
                                <th>Захар</th>
                            </tr>
                            <div className='collector'>
                                <th >Сборщик</th>
                                <th > </th>
                            </div>
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
    
                            <tr className='order-name'>
                                <th>Адрес склада/магазина</th>
                                <th className='address'>{warehouse.slice(0, 6) === 'СТАРЫЙ' ?  ` Белоостровская улица, 10к1`  :' Белоостровская улица, 12'}</th>
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
                        <tr className='compl'> 
                            <tr className='compl-name'><th><h3>Комплектация заказа</h3></th> </tr>
                            
                            <GetCompl quantity={quantity} article={article}/>
                        </tr>
    
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
                <img src={photo}/>
            </div>
         
        )
    }: null;

 
     const Order = elem ? elem() : <h4>Введите штрихкод</h4> 
    return (
        <>  
            <h5 onClick={() => {setBarcode('400132886984000')}}>{company}</h5>
            <tr className='warehouse'>
                <th className='name-warehouse'><h6>СКЛАД:</h6></th>
                <th className='address'><h6>{`${warehouse.slice(0, 8)}`}</h6></th>
            </tr>

            <NavLink date={date} setDate={setDate}  />
            {error ? <h4>Штрихкод товара не найден</h4> : loading ? <GetSpinner/> : Order}   
        </>
)}
    
export default Table;

function getCurrentDate(separator='-'){

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        
        return `${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
        }

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

 