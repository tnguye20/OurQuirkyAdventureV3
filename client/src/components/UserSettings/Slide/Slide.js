import React, { useState } from 'react';
import { db } from '../../../utils/firebase';
import {
  Collapse,
  TextField,
  makeStyles,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import * as ALERT_TYPES from '../../../constants/alerts';

const useStyles = makeStyles((theme) => ({
}));

export const Slide = ( { user } ) => {
  const classes = useStyles();

  const [ alertOpen, setAlertOpen ] = useState(false);
  const [ alertType, setAlertType ] = useState(ALERT_TYPES.ALERT_SUCCESS);
  const [ alertMsg, setAlertMsg ] = useState(ALERT_TYPES.ALERT_SUCCESS_SLIDE_MSG);

  const [ interval, setInterval ] = useState(user.interval === undefined ? 5 : user.interval / 1000);
  const [ animation, setAnimation ] = useState(user.animation === undefined ? "random" : user.animation);

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      const _user = {
        interval: Number(interval) * 1000,
        animation,
      }
      console.log(_user);
      await db.collection("users").doc(user.id).update(_user);
      setAlertType(ALERT_TYPES.ALERT_SUCCESS);
      setAlertOpen(true);
    } catch (error) {
      switch(error.type){
        default: setAlertMsg("Internal Error. Please Check Back Later");
      }
      setAlertType(ALERT_TYPES.ALERT_ERROR);
      setAlertOpen(true);
      console.log(error);
    }
  }

  return (
    <>
      <Collapse in={alertOpen}>
        <Alert
          severity={alertType}
          onClose={() => setAlertOpen(false)}
        >
          { alertMsg }
        </Alert>
        <br />
      </Collapse>

      <h3>Slide Settings</h3>
      <br/>
      <form autoComplete="off" onSubmit={handleUpdate}>
        <FormControl variant="outlined" style={{ width: "100%" }}>
            <InputLabel htmlFor="outlined-interval-native-simple">Slide Interval (seconds)</InputLabel>
            <Select
              label="Slide Interval (seconds)"
              native
              value={interval}
              onChange={ e => setInterval(e.target.value) }
              fullWidth
              variant="outlined"
              inputProps={{
                name: 'interval',
                id: 'outlined-interval-native-simple',
              }}
            >
              {
                [1,2,3,4,5,6,7,8,9,10].map( (i) => (
                  <option key={i} value={i}>{i}</option>
                ))
              }
            </Select>
        </FormControl>
        <br />
        <br />
        <FormControl variant="outlined" style={{ width: "100%" }}>
            <InputLabel htmlFor="outlined-animation-native-simple">Animation</InputLabel>
            <Select
              label="Animation"
              native
              value={animation}
              onChange={ e => setAnimation(e.target.value) }
              fullWidth
              variant="outlined"
              inputProps={{
                name: 'animation',
                id: 'outlined-animation-native-simple',
                size: 1,
                maxLength: 1,
                length: 1
              }}
            >
              <option value="random">Random</option>
              <option value="fallAnimation">Fall</option>
              <option value="foldOutAnimation">Fold Out</option>
              <option value="openAnimation">Open</option>
              <option value="cubeAnimation">Cube</option>
              <option value="scaleOutAnimation">Scale Out</option>
            </Select>
        </FormControl>
        <br />
        <br />
        <Button
            color="primary"
            variant="contained"
            type="submit"
        >
            Update
        </Button>
      </form>
    </>
  )
}
