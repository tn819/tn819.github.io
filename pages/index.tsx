import { Paper, Stack, Typography } from '@mui/material'
import type { NextPage } from 'next'
import Image from 'next/image'

import Copyright from '../src/components/Copyright'
import Page from '../src/components/Page'
import Spacer from '../src/components/Spacer'

const Home: NextPage = () => {
  return (
    <Page title="Thomas Neil">
      <Stack direction="row" spacing={4} height={600} width="100%">
        <Paper
          sx={{
            width: '100%',
            height: '100%',
            alignContent: 'center',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image
              src="/images/pic.jpg"
              alt="thomas-pic"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </Paper>

        <Paper
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">Full-stack dev in Berlin</Typography>
          <Spacer size={4} />
          <Typography variant="body1">
            After starting my career in financial services and in a solutions
            role at an AI startup in Chicago, I followed my passion and roots
            back to
          </Typography>
        </Paper>
      </Stack>
      <Spacer size={4} />
      <Copyright />
    </Page>
  )
}

export default Home
