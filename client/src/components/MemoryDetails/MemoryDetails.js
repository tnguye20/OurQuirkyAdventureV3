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

export const MemoryDetails = ({
  isUploading,
  open,
  handleClose,
  handleAddDetails,
  currentFileName,
  title,
  comment,
  setTitle,
  setComment
}) => {

  return(
   <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">File: {currentFileName}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Feel free to be as descriptive as possible.
        </DialogContentText>
        <TextField
          autoFocus
          onChange={e => setTitle(e.target.value)}
          margin="dense"
          id="title"
          label="Memory Title"
          fullWidth
          value={title}
        />
        <TextField
          onChange={e => setComment(e.target.value)}
          margin="dense"
          id="comments"
          label="Memory First Comment"
          fullWidth
          value={comment}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isUploading} onClick={handleClose} color="secondary" variant="outlined" size="small">
          Cancel
        </Button>
        <Button disabled={isUploading} onClick={handleAddDetails} color="primary" variant="outlined" size="small">
          Add Details
        </Button>
      </DialogActions>
    </Dialog>
  )
}
