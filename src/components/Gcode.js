import React from "react"
import axios from 'axios'
import {conn} from "./WebSocket"
import { Button } from '@mui/material'
import { IconButton } from '@mui/material'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import PrintIcon from '@mui/icons-material/Print'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import "./Gcode.css"

import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'

import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

import {LeftPanelContext} from "./Context"

// name: 'tower_test.gcode',
// lastModified: 1626257452965,
// lastModifiedDate: Wed Jul 14 2021 18:10:52 GMT+0800 (China Standard Time),
// webkitRelativePath: '',
// size: 2283253

function GcodeHeader(props) {

  const [fileSelected, setFileSelected] = React.useState()
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isSelected, setIsSelected] = React.useState(false)

  // const handleSelectedFile = (event) => {
  //   setFileSelected(event.target.files[0])
  //   setOpenUploadDialog(true)
  //   setIsSelected(true)
  //   console.log(event.target.files[0])
  //   var reader = new FileReader();
  //   // var rawData = new ArrayBuffer();
  //   let file = event.target.files[0]
  //   conn.binaryType = "arraybuffer";
  //
  //   reader.onerror = () => {
  //     console.log("Error while loading file")
  //   }
  //   reader.onload = async function(event) {
  //     var startTime, endTime
  //     startTime = new Date()
  //     var rawData = event.target.result
  //     const dataLength = rawData.length
  //     const chunkSize = 4096
  //     const numOfChunks = Math.ceil(dataLength / chunkSize)
  //     //before sending file
  //     const jsonPackageStartUpload = {
  //       type: "gcode_file_upload_start",
  //       filename: file.name,
  //       length: numOfChunks,
  //       payload: ""
  //     }
  //     conn.send(JSON.stringify(jsonPackageStartUpload))
  //
  //     for(let i = 0; i < numOfChunks; i++) {
  //       var chunkData
  //       if(i === numOfChunks) {
  //         chunkData = rawData.slice(i * chunkSize)
  //       } else {
  //         chunkData = rawData.slice(i * chunkSize, i * chunkSize + chunkSize)
  //       }
  //       //on sending file
  //       const jsonPackageUploading = {
  //         type: "gcode_file_upload",
  //         seq: i,
  //         filename: file.name,
  //         payload: chunkData,
  //       }
  //       conn.send(JSON.stringify(jsonPackageUploading))
  //     }
  //     //after sending file
  //     const jsonPackageUploadFinish = {
  //       type: "gcode_file_upload_finish",
  //       filename: file.name,
  //       payload: ""
  //     }
  //     conn.send(JSON.stringify(jsonPackageUploadFinish))
  //
  //     setOpenUploadDialog(false)
  //     endTime = new Date()
  //     console.log(endTime.getTime() - startTime.getTime())
  //   }
  //   reader.readAsBinaryString(event.target.files[0])
  //
  // }
  const uploadGcodeFileURL = "http://127.0.0.1:5000/upload_gcode_file"

  const uploadGcodeFileRequest = async (filename, payload) => {
    const formData = new FormData()
    formData.append('action', "UPLOAD_GCODE_FILE")
    formData.append('filename', filename)
    formData.append('payload', payload)
    await axios.post(uploadGcodeFileURL, formData)
    .then(response => response.data)
    .then(result => {
      if(result.status) {
        setOpenUploadDialog(false)
        props.refreshFileList()
      } else {
        alert("Failed to upload file")
      }
    })
  }

  const handleSelectedFile = (event) => {
    setFileSelected(event.target.files[0])
    setOpenUploadDialog(true)
    setIsSelected(true)
    var reader = new FileReader();
    let file = event.target.files[0]
    reader.onerror = () => {
      console.log("Error while loading file")
    }
    reader.onload = async function(event) {
      var startTime, endTime
      startTime = new Date()
      var rawData = event.target.result
      if(rawData.length > (10 * 1024 * 1024)) {
        alert("File too large (>10Mb)")
      } else {
        uploadGcodeFileRequest(file.name, rawData)
        endTime = new Date()
        console.log(endTime.getTime() - startTime.getTime())
      }
    }
    reader.readAsBinaryString(event.target.files[0])

  }

  const clearSelectedFile = (event) => {
    event.target.value = null
    setFileSelected(null)
    setIsSelected(false)
    setUploadProgress(0)
  }

  const handleClose = () => {

  }

  return (
    <div className="gcode-header">
      <div className="gcode-header-icon">
        <InsertDriveFileRoundedIcon color="primary"/>
      </div>
      <h3>Files</h3>
      <div className="gcode-header-option" style={{paddingLeft:"50%"}}>
        <Tooltip title="Upload A New File">
          <IconButton aria-label="add" size="large" color="primary" component="label" >
             <AddRoundedIcon fontSize="inherit" />
             <input type="file" accept=".gcode" onChange={handleSelectedFile} onClick={clearSelectedFile} hidden/>
          </IconButton>
        </Tooltip>
      </div>
      <div className="gcode-header-option">
        <Tooltip title="Refresh File List">
          <IconButton aria-label="refresh" size="large" color="primary" onClick={props.refreshFileList}>
             <RefreshRoundedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </div>
      <Dialog
        open={openUploadDialog}
        onClose={handleClose}
        aria-labelledby="upload-dialog-title"
        aria-describedby="upload-dialog-description"
      >
        <DialogTitle>
          {"File uploading, please wait"}
        </DialogTitle>
        <DialogContent>
          <LinearProgress />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function GcodeRow(props) {

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [openEditDialog, setOpenEditDialog] = React.useState(false)
  // const [fileContent, setFileContent] = React.useState({content: ''})
  const [fileContent, setFileContent] = React.useState([])
  const getGcodeFileContentURL = "http://127.0.0.1:5000/get_gcode_file?filename="
  const updateGcodeFileContentURL = "http://127.0.0.1:5000/update_gcode_file?filename="
  const deleteGcodeFileURL = "http://127.0.0.1:5000/delete_gcode_file?filename="
  const open = Boolean(anchorEl)
  const editPanelRef = React.useRef()

  const getGcodeFileContentRequest = async () => {
    await axios.get(getGcodeFileContentURL + props.name)
    .then(response => response.data)
    .then(result => {
      if(result.status) {
        setFileContent(Array.from(result.payload))
      } else {
        alert(`Failed to get ${props.name} from the server`)
      }
    })
  }

  const updateGcodeFileContentRequest = async () => {
    const formData = new FormData()
    formData.append('action', "UPDATE_GCODE_FILE")
    formData.append('filename', props.name)
    formData.append('payload', fileContent.content)
    await axios.post(updateGcodeFileContentURL + props.name, formData)
    .then(response => response.data)
    .then(result => {
      if(result.status) {
        //
      } else {
        alert(`Failed to update ${props.name}`)
      }
    })
  }

  const deleteGcodeFileRequest = async () => {
    await axios.get(deleteGcodeFileURL + props.name)
    .then(response => response.data)
    .then(result => {
      if(result.status) {
        //if succeeds, refresh the file list so the newest change can be seen
        props.refreshFileList()
      } else {
        alert(`Failed to delete ${props.name}`)
      }
    })
  }

  const handleRowItemClick = (event) => {
    setAnchorEl(event.currentTarget)
    setOpenEditDialog(false)
  }

  const handleRowItemClose = () => {
    setAnchorEl(null)
  }

  const handlePrintClick = () => {
    setAnchorEl(null)
    const jsonPackage = {
      type: "start_print",
      payload: props.name
    }
    if(props.name != "-") {
      conn.send(JSON.stringify(jsonPackage))
      console.log(jsonPackage)
    }
  }

  const handleEditClick = () => {
    setAnchorEl(null)
    setOpenEditDialog(true)
    getGcodeFileContentRequest()
  }

  // const handleDeleteClick = () => {
  //   setAnchorEl(null)
  //   const jsonPackage = {
  //     type: "gcode_file_delete",
  //     payload: props.name
  //   }
  //   if(props.name != "-") {
  //     conn.send(JSON.stringify(jsonPackage))
  //     console.log(jsonPackage)
  //   }
  // }

  const handleDeleteClick = () => {
    setAnchorEl(null)
    deleteGcodeFileRequest()
  }

  // const handleFileContentChange = (event) => {
  //   console.log(event.target.value)
  //   setFileContent({content: event.target.value})
  // }

  const handleFileContentChange = (index) => (event) => {
    console.log(index)
    console.log(event.target.value)
    // setFileContent(oldContent => {
    //   oldContent[index] = event.target.value
    // })
  }

  const handleSaveEdit = () => {
    updateGcodeFileContentRequest()
    setOpenEditDialog(false)
  }

  const handleCancelEdit = () => {
    setOpenEditDialog(false)
  }

  const menuItemStyle = {
    paddingLeft: "20px",
    display:"flex",
    justifyContent:"space-between"
  }


  const Row = ({ index, style }) => (
    <div className="content-display-row" style={style}>
      <TextField
        fullWidth="true"
        defaultValue={fileContent[index]}
        onChange={handleFileContentChange(index)}
      />
    </div>
  )

  // <TextField
  //   fullWidth="true"
  //   defaultValue={fileContent[index]}
  //   onChange={handleFileContentChange(index)}
  // />

  const ContentPanel = () => (
    <FixedSizeList
      className="content-display"
      height={500}
      width={860}
      itemSize={54}
      itemCount={fileContent.length}
    >
      {Row}
    </FixedSizeList>
  )


  if(props.name === "Name") { //This will be the first row(Name:   Last Printed:   Last Modified:), it is not clickable
    return (
      <div className="gcode-row">
        <div className="gcode-row-content">
          <p style={{flex: 0.48, fontWeight: 'bold', paddingLeft:"20px"}}>{props.name}</p>
          <p style={{flex: 0.38, fontWeight: 'bold'}}>{props.lastPrinted}</p>
          <p style={{flex: 0.2, fontWeight: 'bold'}}>{props.lastModified}</p>
        </div>
      </div>
    )
  }
  else {
    return ( //These are real clickable rows
      <div className="gcode-row">
        <ListItemButton style={{height:"50px", display:"flex"}}
          aria-label="dropdown"
          id="long-button"
          aria-controls="long-menu"
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleRowItemClick}
        >
          <div className="gcode-row-icon">
            <DescriptionRoundedIcon fontSize="medium" color="primary"/>
          </div>
          <div className="gcode-row-content">
            <p id="first-column" style={{}}>{props.name}</p>
            <p id="second-column" style={{}}>{props.lastPrinted}</p>
            <p id="third-column" style={{}}>{props.lastModified}</p>
          </div>
        </ListItemButton>
        <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        style={{marginLeft: "200px"}}
        anchorEl={anchorEl}
        open={open}
        onClose={handleRowItemClose}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: '22ch',
          },
        }}
        >
          <MenuItem key="print" style={menuItemStyle} onClick={handlePrintClick}>
            Print
            <PrintIcon/>
          </MenuItem>
          <MenuItem key="edit" style={menuItemStyle} onClick={handleEditClick}>
            Edit
            <EditIcon/>
          </MenuItem>
          <MenuItem key="delete" style={menuItemStyle} onClick={handleDeleteClick}>
            Delete
            <DeleteIcon/>
          </MenuItem>
        </Menu>
        <Dialog
          open={openEditDialog}
          aria-labelledby="edit-dialog-title"
          aria-describedby="edit-dialog-description"
          scroll={"paper"}
          sx={{height:"700px"}}
          fullWidth="true"
          maxWidth="md"
        >
          <DialogTitle>{props.name}</DialogTitle>
          <DialogContent>
            <ContentPanel />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveEdit}>Save</Button>
            <Button onClick={handleCancelEdit}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

// <textarea
//   className="input"
//   rows="1"
//   cols="100"
//   defaultValue={fileContent[index]}
//   onChange={handleFileContentChange(index)}
//   style={{border:"none", outline:"none"}}
// >
// </textarea>

// <div className="gcode-content" style={{backgroundColor:"#eff2f5"}}>
//   <TextField
//     multiline
//     fullWidth="true"
//     rows="20"
//     autoFocus="true"
//     value=""
//     onChange={handleFileContentChange}
//   />
// </div>

function Gcode() {

  const [fileList, setFileList] = React.useState([])
  const getGcodeFileListURL = "http://127.0.0.1:5000/get_gcode_file_list"
  const contextObj = React.useContext(LeftPanelContext)

  const jsonPackage = {
    type: "gcode_file_request",
    payload: ""
  }

  const requestGcodeFileList = async () => {
    await axios.get(getGcodeFileListURL)
     .then(response => response.data)
     .then(result => {
       if(result.status) {
         setFileList(result.payload)
       } else {
         alert("Failed to get gcode files from the server")
       }
     }
     )
  }

  const refreshFileList = () => {
    requestGcodeFileList()
    console.log("Refresh file list")
  }

  React.useEffect(() => {
    requestGcodeFileList()

  }, [])

  // React.useEffect(() => {
  //   setInterval(() => {
  //     conn.send(JSON.stringify(jsonPackage))
  //   }, 1000)
  // },[])

  return (
    <div className="gcode">
      <GcodeHeader refreshFileList={refreshFileList}/>
      <GcodeRow name="Name" lastPrinted="Last Printed" lastModified="Last Modified" />
      <List
        sx={{
        width: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 200,
        }}
      >
      {
        fileList.map(function(file, i){
          return <GcodeRow name={file.name} lastPrinted="-" lastModified={file.modified} refreshFileList={refreshFileList}/>
        })
      }
      </List>
    </div>
  )

}

export default React.memo(Gcode)

// {
//   contextObj.gcodeFileList.map(function(filename, i){
//     return <GcodeRow name={filename} lastPrinted="-" lastModified="Today at 15:33" />
//     })
// }


// <GcodeRow name="3DBenchy.gcode" lastPrinted="-" lastModified="Today at 15:33" />
// <GcodeRow name="Pikachu.gcode" lastPrinted="-" lastModified="Today at 15:33" />
// <GcodeRow name="TestCube.gcode" lastPrinted="-" lastModified="Today at 15:33" />
// <GcodeRow name="PressureAdvanceTests.gcode" lastPrinted="-" lastModified="Today at 15:33" />
// <GcodeRow name="FanSet.gcode" lastPrinted="-" lastModified="Today at 15:33" />
// <GcodeRow name="HeatTower.gcode" lastPrinted="-" lastModified="Today at 15:33" />
// <GcodeRow name="IronMan.gcode" lastPrinted="-" lastModified="Today at 15:33" />
