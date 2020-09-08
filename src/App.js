import 'date-fns';
import React, { useEffect } from 'react';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Grid from '@material-ui/core/Grid';

import BackspaceIcon from '@material-ui/icons/Backspace';

import ImportContactsIcon from '@material-ui/icons/ImportContacts';

import {
  MuiPickersUtilsProvider,
  DatePicker
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import TextField from '@material-ui/core/TextField';

import TodayIcon from '@material-ui/icons/Today';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";

import DiaryCard from './components/DairyCard';






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

}));


function App() {

  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const [filterStatus,setFilterStatus] = React.useState(false);

  const [datePicker, openDatePicker] = React.useState(false);

  const [modal,openModal] = React.useState(false);

  const [pageTitle,setPageTitle] = React.useState('');

  const [pageContent,setPageContent] = React.useState("<p><strong><span style='font-family: Helvetica, sans-serif; color: rgb(183, 183, 183); background-color: rgb(255, 255, 255); font-size: 24px;'>Take a deep breath before you write here :)</span></strong></p>");

  const [pageDate,setPageDate] = React.useState(new Date());

  const [pageDatePicker,openPageDatePicker] = React.useState(false);

  const [pages,addPages] = React.useState(localStorage.getItem('journals') || []);

  const [imageLink,setImageLink] = React.useState('');

  const [filtered,setFiltered] = React.useState([]);


  const filterByDate = (item) => {
    let date = selectedDate;
    let journalDate = new Date(parseInt(item.date));

    if(date.getDate() === journalDate.getDate() && date.getFullYear() === journalDate.getFullYear() && date.getMonth() === journalDate.getMonth()){
      return true;
    }
    else 
    return false;
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
    openDatePicker(false);
    setFilterStatus(true);

    //let journals = typeof(pages) == 'string' ? JSON.parse(pages) : pages;
    
    

  };

  const handlePageDateChange = (date) => {
    setPageDate(date);
    openPageDatePicker(false);
  };

  const updateContent = (e) => {
    //console.log(e.target.innerHTML);
    setPageContent(e.target.innerHTML);
}

  const handlePageSave = (e) => {
    let pageObject = {
      id : String(new Date().getTime()),
      image : imageLink,
      date : String(pageDate.getTime()),
      title : pageTitle,
      content : pageContent
    };
    if(typeof(pages) == 'object'){
      console.log(pages);
      localStorage.setItem('journals',JSON.stringify([...pages,pageObject]));
      addPages(JSON.stringify([...pages,pageObject]));
      console.log("First page",pages);
    }else{
      let journals = JSON.parse(pages);
      localStorage.setItem('journals',JSON.stringify([...journals,pageObject]));
      addPages(JSON.stringify([...journals,pageObject]));
      console.log(JSON.parse(pages));
    }

    openModal(false);
    setPageTitle('');
    setPageContent("<p><strong><span style='font-family: Helvetica, sans-serif; color: rgb(183, 183, 183); background-color: rgb(255, 255, 255); font-size: 24px;'>Take a deep breath before you write here :)</span></strong></p>"); 
    setPageDate(new Date());
  }



useEffect(()=> {
  if(!(pages.length > 2)){
    console.log(localStorage.getItem('journals'));
    localStorage.setItem('journals',JSON.stringify([]));
    console.log(localStorage.getItem('journals'));
 }else{
   console.log("Render the main UI");
 }

},[pages]);

useEffect(()=>{
  let journals = typeof(pages) == 'string' ? JSON.parse(pages) : pages;
  setFiltered(journals.filter(filterByDate));
},[selectedDate]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
         { filterStatus ? <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="back"
         onClick={()=>setFilterStatus(false)}
         >
            <BackspaceIcon />
          </IconButton> :null}
          <Typography variant="h6"  className={classes.title}>
            Journalize
          </Typography>
          <IconButton onClick={()=>openDatePicker(!datePicker)} edge="start" color="inherit" aria-label="filter"  className={classes.menuButton} style={{marginLeft:15}}  >
          <FilterListIcon fontSize="large"/>
        </IconButton>
        <DatePicker
        margin="normal"
        id="date-picker-dialog"
        label="Filter your Journalize"
        format="MM/dd/yyyy"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        open={datePicker}
        onClose = {()=>openDatePicker(false)}
        TextFieldComponent={() => null}
      />
          <Button variant="contained" startIcon={<ImportContactsIcon/>} className={classes.button} color="inherit" onClick={()=>openModal(true)}>Add New</Button>
        </Toolbar>
      </AppBar>
    </div>


{ filterStatus ? <div className={classes.gridRoot}>

{
<Grid container spacing={3}>
{typeof(filtered) == 'object' ? filtered.reverse().map((item,i)=>
<DiaryCard
title={item.title}
image={item.image}
content={item.content}
date={item.date}
id={item.id}
key={i}
/>
) :null}
</Grid>
}

</div> :   <div className={classes.gridRoot}>

    {
    <Grid container spacing={3}>
    {typeof(pages) == 'string' ? JSON.parse(pages).reverse().map((item,i)=>
    <DiaryCard
    title={item.title}
    image={item.image}
    content={item.content}
    date={item.date}
    id={item.id}
    key={i}
    />
    ) :null}
    </Grid>
    }

  </div>}
  <div>
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
        //defaultValue="Small"
        variant="outlined"
        size="small"
        placeholder="https://..."
        onChange={(e)=>setImageLink(e.target.value)}
      />
        <div style={{display:"flex"}}>
      <Button size="large" color="primary" style={{flexGrow:1}}
      onClick={handlePageSave}
      >
        Save
      </Button>
      <Typography gutterBottom variant="caption" component="p" className={classes.updatedDate} style={{paddingRight:15,alignSelf:"flex-end",fontSize:"inherit"}}>
      <b>{pageDate.toDateString()}</b>
   </Typography>
      <IconButton onClick={()=>openPageDatePicker(true)} edge="end" color="inherit" aria-label="today" size="medium">
      <TodayIcon /> 
    </IconButton> 
    </div>
    </div>
  </Fade>
</Modal>
  </div>
    </MuiPickersUtilsProvider>
  );
}

export default App;
