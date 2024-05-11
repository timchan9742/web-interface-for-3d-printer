import React from "react"
import Thermal from "./Thermal"
import Fan from "./Fan"
import Gcode from "./Gcode"
import Console from "./Console"
import "./LeftPanel.css"

function LeftPanel() {
  return (
    <div className="left-panel">
      <Thermal />
      <Gcode />
      <Fan />
    </div>
  )
}

export default LeftPanel
