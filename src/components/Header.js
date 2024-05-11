import React from "react"
import {conn} from "./WebSocket"
import { IconButton } from '@mui/material'
import Badge from '@mui/material/Badge'
import HomeRoundedIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import Tooltip from '@mui/material/Tooltip'
import "./Header.css"

import { red, green, pink, grey }  from '@mui/material/colors'

function Header(props) {

  const handleHomePageSelected = () => {
    props.setIsHomeSelected(true)
  }

  const handleSettingPageSelected = () => {
    props.setIsHomeSelected(false)
  }

  const handleSystemReset = () => {
    const jsonPackage = {
      type: "system_reset",
      payload: ""
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  const handleEmergencyStop = () => {
    const jsonPackage = {
      type: "emergency_stop",
      payload: ""
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  const handleProgramRestart = () => {
    const jsonPackage = {
      type: "program_restart",
      payload: ""
    }
    conn.send(JSON.stringify(jsonPackage))
  }

  return (
    <div className="header">
      <div className="header-left">
        <h2 style={{color:"green"}}>Green Eco</h2>
      </div>

      <div className="header-middle">
        <div className="header-option">
          <IconButton aria-label="home" size="small" style={{width:"80px"}} onClick={handleHomePageSelected}>
            <div className="header-option-content">
              <HomeRoundedIcon fontSize="large" color="primary"/>
              Home
            </div>
          </IconButton>
        </div>
        <div className="header-option">
          <IconButton aria-label="setting" size="small" style={{width:"80px"}} onClick={handleSettingPageSelected}>
            <div className="header-option-content">
              <SettingsIcon fontSize="large" color="primary"/>
              Config
            </div>
          </IconButton>
        </div>
      </div>

      <div className="header-right">
        <div className="header-right-button" >
          <Tooltip title="System Reset">
            <IconButton aria-label="system-reset" size="large" sx={{ color: green[800] }} onClick={handleSystemReset}>
               <ReplayCircleFilledIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="header-right-button" >
          <Tooltip title="Emergency Stop">
            <IconButton aria-label="emergency-stop" size="large" sx={{ color: red[800] }} onClick={handleEmergencyStop}>
               <StopCircleIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="header-right-button" >
          <Tooltip title="Program Restart">
            <IconButton aria-label="program-restart" size="large" sx={{ color: red[800] }} onClick={handleProgramRestart}>
              <ReportGmailerrorredIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="header-right-button" >
          <Tooltip title="Notification">
            <IconButton aria-label="notification" size="large" sx={{ color: grey[700] }}>
              <Badge color="primary" badgeContent={1}>
                <NotificationsNoneIcon fontSize="inherit" />
              </Badge>
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default Header
