import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import SettingsIcon from '@material-ui/icons/Settings';
import './Header.css';

import * as ROUTES from '../../constants/routes';

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
  const { setOpenFilter, filterCriteria, setFilterCriteria } = useFilterValue();
  const [ open, setOpen ] = useState(false);

  const handleSignOut = (e) => {
    e.preventDefault();
    history.push("/signout");
  }

  const MenuList = () => (
    <div className={ classes.list }>
      <List>
        <ListItem button onClick={ e => { setOpen(false); history.push(ROUTES.UPLOAD)  } }>
          <ListItemIcon><CloudUploadIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItem>

        <Divider />
        <ListItem button onClick={ e => { setOpen(false); history.push(ROUTES.SLIDE)  } }>
          <ListItemIcon><PhotoAlbumIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Slideshow" />
        </ListItem>

        <Divider />
        <ListItem button onClick={ e => { setOpen(false); history.push(ROUTES.GRID)  } }>
          <ListItemIcon><AppsIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Grid Mode" />
        </ListItem>

        <Divider />
        <ListItem button onClick={ () => { setOpenFilter(true); setOpen(false) } }>
          <ListItemIcon><FilterIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Filter Memories" />
        </ListItem>
        {
         filterCriteria.size > 0 ? (
           <ListItem button className="subItem" onClick={ () => {
             setOpen(false);
             setFilterCriteria(new Map());
           } }>
            <ListItemIcon><ClearAllIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Reset Filters" />
          </ListItem>
         ) : ""
        }

        <Divider/>
        <ListItem button onClick={ e => { setOpen(false); history.push(ROUTES.USER_SETTINGS) } }>
          <ListItemIcon><SettingsIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="User Settings" />
        </ListItem>

        <Divider/>
        <ListItem button onClick={handleSignOut}>
          <ListItemIcon><ExitToAppIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>

        <Divider/>

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
