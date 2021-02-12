import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Chip,
  Grid
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useUserValue } from '../../contexts';
import { nullReplace } from '../../utils';

// import moment from 'moment';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export const MemoryTitleEdit = ({
  open,
  handleClose,
  item,
  handleEditMemory,
}) => {
  const [ title, setTitle ] = useState(nullReplace(item.title));
  const [ tags, setTags ] = useState(nullReplace(item.tags));
  const [ city, setCity ] = useState(nullReplace(item.city));
  const [ neighbourhood, setNeighbourhood ] = useState(nullReplace(item.neighbourhood));
  const [ state, setState ] = useState(nullReplace(item.state));
  const [ country, setCountry ] = useState(nullReplace(item.country));
  const [ zipcode, setZipcode ] = useState(nullReplace(item.zipcode));
  const [ takenDate, setTakenDate ] = useState(new Date(item.takenDate));
  const resetInputs = useState(0)[1];

  const { user } = useUserValue();
  const { collections } = user;

  useEffect( () => {
    setTitle(nullReplace(item.title));
    setTags(nullReplace(item.tags));
    setCity(nullReplace(item.city));
    setNeighbourhood(nullReplace(item.neighbourhood));
    setState(nullReplace(item.state));
    setCountry(nullReplace(item.country));
    setZipcode(nullReplace(item.zipcode));
    setTakenDate(new Date(item.takenDate));
  }, [item]);

  const getUpdatedInfo = () =>  ({
    title,
    tags,
    city,
    neighbourhood,
    state,
    country,
    zipcode,
    takenDate: takenDate.toISOString(),
  })

  return(
    <Dialog open={open} onClose={ () => { resetInputs(1); handleClose(); } } aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit Memory Title</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Feel free to be as descriptive as possible.
        </DialogContentText>
        <TextField
          autoFocus
          onFocus={e => e.target.select()}
          onChange={e => setTitle(e.target.value)}
          margin="dense"
          id="title"
          label="Title"
          fullWidth
          value={title}
        />
        <TextField
          onChange={e => setNeighbourhood(e.target.value)}
          margin="dense"
          id="neighbourhood"
          label="Neighbourhood/Location"
          fullWidth
          value={neighbourhood}
        />
        <TextField
          onChange={e => setCity(e.target.value)}
          margin="dense"
          id="city"
          label="City"
          fullWidth
          value={city}
        />
        <TextField
          onChange={e => setState(e.target.value)}
          margin="dense"
          id="state"
          label="State"
          fullWidth
          value={state}
        />
        <TextField
          onChange={e => setCountry(e.target.value)}
          margin="dense"
          id="country"
          label="Country"
          fullWidth
          value={country}
        />
        <TextField
          onChange={e => setZipcode(e.target.value)}
          margin="dense"
          id="zipcode"
          label="Zip Code"
          fullWidth
          value={zipcode}
        />
        <Grid container justify="space-around">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="MM/dd/yyyy"
              value={takenDate}
              onChange={date => setTakenDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              fullWidth
              margin="normal"
              id="time-picker"
              label="Time picker"
              value={takenDate}
              onChange={time => setTakenDate(time)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
        </MuiPickersUtilsProvider>
        </Grid>
        <Autocomplete
            multiple
            freeSolo
            value={tags}
            onChange={ (e, newValue) => {
                console.log(newValue);
                setTags([...newValue]);
            }}
            id="tags"
            options={collections.map( item => item )}
            style={{ width: "100%" }}
            renderTags={
                (value, getTagProps) =>
                    value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                ))
            }
            renderInput={(params) => <TextField {...params} label="Tags"/>}
        />
    </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined" size="small">
          Cancel
        </Button>
        <Button onClick={ (e) => {handleEditMemory(e, getUpdatedInfo())} } color="primary" variant="outlined" size="small">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
