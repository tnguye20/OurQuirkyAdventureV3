import React, { useState, useEffect } from 'react';
import { useAuthValue } from '../../contexts';
import { db } from '../../utils/firebase';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  Chip
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const SelectionModal = ({
    isSingular,
    selectedFile,
    isUploading,
    info,
    setInfo,
    collections,
    selection,
    resetSelection,
    open,
    handleClose,
}) => {
    const { authUser } = useAuthValue();
    const { uid } = authUser;
    const [ value, setValue ] = useState([]);

    useEffect( () => {
      if(isSingular && info[selectedFile] !== undefined){
        setValue(info[selectedFile].tags);
      }
    }, [info, selectedFile, isSingular]);

    const addToCollection = () => {
      const tmpInfo = {...info};

      if(isSingular === true){
        if(tmpInfo[selectedFile] !== undefined){
          tmpInfo[selectedFile].tags = [ ...value];
        }
      } else {
        Object.entries(selection).forEach((entry) => {
          const [k, v] = entry;
          const { select } = v;
          if (select === true && tmpInfo[k]) {
            tmpInfo[k].tags = [...tmpInfo[k].tags, ...value];
          }
        });
      }

      const newTags = value.filter( v => {
        return collections.indexOf(v) === -1;
      });
      if(newTags.length > 0){
        db.collection("users").doc(uid).update({
          collections: [
            ...collections,
            ...newTags
          ]
        }).then( () => {
          setInfo(tmpInfo);
          setValue([]);
          resetSelection();
          handleClose();
        })
      } else {
        setInfo(tmpInfo);
        setValue([]);
        resetSelection();
        handleClose();
      }
    }

    return(
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
        <DialogTitle id="form-dialog-title">Tagging</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Choose from existing collections or create new ones
            </DialogContentText>

            <Autocomplete
                multiple
                freeSolo
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
                renderInput={(params) => <TextField {...params} label="Existing Collections" variant="outlined" />}
            />
        </DialogContent>
        <DialogActions>
        <Button disabled={isUploading} onClick={handleClose} color="secondary" variant="outlined" size="small">
            Cancel
        </Button>
        <Button disabled={isUploading || value.length === 0} onClick={addToCollection} color="primary" variant="outlined" size="small">
            Add to collection
        </Button>
        </DialogActions>
    </Dialog>
    )
}
