import React, { useState } from "react"
import DeviceDisplayer from "./DeviceDisplayer"

const url = "http://localhost:8000"

const Services = () => {
    const [count, setCount] = useState(0)
    return (        
        <div className="center">
            <DeviceDisplayer/>
        </div>)
}

export default Services;