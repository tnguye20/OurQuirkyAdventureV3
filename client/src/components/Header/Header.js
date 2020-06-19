import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useFilterValue } from '../../contexts';
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
import ClearAllIcon from '@material-ui/icons/ClearAll';
import AppsIcon from '@material-ui/icons/Apps';
import MenuIcon from '@material-ui/icons/Menu';
import FilterIcon from '@material-ui/icons/Filter';
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
  const location = useLocation();
  const { pathname } = location;
  const classes = useStyles();
  const { setOpenFilter, filterCriteria, setFilterCriteria } = useFilterValue();
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
        <ListItem button onClick={ e => { setOpen(false); history.push("/slide")  } }>
          <ListItemIcon><PhotoAlbumIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Slideshow" />
        </ListItem>
        {
          pathname !== "/upload" && pathname !== "/grid" ? (
            <>
              <ListItem button className="subItem" onClick={ () => { setOpenFilter(true); setOpen(false) } }>
                <ListItemIcon><FilterIcon htmlColor={"white"}/></ListItemIcon>
                <ListItemText primary="Filter Memories" />
              </ListItem>
              {
               filterCriteria.size > 0 ? (
                <ListItem button className="subItem" onClick={ () => { setFilterCriteria(new Map()); setOpen(false) } }>
                  <ListItemIcon><ClearAllIcon htmlColor={"white"}/></ListItemIcon>
                  <ListItemText primary="Reset Filters" />
                </ListItem>
               ) : ""
              }
            </>
          ) : ""
        }
        <Divider />
        <ListItem button onClick={ e => { setOpen(false); history.push("/grid")  } }>
          <ListItemIcon><AppsIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Grid Mode" />
        </ListItem>
        {
          pathname !== "/upload" && pathname !== "/slide" && pathname !== "/" ? (
            <>
              <ListItem button className="subItem" onClick={ () => { setOpenFilter(true); setOpen(false) } }>
                <ListItemIcon><FilterIcon htmlColor={"white"}/></ListItemIcon>
                <ListItemText primary="Filter Memories" />
              </ListItem>
              {
               filterCriteria.size > 0 ? (
                <ListItem button className="subItem" onClick={ () => { setFilterCriteria(new Map()); setOpen(false) } }>
                  <ListItemIcon><ClearAllIcon htmlColor={"white"}/></ListItemIcon>
                  <ListItemText primary="Reset Filters" />
                </ListItem>
               ) : ""
              }
            </>
          ) : ""
        }
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
