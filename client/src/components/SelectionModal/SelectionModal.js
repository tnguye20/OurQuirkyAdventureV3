import React, { useState } from 'react';
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
    uid,
    isUploading,
    info,
    setInfo,
    collections,
    selection,
    resetSelection,
    open,
    handleClose,
}) => {
    const [ value, setValue ] = useState([]);

    const addToCollection = () => {
        const tmpInfo = {...info};
        Object.entries(selection).forEach( entry => {
            const [k, v] = entry;
            const { select } = v;
            if (select === true) {
                tmpInfo[k].tags = [...tmpInfo[k].tags, ...value];
            }
        });

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
