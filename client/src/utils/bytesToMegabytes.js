export const bytesToMegabytes = ( bytes, digits=-1 ) => (
  ( !Number.isNaN(bytes) && !Number.isNaN(digits) ) ?
    (digits === -1 ? bytes / (1024*1024) :
     (bytes / (1024*1024)).toFixed(digits) ) :
  0
);
