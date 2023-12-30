import { SchoolOutlined } from '@mui/icons-material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import ForestIcon from '@mui/icons-material/Forest'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import { Timeline } from '@mui/lab'
import type { NextPage } from 'next'

import { Page, TimelineItemWithIcon, TimelineBullet } from '../src/components'

export const TimelineBullets: TimelineBullet[] = [
  {
    title: 'Childhood',
    detail: `I grew up across the USA. I went to high school in the unique and
diverse city of Shaker Heights, Ohio near Cleveland and then left to
attend an international boarding school in New Mexico at the United
World College.`,
    icon: () => <HomeIcon />,
  },
  {
    title: 'Education',
    detail: `I studied at Grinnell College in Iowa. I
majored in Political Science with coursework in Arabic, German, and
Statistics, graduating Phi Beta Kappa.`,
    icon: () => <SchoolOutlined />,
  },
  {
    title: 'Early career',
    detail: `I started out at the Morningstar Development Program and transitioned into a
    technical solutions role at an AI startup in Chicago,
    Narrative Science. Although I gained financial literacy, client relation and technical skills, I still felt the
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
    a year to immerse fully in coding and make a transition to
    being a full-time web developer.`,
    icon: () => <FlightTakeoffIcon />,
  },
  {
    title: 'Fintech',
    detail: `I've held a couple different full stack roles at first working for BCG Platinion Design & Engineering team and then moving to Klarna. At Klarna, I was the second dev on the team that built our first live banking product, the Savings Account. I was promoted to Senior and had the change to work on our launches in Sweden and Germany, becoming one of both countries' leading savings products. I also worked on a team supporting the Klarna Card.`,
    icon: () => <AccountBalanceIcon />,
  },
  {
    title: 'Climate Tech',
    detail: `I had the chance to be the founding engineer at Blue Layer, building an operating system for developers in the carbon markets. With involvement from the first days of our engineering team, I had the chance to support building basic infra and many features in our app along with services to attract and support our first customers.`,
    icon: () => <ForestIcon />,
  },
  {
    title: 'Today',
    detail: `I am now exploring a new domain as part of a small full-stack team at DeepL supporting our Research team, where my job will be building apps that enable new inputs to improve our best-in-class translation models`,
    icon: () => <SmartToyOutlinedIcon />,
  },
]

const About: NextPage = () => {
  return (
    <Page title="Thomas Neil">
      <Timeline position="alternate">
        {TimelineBullets.concat(...PersonalBullets)
          .reverse()
          .map((bullet) => (
            <TimelineItemWithIcon key={bullet.title} bullet={bullet} />
          ))}
      </Timeline>
    </Page>
  )
}

export default About
