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
        I am a Berlin-based Typescript full-stack software engineer. Dabbling in
        python.
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
            'I enjoy working in fullstack Javascript, ideally Typescript. Expanding into python.'
          }
          techItems={['typescript', 'javascript', 'python']}
        />
        <TechCard
          title="Cloud"
          comment={
            'I started in AWS land and was intrigued by serverless patterns. I then worked with GCP and Kubernetes. I run towards yaml files.'
          }
          techItems={['aws', 'k8s', 'cloudformation', 'lambda']}
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
            'React/React Native fan. Worked extensively with Next the last few years. Enjoyed styling with tailwind, Emotion, css-in-js and Material UI.'
          }
          techItems={['react', 'next']}
          png={'emotion'}
        />
        <TechCard
          title="Analytics/Monitoring"
          comment={
            'Good decisions start with clear measurement and monitoring, which is a qualitative and quantitative process. I enjoy this from both an operational and product perspective.'
          }
          techItems={['datadog', 'amplitude', 'grafana']}
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
