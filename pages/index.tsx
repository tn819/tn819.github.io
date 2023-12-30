import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { Box, Button, Grid, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { openPopupWidget } from 'react-calendly'

import { Page, Spacer, TechCard } from '../src/components'

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
      <Grid container spacing={5}>
        <TechCard
          title="Code"
          comment={
            'I enjoy working in fullstack Javascript, ideally Typescript'
          }
          techItems={['typescript', 'javascript']}
        />
        <TechCard
          title="Cloud"
          comment={
            'I am an AWS Certified Developer, intrigued by serverless patterns. I have also worked with GCP and Kubernetes.'
          }
          techItems={['aws', 'cloudformation', 'lambda']}
        />
        <TechCard
          title="Back-end"
          comment={
            'I have set up scaleable APIs in Node using express, nest, fastify and different types of persistence.'
          }
          techItems={['node', 'nest', 'fastify', 'postgres']}
        />
        <TechCard
          title="Testing"
          comment={
            'I value confidence in code via robust e2e, integration, and unit testing. Tests are always the first thing I read in a new project/repo.'
          }
          techItems={['cypress', 'jest', 'testing-library', 'playwright']}
        />
        <TechCard
          title="Front-end"
          comment={
            'React/React Native fan. Worked with Next. Enjoy styling with Emotion, css-in-js and Material UI, but open to new patterns.'
          }
          techItems={['react', 'next']}
          png={'emotion'}
        />
        <TechCard
          title="Analytics/Monitoring"
          comment={
            'Good decisions start with clear measurement and monitoring, which is a qualitative and quantitative process.'
          }
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
    </Page>
  )
}

export default Home
