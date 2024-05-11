import React from "react"
import axios from 'axios'
import "./Config.css"

import TextField from '@mui/material/TextField'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { Button } from '@mui/material'
import { IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import {conn} from "./WebSocket"

function ConfigHeader(props) {
  const handleRefreshConfig = () => {
    console.log("Refresh Config")
  }
  return (
    <div className="config-header">
      <h3>*config.cfg*</h3>
      <div className="config-header-option">
        <IconButton aria-label="refresh" size="large" color="primary" onClick={handleRefreshConfig}>
           <RefreshRoundedIcon fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  )
}

function Config() {

  const [printerConfig, setPrinterConfig] = React.useState('')
  const [hasPrinterConfig, setHasPrinterConfig] = React.useState(false)
  const getConfigFileURL = "http://127.0.0.1:5000/get_config_file"
  const updateConfigFileURL = "http://127.0.0.1:5000/update_config_file"

  const buttonStyle = {
    width: "100px",
    marginRight: "10px"
  }

  const getConfigFileRequest = async () => {
    await axios.get(getConfigFileURL)
     .then(response => response.data)
     .then(result => {
       if(result.status) {
         setHasPrinterConfig(true)
         setPrinterConfig(result.payload)
       } else {
         setHasPrinterConfig(false)
         alert("Failed to get config file")
       }
     }
   )
  }

  const updateConfigFileRequest = async () => {

    const formData = new FormData()
    formData.append('action', "UPDATE_CONFIG_FILE")
    formData.append('payload', printerConfig)

    await axios.post(updateConfigFileURL, formData)
    .then(response => response.data)
    .then(result => {
      if(result.status) {
        alert("Modified Successfully")
        getConfigFileRequest()
      } else {
        alert("Failed to update config file")
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  // const handleRefreshConfig = () => {
  //   getConfigFileRequest()
  //   console.log("Refresh Config")
  // }

  React.useEffect(() => {
    getConfigFileRequest()
  }, [])

  const handleConfigFileChange = (event) => {
    setPrinterConfig(event.target.value);
  }

  const handleApplyChange = () => {
    updateConfigFileRequest()
    setTimeout(() => {
      console.log("Restart program after config update");
      const jsonPackage = {
        type: "program_restart",
        payload: ""
      }
      conn.send(JSON.stringify(jsonPackage));
    }, 1000);
  }

  const handleCancelChange = () => {
    console.log("Cancel change")
  }

  return (
    <div className="config">
      <ConfigHeader />
      <div className="config-content">
        <TextField
          multiline
          fullWidth="true"
          rows="20"
          value={printerConfig}
          onChange={handleConfigFileChange}
        />
      </div>
      <div className="config-bottom">
        <Button disabled={!hasPrinterConfig} variant="contained" color="primary" size="large" style={buttonStyle} onClick={handleApplyChange}>Save</Button>
      </div>
    </div>
  )
}

export default Config
