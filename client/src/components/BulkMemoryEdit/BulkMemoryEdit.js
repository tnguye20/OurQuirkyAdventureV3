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
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useUserValue } from '../../contexts';
import { isUnion, nullReplace } from '../../utils';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';

const compareDate = (date, _date) => {
  console.log(date);
  console.log(_date);
  date = new Date(date)
  _date = new Date(_date)
  const month = date.getMonth();
  const _month = _date.getMonth();
  const day = date.getDate();
  const _day = _date.getDate();
  const year = date.getFullYear();
  const _year = _date.getFullYear();

  if (month === _month && day === _day && year === _year) {
    return date;
  }
  return "";
}

const aggragateItem = ( item ) => {
    const ids = Object.keys(item);
    const values = Object.values(item);
  try {
    if(ids.length > 0){
      const reduced = values.reduce( (prev, current) => {
        return {
          city: prev.city === current.city ? prev.city : "",
          title: prev.title === current.title ? prev.title : "",
          neighbourhood: prev.neighbourhood === current.neighbourhood ? prev.neighbourhood : "",
          state: prev.state === current.state ? prev.state : "",
          country: prev.country === current.country ? prev.country : "",
          zipcode: prev.zipcode === current.zipcode ? prev.zipcode : "",
          takenDate: compareDate(prev.takenDate, current.takenDate),
          tags: isUnion(prev.tags, current.tags, true)
        }
      });
      return [ids, reduced];
    }

    return [[],{}];
  } catch (err) {
    console.log(err);
    return [[],{}];
  }
}

export const BulkMemoryEdit = ({
  open,
  handleClose,
  handleDelete,
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
  const [ ids, setIDs ] = useState([]);
  const resetInputs = useState(0)[1];

  const { user } = useUserValue();
  const { collections } = user;

  useEffect( () => {
    console.log("item", item);
    const [ ids, _item ] = aggragateItem(item);
    setIDs(ids);
    console.log("reduced", _item);
    setTitle(nullReplace(_item.title));
    setTags(nullReplace(_item.tags));
    setCity(nullReplace(_item.city));
    setNeighbourhood(nullReplace(_item.neighbourhood));
    setState(nullReplace(_item.state));
    setCountry(nullReplace(_item.country));
    setZipcode(nullReplace(_item.zipcode));
    if (_item.takenDate !== ""){
      setTakenDate(new Date(_item.takenDate));
    }
    else {
      setTakenDate(null);
    }
  }, [item]);

  const getUpdatedInfo = () =>  {
    const data = {
      title,
      tags,
      city,
      neighbourhood,
      state,
      country,
      zipcode
    }
    if ( takenDate ) data.takenDate =  takenDate.toISOString();
    Object.keys(data).forEach( key => {
      if (data[key] === "" || data[key] === null) delete data[key];
    });
    return data;
  }

  return(
    <Dialog open={open} onClose={ () => { resetInputs(1); handleClose(); } } aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Bulk Edit Memories</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Feel free to be as descriptive as possible. Common informations have been listed below.
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

    {
      takenDate !== null
      ? (
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
        {
          Object.keys(item).length === 1 ? (
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
          ) : <></>
        }
        </MuiPickersUtilsProvider>
      ) : ''
    }

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
        <Button onClick={(e) => {handleDelete(e, ids, getUpdatedInfo())}} color="secondary" variant="contained" size="small">
          Delete
        </Button>
        <Button onClick={ (e) => {handleEditMemory(e, ids, getUpdatedInfo())} } color="primary" variant="contained" size="small">
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
