import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import onScan from 'onscan.js' 
import Spinner from 'react-bootstrap/Spinner';

const PostingsCanceled = ({postingCanceled, loading}) => {
    const [onScanInitialized, setOnScanInitialized] = useState(false) 

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
                }else if(scanCode === 'posting111' ){
                window.location.href = '/posting-canceled'
                }
            };

        document.addEventListener('scan', handleScan);

        // Очистка обработчика событий при размонтировании компонента
        return () => {
        document.removeEventListener('scan', handleScan);
        };
    }, []); 

    useEffect(() => {
        if (!onScanInitialized) {
        onScan.attachTo(document);
        setOnScanInitialized(true);
        }
        
    }, []);


    return(
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>№</th>
            <th>Номер отправления</th>
            <th>Дата</th> 
          </tr>
        </thead>
        <tbody>
            {loading ? <GetSpinner/> : postingCanceled.map((posting, i) => {
                return (
                    <tr>
                    <td>{i+1}</td>
                    <td>{posting.posting_number}</td>
                    <td>-</td> 
                  </tr>
                )
            })}
        
        </tbody>
      </Table>
    )
}

export default PostingsCanceled

function GetSpinner(){
    return(
        <div className='spinner'>
            <Spinner animation="border" /> 
        </div>
    )
}