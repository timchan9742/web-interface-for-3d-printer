import React from "react"
import {Slider} from '@mui/material'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import PowerIcon from '@mui/icons-material/Power'
import {conn} from "./WebSocket"
import "./Fan.css"

import {LeftPanelContext} from "./Context"

// function FanHeader(props) {
//
//   return (
//     <div className="fan-header">
//       <div className="fan-header-icon">
//         <PowerIcon color="primary"/>
//       </div>
//       <h3 style={{paddingRight: "70%"}}>Fan Control</h3>
//       <Switch
//         edge="end"
//         onChange={props.toggleFanState}
//         checked={props.fanChecked}
//       />
//     </div>
//   )
// }

// function getJsonPackageFan(value) {
//   return {
//     type: "gcode_command",
//     payload: `M106 S${value}`
//   }
// }

function getJsonPackageFan(value) {
  return {
    type: "set_fan_power",
    payload: value
  }
}

function Fan() {

  const [fanPower, setFanPower] = React.useState(0)
  const [fanChecked, setFanChecked] = React.useState(false)

  const contextObj = React.useContext(LeftPanelContext)

  const handlePowerChange = (event, newPower) => {
    setFanPower(newPower)
  }

  const handlePowerChangeCommitted = (event, newPower) => {
    if(newPower > 0) {
      setFanChecked(true)
      const jsonPackage = getJsonPackageFan(Math.round(newPower / 100 * 255))
      conn.send(JSON.stringify(jsonPackage))
    }
    else {
      setFanChecked(false)
      const jsonPackage = getJsonPackageFan(0)
      conn.send(JSON.stringify(jsonPackage))
    }
  }

  const toggleFanState = () => {
    if(fanChecked) {
      setFanChecked(false)
      setFanPower(0)
      const jsonPackage = getJsonPackageFan(0)
      conn.send(JSON.stringify(jsonPackage))
    }
    else {
      setFanChecked(true)
      setFanPower(100)
      const jsonPackage = getJsonPackageFan(255)
      conn.send(JSON.stringify(jsonPackage))
    }
  }

  return (
    <div className="fan">
      <div className="fan-header">
        <div className="fan-header-icon">
          <PowerIcon color="primary"/>
        </div>
        <h3 style={{paddingRight: "81%"}}>Fan</h3>
        <Switch
          edge="end"
          onChange={toggleFanState}
          checked={fanChecked}
        />
      </div>
      <div className="fan-slider">
        <h3 style={{paddingRight:"15px"}}>Power:</h3>
        <Box width={600}>
          <Slider
            defaultValue={0}
            aria-label="Small"
            onChange={handlePowerChange}
            onChangeCommitted={handlePowerChangeCommitted}
            valueLabelDisplay="auto"
            max={100}
            value={fanPower}
          />
        </Box>
      </div>
    </div>
  )
}

export default Fan
