import { Paper, Grid } from '@mui/material'

const Column: React.FC<{ width: number; center?: boolean }> = ({
  children,
  center = true,
  width,
}) => {
  return (
    <Grid item xs={width}>
      <Paper
        sx={{
          height: '100%',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: center ? 'center' : 'flex-start',
          alignItems: center ? 'center' : 'flex-start',
        }}
      >
        {children}
      </Paper>
    </Grid>
  )
}

export default Column
