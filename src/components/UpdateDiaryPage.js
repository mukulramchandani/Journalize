import React, { useEffect } from 'react';

import TextField from '@material-ui/core/TextField';

import TodayIcon from '@material-ui/icons/Today';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import { makeStyles } from '@material-ui/core/styles';


import {
    MuiPickersUtilsProvider,
    DatePicker
  } from '@material-ui/pickers';
  
  import DateFnsUtils from '@date-io/date-fns';

  import 'date-fns';

  const useStyles = makeStyles((theme) => ({

    root: {
        flexGrow: 1,
        marginBottom:80
      },
      menuButton: {
        marginRight: theme.spacing(2),
        fontSize:'large'
      },
      title: {
        fontSize:20,
        flexGrow: 1,
      },
      searchRoot : {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        width: 300,
        marginRight:15,
      },
      input: {
        marginLeft: theme.spacing(3),
        flex: 1,
      },
      iconButton: {
        padding: 10,
      },
      button:{
        fontSize : 17,
        background:'orange',
        color:'black'
      },
      gridRoot : {
        flexGrow:1,
        padding:20
      },
      gridPaper : {
          padding: theme.spacing(2),
          textAlign: 'center',
          color: theme.palette.text.secondary,
      },
      cardRoot : {
        maxWidth: '100%',
      },
      cardMedia : {
        height : 200,
        width:'100%',
        alignSelf:'center'
      },
      updatedDate : {
        marginLeft : 20,
        fontSize:10,
        color:'grey'
      },
        modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      modalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      headerRoot : {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '100%',
        }
      }

  }))



export default function UpdateDiaryPage({id,title,content,image,date,modalState}){

    const classes = useStyles();

    const [modal, openModal] = React.useState(modalState);

    const [pageContent,setPageContent] = React.useState(content);

    const [pageTitle,setPageTitle] = React.useState(title);

    const [imageLink,setImageLink] = React.useState(image);

    const [pageDatePicker,openPageDatePicker] = React.useState(false);

    const [pageDate,setPageDate] = React.useState(new Date(parseInt(date)));

    let pages = JSON.parse(localStorage.getItem('journals'));

    const handlePageDateChange = (date) => {
        setPageDate(date);
        openPageDatePicker(false);
      };
    
      const updateContent = (e) => {
        //console.log(e.target.innerHTML);
        setPageContent(e.target.innerHTML);
    }

    const handlePageUpdate = (e) => {
        

        let journals = pages;


        for(var i=0;i<journals.length;i++){
            if(journals[i]["id"] === id){
                journals[i] = {
                    id : id,
                    image : imageLink,
                    date : String(pageDate.getTime()),
                    title : pageTitle,
                    content : pageContent
                }
                localStorage.setItem('journals',JSON.stringify([...journals]));
            }
        }
        window.location.reload();
        openModal(false);

        console.log(JSON.parse(journals));
    }

    useEffect(()=>{
        if(modal){
            openModal(true);
        }
        console.log(modal);
    },[modal])

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Modal
  aria-labelledby="transition-modal-title"
  aria-describedby="transition-modal-description"
  className={classes.modal}
  open={modal}
  onClose={()=>openModal(false)}
  closeAfterTransition
  BackdropComponent={Backdrop}
  BackdropProps={{
    timeout: 500,
  }}
>
  <Fade in={modal}>
    <div className={classes.modalPaper}>
      {/* <h2 id="transition-modal-title">Transition modal</h2> */}

      <DatePicker
      margin="normal"
      id="date-picker-dialog"
      label="Journalize"
      format="MM/dd/yyyy"
      value={pageDate}
      onChange={handlePageDateChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      open={pageDatePicker}
      onClose = {()=>openPageDatePicker(false)}
      TextFieldComponent={() => null}
    />

      <form className={classes.headerRoot} noValidate autoComplete="off">
      <div>
      <TextField
      id="standard-textarea"
      label="Name the best thing happenned today :)"
      placeholder="Journalize yourself!"
      multiline
      onBlur={(e)=>setPageTitle(e.target.value)}
      defaultValue={pageTitle}
    />
      </div>
      </form>
        <div style={{height:'400px',width:'200',overflow:"auto"}}>
            <JoditEditor
            value={pageContent}
            config={{
                readonly: false, // all options from https://xdsoft.net/jodit/play.html
                toolbar: true
            }}
           // onChange={}
            onBlur = {updateContent}
        />
        </div>
        <TextField
        label="Image Link"
        id="outlined-size-small"
        defaultValue={imageLink}
        variant="outlined"
        size="small"
        placeholder="https://..."
        onChange={(e)=>setImageLink(e.target.value)}
      />
        <div style={{display:"flex"}}>
        <Button size="medium" color="primary" style={{flexGrow:1}}
        onClick={()=>openModal(false)}
        >
          Close
        </Button>
      <Button size="medium" color="primary" style={{flexGrow:1}}
      onClick={handlePageUpdate}
      >
        Update
      </Button>

      <Typography gutterBottom variant="caption" component="p" className={classes.updatedDate} style={{paddingRight:15,alignSelf:"flex-end",fontSize:"inherit"}}>
      <b>{new Date(pageDate).toDateString()}</b>
   </Typography>
      <IconButton onClick={()=>openPageDatePicker(true)} edge="end" color="inherit" aria-label="today" size="medium">
      <TodayIcon /> 
    </IconButton> 
    </div>
    </div>
  </Fade>
</Modal>
</MuiPickersUtilsProvider>
    )

}