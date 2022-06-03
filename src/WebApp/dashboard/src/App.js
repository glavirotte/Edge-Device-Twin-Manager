import React from "react"
import Services from "./components/Services"
import "./App.css"

const App = () => {

    return (
      <body>
        <div className="header"></div>
        <nav>
          <div className="menu">
            <div className="logo">
              <a href="#">User Interface</a>
            </div>
            <ul>
              <li><a href="http://localhost:3000/devices">Devices</a></li>
              <li><a href="#">Home</a></li>
            </ul>
          </div>
          <div className="img"></div>
          <Services/>
        </nav>
        <div className="footer"></div>
      </body>
    )
}
export default App