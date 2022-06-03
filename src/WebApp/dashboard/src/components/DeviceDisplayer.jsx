import { useState, useEffect } from 'react';
const url = "http://localhost:8000"

function switchLight(){
    fetch(url+"/devices/B8A44F3A42AB/light/switch")
    .then((data) => {console.log(data.json())})
}

const DeviceDisplayer = (props) =>{

    const [twin, setTwin] = useState()
    useEffect(() => {
        fetch(url+'/devices/B8A44F3A42AB')
        .then((response) => response.json())
        .then(res => {setTwin(res); console.log(res)})
    },[])

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>ip Address</th>
                        <th>Status</th>
                        <th>Black and White mode</th>
                        <th>Properties</th>
                    </tr>
                </thead>
                <tbody>
                 {(twin !== undefined && Object.keys(twin).length > 0) ? 
                    (<tr>
                        <td>{twin.id}</td>
                        <td>{twin.ipAddress}</td>
                        <td >{(twin.state === 0) ? "Offline" : "Online"}</td>
                        <td>{(twin.lightStatus === true) ? "On":"Off"}</td>
                        <td>
                            <tr><td>{twin.properties?.Architecture}</td></tr>
                            <tr><td>{twin.properties?.ProdNbr}</td></tr>
                            <tr><td>{twin.properties?.ProdNbr}</td></tr>
                            <tr><td>{twin.properties?.HardwareID}</td></tr>
                            <tr><td>{twin.properties?.ProdFullName}</td></tr>
                            <tr><td>{twin.properties?.Brand}</td></tr>
                            <tr><td>{twin.properties?.ProdType}</td></tr>
                            <tr><td>{twin.properties?.Soc}</td></tr>
                            <tr><td>{twin.properties?.SocSerialNumber}</td></tr>
                            <tr><td>{twin.properties?.WebURL}</td></tr>
                            <tr><td>{twin.properties?.ProdVariant}</td></tr>
                            <tr><td>{twin.properties?.SerialNumber}</td></tr>
                            <tr><td>{twin.properties?.ProdShortName}</td></tr>
                            <tr><td>{twin.properties?.BuildDate}</td></tr>
                        </td>
                    </tr>
                    )
                    : ('Loading ...')}
                </tbody>
            </table>
            <div className="btns">
                <button onClick={switchLight}>Switch light</button>
            </div>
            
        </div>
    )
}
 
 export default DeviceDisplayer;