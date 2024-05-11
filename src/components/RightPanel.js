import React from "react"
import Printer from "./Printer"
import Fan from "./Fan"
import Gcode from "./Gcode"
import Console from "./Console"
import "./RightPanel.css"

function RightPanel() {

  return (
    <div className="right-panel">
      <Printer />
      <Console />
    </div>
  )
}

export default React.memo(RightPanel)


const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};
