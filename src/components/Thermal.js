import React from "react"
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import ThermalChart from "./ThermalChart"
import {conn} from "./WebSocket"
import "./Thermal.css"

import {LeftPanelContext} from "./Context"

function ThermalHeader(props) {

  const [chartVisibility, setChartVisibility] = React.useState(true)
  const buttonStyle = {
    width: "115px"
  }

  // const handleHeaterOff = () => {
  //   const jsonPackage = {
  //     type: "gcode_command",
  //     payload: "M104 S0\nM140 S0"
  //   }
  //   conn.send(JSON.stringify(jsonPackage))
  // }

  const handleHeaterOff = () => {
    const jsonPackage = {
      type: "heaters_off",
      payload: ""
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  const handleChartOff = () => {
    if(chartVisibility) {
      props.setDisplayChart(false)
      setChartVisibility(false)
    } else {
      props.setDisplayChart(true)
      setChartVisibility(true)
    }
  }
  return (
    <div className="thermal-header">
      <div className="thermal-header-icon">
        <LocalFireDepartmentRoundedIcon color="primary"/>
      </div>
      <h3 style={{paddingRight: "48%"}}>Thermal</h3>
      <div className="thermal-heater-off" style={{paddingRight:"10px"}}>
        <Button variant="contained" style={buttonStyle} size="small" onClick={handleHeaterOff}>Heaters off</Button>
      </div>
      <div className="thermal-chart-off">
        <Button variant="contained" style={buttonStyle} size="small" onClick={handleChartOff}>{chartVisibility? "Chart off" : "Chart on"}</Button>
      </div>
    </div>
  )
}

function ThermalRow(props) {

  const [inputValue, setInputValue] = React.useState("")

  const handleInputValueChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleSetTemperature = (event) => {
    if(event.key === 'Enter') {
      switch(props.name) {
        case "Extruder":
          // const jsonPackage1 = {
          //   type: "gcode_command",
          //   payload: `M104 S${event.target.value}`
          // }
          const jsonPackage1 = {
            type: "set_extruder_temperature",
            payload: event.target.value
          }
          conn.send(JSON.stringify(jsonPackage1))
          setInputValue("")
          break
        case "Bed":
          // const jsonPackage2 = {
          //   type: "gcode_command",
          //   payload: `M140 S${event.target.value}`
          // }
          const jsonPackage2 = {
            type: "set_bed_temperature",
            payload: event.target.value
          }
          conn.send(JSON.stringify(jsonPackage2))
          setInputValue("")
          break
        case "Pi":
          setInputValue("")
          break
        default:
          break
      }
    }
  }

  if(props.name === "NAME") {
    return (
      <div className="thermal-row">
        <p style={{fontWeight: 'bold'}}>{props.name}</p>
        <p style={{fontWeight: 'bold'}}>{props.power}</p>
        <p style={{fontWeight: 'bold'}}>{props.temp}</p>
        <p style={{fontWeight: 'bold'}}>{props.target}</p>
      </div>
    )
  }
  else {
    return (
      <div className="thermal-row">
        <p stype={{padding: "0px 10px"}}>{props.name}</p>
        <p>{props.power}</p>
        <p>{props.temp}</p>
        <input
          type="text"
          placeholder="°C"
          value={inputValue}
          onChange={handleInputValueChange}
          onKeyDown={handleSetTemperature}
        />
      </div>
    )
  }
}

function Thermal() {


  const [displayChart, setDisplayChart] = React.useState(true)
  const contextObj = React.useContext(LeftPanelContext)

  React.useEffect(() => {
    const jsonPackage = {
      type: "get_temperature_all",
      payload: ""
    }
    // setInterval(() => {
    //   conn.send(JSON.stringify(jsonPackage))
    // },1000)

  }, [])

  // <ThermalChart displayChart={displayChart} temperature={contextObj.temperature} />

  return (
    <div className="thermal">
      <ThermalHeader setDisplayChart={setDisplayChart}/>
      <ThermalRow name="NAME" power="Power" temp="Temp" target="Target"/>
      <ThermalRow name="Extruder" power={contextObj.extruder.setTemp > 0? "on" : "off"} temp={`${contextObj.extruder.temp}°C`} target="0"/>
      <ThermalRow name="Bed" power={contextObj.bed.setTemp > 0? "on" : "off"} temp={`${contextObj.bed.temp}°C`} target="0"/>
      <ThermalRow name="PI" power="on" temp={`${contextObj.pi.temp}°C`} target="0"/>
      <ThermalChart displayChart={displayChart} temperature={ {extruder: contextObj.extruder.temp, bed: contextObj.bed.temp, pi: contextObj.pi.temp} }/>
    </div>
  )
}

// return (
//   <div className="thermal">
//     <ThermalHeader setDisplayChart={setDisplayChart}/>
//     <ThermalRow name="NAME" power="Power" temp="Temp" target="Target"/>
//     <ThermalRow name="Extruder" power={contextObj.isHeating? "on" : "off"} temp={`${contextObj.temperature.extruder}°C`} target="0"/>
//     <ThermalRow name="Bed" power={contextObj.isHeating? "on" : "off"} temp={`${contextObj.temperature.bed}°C`} target="0"/>
//     <ThermalRow name="PI" power="on" temp={`${contextObj.temperature.pi}°C`} target="0"/>
//     <ThermalChart displayChart={displayChart} temperature={contextObj.temperature} />
//   </div>
// )

export default React.memo(Thermal);

// export default React.memo(
//   Thermal,
//   (prevProps, nextProps) => prevProps.value2 === nextProps.value2
// );
