import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import HomeIcon from '@mui/icons-material/Home'
import LaptopIcon from '@mui/icons-material/Laptop'
import PeopleIcon from '@mui/icons-material/People'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import { Timeline } from '@mui/lab'
import { Grid } from '@mui/material'
import type { NextPage } from 'next'

import {
  Column,
  Copyright,
  Page,
  Pic,
  Spacer,
  TimelineItemWithIcon,
  TimelineBullet,
} from '../src/components'

export const TimelineBullets: TimelineBullet[] = [
  {
    title: 'Education',
    detail: `I grew up across the USA. I went to high school in the unique and
diverse city of Shaker Heights, Ohio near Cleveland and then left to
attend an international boarding school in New Mexico at the United
World College. Afterwards, I studied at Grinnell College in Iowa. I
majored in Political Science with coursework in Arabic, German, and
Statistics, graduating Phi Beta Kappa.`,
    icon: () => <HomeIcon />,
  },
  {
    title: 'Early career',
    detail: `I started out at the Morningstar Development Program, gaining
    exposure to the investment industry. I transitioned into a
    technical solutions role at an AI startup in Chicago,
    Narrative Science. Working with a range of partners from
    startups to Fortune 100 financial institutions, I developed
    and deployed Natural Language Generation systems. I still felt the
    urge to build and move Above the API.`,
    icon: () => <WorkOutlineIcon />,
  },
]
export const PersonalBullets: TimelineBullet[] = [
  {
    title: 'On the side',
    detail: `While in Chicago, I founded an events/activations company called
    the Mobocratic Republic aka the Mob Rep. Starting from elaborate
    pop-up cook-outs, we grew to throwing 30-600 person
    cultural events with brands like Cresco
    Labs, Moet-Hennessy and Lululemon. It was an unforgettable
    series of experiences to organize, with bonds that
    last to this day.`,
    icon: () => <PeopleIcon />,
  },
  {
    title: 'Berlin',
    detail: `I followed my growing passion towards fintech and coding to a
    bootcamp in Berlin, where my grandmother was from and a city I had
    been drawn to due to its progressive and open stance. I gave myself
    6-12 months to immerse fully in coding and make a transition to
    being a full-time web developer.`,
    icon: () => <FlightTakeoffIcon />,
  },
  {
    title: 'Dev life',
    detail: `I've held a couple different roles as a Full-stack dev first working for BCG Platinion Design & Engineering team and then moving to Klarna. At Klarna, I was the second dev on the team that built our first live banking product, the Savings Account.`,
    icon: () => <LaptopIcon />,
  },
]

const About: NextPage = () => {
  return (
    <Page title="Thomas Neil">
      <Grid container spacing={4} width="100%">
        <Column width={3}>
          <Pic src="/images/pic.jpg" alt="thomas-pic" />
        </Column>
        <Column width={9}>
          <Timeline position="alternate">
            {TimelineBullets.map((bullet) => (
              <TimelineItemWithIcon key={bullet.title} bullet={bullet} />
            ))}
          </Timeline>
        </Column>
      </Grid>
      <Spacer size={10} />
      <Grid container spacing={4} width="100%">
        <Column width={8}>
          <Timeline position="alternate">
            {PersonalBullets.map((bullet) => (
              <TimelineItemWithIcon key={bullet.title} bullet={bullet} />
            ))}
          </Timeline>
        </Column>
        <Column width={4} center={false}>
          <Pic src="/images/mob-rep.jpg" alt="thomas-pic" />
        </Column>
      </Grid>
      <Spacer size={8} />
      <Copyright />
    </Page>
  )
}

export default About
