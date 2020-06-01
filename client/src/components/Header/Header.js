import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  Button,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import MenuIcon from '@material-ui/icons/Menu';
import './Header.css';

const useStyles = makeStyles(theme => ({
  root: {
      flexGrow: 1,
    },
  title: {
      flexGrow: 1,
    },
  list: {
    width: 250
  },
  paper: {
    color: "white",
    background: "rgba(29, 32, 33, 0.5)"
  }
}));

export const Header = () => {
  const history = useHistory();
  const classes = useStyles();
  const [ open, setOpen ] = useState(false);

  const handleSignOut = (e) => {
    e.preventDefault();
    history.push("/signout");
  }

  const MenuList = () => (
    <div className={ classes.list }>
      <List>
        <ListItem button onClick={ e => { setOpen(false); history.push("/upload")  } }>
          <ListItemIcon><CloudUploadIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItem>
        <Divider />
        <ListItem button onClick={ e => { setOpen(false); history.push("/")  } }>
          <ListItemIcon><PhotoAlbumIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Slideshow" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleSignOut}>
          <ListItemIcon><ExitToAppIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </List>
    </div>
  )

  return (
    <div id="header">
      <Button onClick={e => setOpen(true)}>
        <MenuIcon htmlColor={"white"}/>
      </Button>
      <Drawer open={open} onClose={ e => setOpen(false)} classes={{ paper: classes.paper }}>
        { MenuList() }
      </Drawer>
    </div>
  );
}
