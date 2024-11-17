import React from 'react'
import './style.css'
const Dock = () => {
  return (
    <div>
        <nav class="ui-dock">
  <a href="#home">
  <i class="fa-solid fa-video"  style={{ scale: "1.3" , color: "#ffffff"}}></i>
  </a>
  <a href="#search">
  <i class="fa-solid fa-cloud-arrow-up" style={{ scale: "1.3" , color: "#ffffff"}}></i>
  </a>
  <a href="#following">
<i class="fa-solid fa-file"  style={{ scale: "1.3" , color: "#ffffff"}}></i>
  </a>
  {/* <a href="#settings">
  <i class="fa-solid fa-chess-board" style={{ scale: "1.3" , color: "#ffffff"}}></i>
  </a> */}
</nav>
     
    </div>
  )
}

export default Dock