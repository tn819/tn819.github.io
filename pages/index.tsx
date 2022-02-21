import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { Box, Button, Grid, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { openPopupWidget } from 'react-calendly'

import { Copyright, Page, Spacer, TechCard } from '../src/components'

const Home: NextPage = () => {
  const handleCalendlyClick = () =>
    openPopupWidget({
      url: 'https://calendly.com/thomasneil819/friends',
    })

  return (
    <Page title="Thomas Neil">
      <Typography variant="h6" gutterBottom>
        I am a Berlin-based Javascript and Typescript full-stack software
        engineer.
      </Typography>
      <Typography variant="h6" gutterBottom>
        {`I am passionate about coding teamwork and collaboration, as well as
        listening deeply to users and improving people's lives.`}
      </Typography>
      <Spacer size={10} />
      <Grid container spacing={10}>
        <TechCard
          title="Code"
          comment={
            'I enjoy working in fullstack Javascript, ideally Typescript'
          }
          techItems={['typescript', 'javascript']}
        />
        <TechCard
          title="AWS"
          comment={
            'I am an AWS Certified Developer, intrigued by serverless patterns'
          }
          techItems={['aws', 'cloudformation', 'lambda', 'aws-sns']}
        />
        <TechCard
          title="Back-end"
          comment={
            'I have set up scaleable APIs in Node with different types of persistence'
          }
          techItems={['node', 'nest', 'postgres']}
        />
        <TechCard
          title="Testing"
          comment={
            'I value confidence in code via robust e2e, integration, and unit testing'
          }
          techItems={['cypress', 'jest', 'testing-library']}
        />
        <TechCard
          title="Front-end"
          comment={'React/React Native fan, styling with Emotion and css-in-js'}
          techItems={['react']}
          png={'emotion'}
        />
        <TechCard
          title="Analytics/Monitoring"
          comment={'Good decisions start with clear measurement and monitoring'}
          techItems={['datadog', 'amplitude']}
          png={'splunk'}
        />
      </Grid>
      <Spacer size={10} />
      <Box maxWidth="sm">
        <Button
          variant="contained"
          onClick={handleCalendlyClick}
          endIcon={<CalendarTodayIcon />}
        >
          Schedule a chat
        </Button>
      </Box>
      <Spacer size={10} />

      <Copyright />
    </Page>
  )
}

export default Home
