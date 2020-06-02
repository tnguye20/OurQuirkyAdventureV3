import React from 'react';
import { useMemoriesValue } from '../../contexts';

import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography
  // CardActions,
} from '@material-ui/core';

export const GridMode = () => {
  const { memories } = useMemoriesValue();
  return (
    <Container maxWidth="md">
      <br /><br />
      <Grid container spacing={2} direction="row">
        {
          memories.length > 0 ? memories.map( (item, index) => {
            const { url, title } = item;
            return (
              <Grid key={index} item sm={4} xs={12}>
                <Card>
                  <CardMedia
                    component="img"
                    alt=""
                    image={url}
                    title=""
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                      { title }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          }) : "Loading..."
        }
      </Grid>
    </Container>
  )
};
