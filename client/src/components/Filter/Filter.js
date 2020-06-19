import React, { useState, useEffect } from 'react';
import { useMemoriesValue ,useUserValue } from '../../contexts';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Chip,
  Grid,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const Filter = ({
    open,
    handleClose,
    filterCriteria,
    setFilterCriteria
}) => {
    const { cities, states, takenMonths, takenYears } = useMemoriesValue();
    // const tmpMem = { ...memories };
    const { user } = useUserValue();
    const { collections } = user;

    const [ value, setValue ] = useState([]);
    const [ cValue, setCValue ] = useState([]);
    const [ sValue, setSValue ] = useState([]);
    const [ mValue, setMValue ] = useState([]);
    const [ yValue, setYValue ] = useState([]);

    useEffect( () => {
      if(filterCriteria.size === 0){
          setValue([]);
          setCValue([]);
          setSValue([]);
          setMValue([]);
          setYValue([]);
      } else {
        if ( filterCriteria.has("tags") ) setValue(filterCriteria.get("tags"));
        if ( filterCriteria.has("city") ) setCValue(filterCriteria.get("city"));
        if ( filterCriteria.has("state") ) setSValue(filterCriteria.get("state"));
        if ( filterCriteria.has("takenMonth") ) setMValue(filterCriteria.get("takenMonth"));
        if ( filterCriteria.has("takenYear") ) setYValue(filterCriteria.get("takenYear"));
      }
    },[filterCriteria])

    const aggregateFilters = () => {
        const filters = new Map();
        if (value.length > 0){
            filters.set("tags", value);
        }
        if (cValue.length > 0){
            filters.set("city", cValue);
        }
        if (sValue.length > 0){
            filters.set("state", sValue);
        }
        if (mValue.length > 0){
            filters.set("takenMonth", mValue);
        }
        if (yValue.length > 0){
            filters.set("takenYear", yValue);
        }
        setFilterCriteria(filters);
        handleClose();
    }

    return(
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Filter</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Filter your memories based on Tags
            </DialogContentText>

            <Autocomplete
                multiple
                value={value}
                onChange={ (e, newValue) => {
                    setValue([...newValue]);
                }}
                id="collectionsSelect"
                options={collections.map( item => item )}
                style={{ width: "100%" }}
                renderTags={
                    (value, getTagProps) =>
                        value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => <TextField {...params} label="Existing Tags" variant="outlined" />}
            />
            <br />
            <Grid container spacing={2} direction="row">
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                    multiple
                    value={cValue}
                    onChange={ (e, newValue) => {
                        setCValue([...newValue]);
                    }}
                    id="citiesSelect"
                    options={cities.map( item => item )}
                    style={{ width: "100%" }}
                    renderTags={
                        (value, getTagProps) =>
                            cValue.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="Cities" variant="outlined" />}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                  <Autocomplete
                      multiple
                      value={sValue}
                      onChange={ (e, newValue) => {
                          setSValue([...newValue]);
                      }}
                      id="statesSelect"
                      options={states.map( item => item )}
                      style={{ width: "100%" }}
                      renderTags={
                          (value, getTagProps) =>
                              sValue.map((option, index) => (
                              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                          ))
                      }
                      renderInput={(params) => <TextField {...params} label="States" variant="outlined" />}
                  />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2} direction="row">
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                    multiple
                    value={mValue}
                    onChange={ (e, newValue) => {
                        setMValue([...newValue]);
                    }}
                    id="takenMonthsSelect"
                    options={takenMonths.map( item => `${item}` )}
                    style={{ width: "100%" }}
                    renderTags={
                        (value, getTagProps) =>
                            mValue.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="Month(s) Taken" variant="outlined" />}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                    multiple
                    value={yValue}
                    onChange={ (e, newValue) => {
                        setYValue([...newValue]);
                    }}
                    id="takenYearsSelect"
                    options={takenYears.map( item => `${item}` )}
                    style={{ width: "100%" }}
                    renderTags={
                        (value, getTagProps) =>
                            yValue.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => <TextField {...params} label="Year(s) Taken" variant="outlined" />}
                />
              </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined" size="small">
            Cancel
        </Button>
        <Button 
            disabled={
                value.length === 0  &&
                cValue.length === 0 &&
                sValue.length === 0 &&
                mValue.length === 0 &&
                yValue.length === 0
            } 
            onClick={aggregateFilters} 
            color="primary"
            variant="outlined"
            size="small"
        >
            Filter Memories
        </Button>
        </DialogActions>
    </Dialog>
    )
}
