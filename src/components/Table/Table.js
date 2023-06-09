import NavLink from '../NavLink/Nav-link';
import { useState } from 'react';
import './Table.scss'

function Table({props, date, setDate, onLoadingProducts, basketsCompl}) {
 

    const elem = props[0] ? props[0].map((item, i) => {
        const {Column14, Column15, Column16, 
             Column17, Column18, Column19, Column20, Column22, 
             Column23, Column24, Column25, Station, article, 
             date, eyelet, height, loops, name, number_of_roll,
             postingNumber, price, roll, screws, weight, width, Column21, warehouse, quantity} = item;

         const res = basketsCompl.filter(item => {
            if(item.article === article){
                return item.package_contents
            }
        }) 
     
        return (
            <table className='order' key={i}>
                <thead>
        
                <tr className='main__head'>
                <tr>
                    <th className='name'><h2>ОЗОН</h2></th>
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
                        <th className='about-head__time'>{`${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`}</th>
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
                            <th className='address'>{warehouse === 'Крупногабарит' ? ' Подгорная, 61, 1. ' :' Белоостровская улица, 10к1'}</th>
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
                            <th>{res[0] ? res[0].package_contents  : null}</th>
                        </tr>
                        <tr>
                            <th>-</th>
                        </tr>
                    </tr>
            
                </div>
                </tbody>
            </table>
        )
    }) : null;
    return (
        <>
            <NavLink date={date} setDate={setDate} onLoadingProducts={onLoadingProducts}/>
            {elem ? elem : <h2>Введите дату</h2>}
       
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