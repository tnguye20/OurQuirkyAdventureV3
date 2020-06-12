import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  TextField
} from '@material-ui/core';

export const MemoryTitleEdit = ({
  open,
  handleClose,
  title,
  setTitle,
  handleEditTitle
}) => {

  return(
   <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
          label="Memory Title"
          fullWidth
          value={title}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined" size="small">
          Cancel
        </Button>
        <Button onClick={ handleEditTitle } color="primary" variant="outlined" size="small">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
