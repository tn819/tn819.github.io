import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  Grid,
  Typography,
} from '@mui/material'
import type { NextPage } from 'next'
import Image from 'next/image'

import { Copyright, Link, Page, Spacer } from '../src/components'

const TechAvatarGroup = ({
  techItems,
  png,
}: {
  techItems: string[]
  png?: string
}) => {
  return (
    <AvatarGroup>
      {techItems.map((tech) => (
        <Avatar key={tech} sx={{ width: 56, height: 56 }}>
          <Image
            src={`/images/tech/${tech}.svg`}
            alt={tech}
            height={40}
            width={40}
          />
        </Avatar>
      ))}
      {png ? (
        <Avatar key={png} sx={{ width: 56, height: 56 }}>
          <Image
            src={`/images/tech/${png}.png`}
            alt={png}
            height={40}
            width={40}
          />
        </Avatar>
      ) : undefined}
    </AvatarGroup>
  )
}

const Home: NextPage = () => {
  return (
    <Page title="Thomas Neil">
      <Typography variant="h6" gutterBottom>
        I am a Berlin-based Javascript and Typescript full-stack software
        engineer.
      </Typography>
      <Typography variant="h6" gutterBottom>
        I am passionate about coding teamwork and collaboration, as well as
        listening to users and solving problems.
      </Typography>
      <Spacer size={10} />
      <Grid container spacing={10}>
        <Grid item xs={4}>
          <Card
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Code
            </Typography>
            <TechAvatarGroup techItems={['typescript', 'javascript']} />
            <Spacer size={5} />
            <Typography variant="h6">
              I enjoy working in fullstack Javascript, ideally Typescript
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex' }}>
          <Card
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h5" gutterBottom>
              AWS
            </Typography>
            <TechAvatarGroup
              techItems={['aws', 'cloudformation', 'lambda', 'aws-sns']}
            />
            <Spacer size={5} />
            <Typography variant="h6">
              I am an AWS Certified Developer, intrigued by serverless patterns
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex' }}>
          <Card
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Back-end
            </Typography>
            <TechAvatarGroup techItems={['node', 'nest', 'postgres']} />
            <Spacer size={5} />
            <Typography variant="h6">
              I have set up scaleable APIs in Node with different types of
              persistence
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex' }}>
          <Card
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Testing{' '}
            </Typography>
            <TechAvatarGroup
              techItems={['cypress', 'jest', 'testing-library']}
            />
            <Spacer size={5} />
            <Typography variant="h6">
              I value confidence in code via robust e2e, integration, and unit
              testing
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex' }}>
          <Card
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Front-end
            </Typography>
            <TechAvatarGroup techItems={['react']} png={'emotion'} />
            <Spacer size={5} />
            <Typography variant="h6">
              React/React Native acolyte, leaning towards Emotion and css-in-js
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex' }}>
          <Card
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Analytics/Monitoring
            </Typography>
            <TechAvatarGroup
              techItems={['datadog', 'amplitude']}
              png={'splunk'}
            />
            <Spacer size={5} />
            <Typography variant="h6">
              Good decisions start with clear measurement and monitoring
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <Spacer size={10} />
      <Box maxWidth="sm">
        <Button variant="contained" component={Link} noLinkStyle href="/about">
          Go to the about page
        </Button>
      </Box>
      <Copyright />
    </Page>
  )
}

export default Home
