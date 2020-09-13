import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useFilterValue, useUserValue } from '../../contexts';
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
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
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
  const classes = useStyles();
  const { setOpenFilter, filterCriteria, setFilterCriteria } = useFilterValue();
  const { user } = useUserValue();
  const [ open, setOpen ] = useState(false);

  const MenuList = () => (
    <div className={ classes.list }>
      <List>
        <ListItem button>
          <ListItemIcon><AccountCircleIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary={<h4><i>{user.displayName}</i></h4>} />
        </ListItem>

        <Divider />
    <NavLink to={ ROUTES.UPLOAD } activeClassName="navActive" onClick={ e => setOpen(false) }>
          <ListItem button>
            <ListItemIcon><CloudUploadIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Upload" />
          </ListItem>
        </NavLink>

        <Divider />
        <NavLink to={ ROUTES.SLIDE } activeClassName="navActive" onClick={ e => setOpen(false) } >
          <ListItem button>
            <ListItemIcon><PhotoAlbumIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Slideshow" />
          </ListItem>
        </NavLink>

        <Divider />
        <NavLink to={ ROUTES.GRID } activeClassName="navActive" onClick={ e => setOpen(false) } >
          <ListItem button>
            <ListItemIcon><AppsIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Gallery" />
          </ListItem>
        </NavLink>

        <Divider />
        <ListItem button onClick={ () => { setOpen(false); setOpenFilter(true) } }>
          <ListItemIcon><FilterIcon htmlColor={"white"}/></ListItemIcon>
          <ListItemText primary="Filter Memories" />
        </ListItem>
        {
         filterCriteria.size > 0 ? (
           <ListItem button className="subItem" onClick={ () => {
             setOpen(false);
             localStorage.removeItem("filterCriteria");
             setFilterCriteria(new Map());
           } }>
            <ListItemIcon><ClearAllIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Reset Filters" />
          </ListItem>
         ) : ""
        }

        <Divider/>
        <NavLink to={ ROUTES.USER_SETTINGS } activeClassName="navActive" onClick={ e => setOpen(false) } >
          <ListItem button>
            <ListItemIcon><SettingsIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="User Settings" />
          </ListItem>
        </NavLink>

        <Divider/>
        <NavLink to={ ROUTES.SIGNOUT }>
          <ListItem button>
            <ListItemIcon><ExitToAppIcon htmlColor={"white"}/></ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </NavLink>

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
