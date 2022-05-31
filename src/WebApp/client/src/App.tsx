import { response } from "express"
import React, { useEffect, useState } from "react"

function App(){

    interface BackendData {
      users:string[]
      }

    const [backendData, setBackendData] = useState<BackendData | null>(null)
    useEffect(()=>{
        fetch("http://localhost:8000/")
            .then((response) => response.json())
            .then(data => {setBackendData(data)})
    },[])
    return (
      <body>
        <div>
            {
              (backendData !== undefined)?(<p>{backendData?.users[0]}</p>):(<p>Loading...</p>)
            }
        </div>
      </body>

    )
}
export default App