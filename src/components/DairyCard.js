import React, { useEffect } from 'react';

import 
{ Card,CardActionArea,CardActions,CardContent,CardMedia, makeStyles, Typography,Grid,Button,Modal,Backdrop,Fade } 
from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';


import parse from 'html-react-parser';

import UpdateDiaryPage from './UpdateDiaryPage';



const useStyles = makeStyles((theme)=>({
    cardRoot : {
        maxWidth: '100%',
      },
      cardMedia : {
        height : 200,
        width:'100%',
        alignSelf:'center'
      },
      cardContent : {
          maxHeight:100,
          overflow:'hidden',
      },
      cardTitle:{
          maxHeight:60,
          overflow:'hidden'
      },
      updatedDate : {
        marginLeft : 20,
        fontSize:18,
        color:'grey'
      },
      appBar: {
        position: 'relative',
      },
      title: {
        marginLeft: theme.spacing(2),
        flex: 1,
      },
      viewImage:{
        height : '30%',
        width:'30%',
        alignSelf:'center'
      },
      viewTitle:{
          alignSelf:"center"
      },
      paper: {
        position: 'absolute',
        width: 'auto',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
}));





export default function DairyCard({title,content,date,image,id}){

    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [updatePage,setUpdatePage] = React.useState(false);

    const [didMount,setDidMount] = React.useState(false);



    const dairyDate = new Date(parseInt(date)).toDateString();

    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };


      useEffect(()=>{
        if(!didMount){
          setDidMount(true);
        }else{
        if(!updatePage){
          setUpdatePage(true);
        }else {
          setUpdatePage(false);
          setUpdatePage(true);
        }
        }
        console.log(updatePage)
      },[updatePage])
    return (
        <>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
      <Fade in={open}>

      <div className={classes.paper}>
      <div style={{display:"flex",justifyContent:"center"}}>
            <Button endIcon={<CloseIcon/>} size="small" color="primary" variant="contained" onClick={handleClose}>
            close
            </Button>
  </div>
      <CardMedia
      className={classes.cardMedia}
      image={image}
      title="diaryImg"
      />
      <div style={{overflow:"scroll",maxHeight:'300px'}}>
      <CardContent>
      <Typography gutterBottom variant="h5" component="h2" className={classes.viewTitle}>
      {title}
      </Typography>
      <div>
      {parse(content)}
      </div>
      </CardContent>
      </div>
      </div>
    </Fade>
      </Modal>
        <Grid item xs={12} sm={6} md={4}>
        <Card className={classes.cardRoot}>
        <CardActionArea
        onClick={handleClickOpen}
        >            
        <CardMedia
        className={classes.cardMedia}
        image={image}
        title="diaryImg"
        />
        <CardContent>
        <Typography gutterBottom variant="h5" component="h2" className={classes.cardTitle}>
        {title}
        </Typography>
        <div className={classes.cardContent}>
        {parse(content)}
        </div>
        </CardContent>
        </CardActionArea>
        <Typography gutterBottom variant="caption" component="p" className={classes.updatedDate}>
        <b>{dairyDate}</b>
        </Typography>
        <CardActions>
        <Button size="small" color="primary" disabled>
            Share
        </Button>
        <Button size="medium" color="primary" onClick={()=>setUpdatePage(!updatePage)}>
            Edit
        </Button>
        </CardActions>
        </Card>
        </Grid>
        {
          updatePage ? 
          <UpdateDiaryPage 
          title={title}
          image={image}
          id={id}
          content = {content}
          modalState = {updatePage}
          key={updatePage}
          date={date}
          />
        : <UpdateDiaryPage 
        title={title}
        image={image}
        id={id}
        content = {content}
        modalState ={updatePage}
        key={updatePage}
        date={date}
        />
      }
        </>
    )

    
}