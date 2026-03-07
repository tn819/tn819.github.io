import { Page } from '../src/components'
import {
  InteractiveTimeline,
  TimelineItemData,
} from '../src/components/InteractiveTimeline'

import type { NextPage } from 'next'

const timelineItems: TimelineItemData[] = [
  {
    id: 'childhood',
    title: 'Nomadic Beginnings',
    detail: `I grew up across the USA — Ohio, Oregon, Michigan, Massachusetts, Ohio again, New Mexico, Iowa, Illinois, Texas. I went to high school in the unique and diverse city of Shaker Heights, Ohio near Cleveland and then left to attend an international boarding school in New Mexico at the United World College. I didn't get to adjust myself to a bed or apartment for more than a couple years until after 30.`,
    iconType: 'us-map',
    color: '#FF6B6B',
  },
  {
    id: 'education',
    title: 'Grinnell College',
    detail: `I studied at Grinnell College in Iowa. I majored in Political Science with coursework in Arabic, German, and Statistics, graduating Phi Beta Kappa.`,
    iconType: 'books',
    color: '#4ECDC4',
  },
  {
    id: 'early-career',
    title: 'Morningstar & Narrative Science',
    detail: `I started out at the Morningstar Development Program and transitioned into a technical solutions role at an AI startup in Chicago, Narrative Science. Although I gained financial literacy, client relation and technical skills, I still felt the urge to build and move Above the API.`,
    iconType: 'laptop',
    color: '#45B7D1',
  },
  {
    id: 'mob-rep',
    title: 'The Mobocratic Republic',
    detail: `While in Chicago, I founded an events/activations company called the Mobocratic Republic aka the Mob Rep. Starting from elaborate pop-up cook-outs, we grew to throwing 30-600 person cultural events with brands like Cresco Labs, Moet-Hennessy and Lululemon. It was an unforgettable series of experiences to organize, with bonds that last to this day.`,
    imageUrl: '/images/mob-rep.jpg',
    color: '#96CEB4',
  },
  {
    id: 'berlin',
    title: 'Berlin Bound',
    detail: `I followed my growing passion towards fintech and coding to a bootcamp in Berlin, where my grandmother was from and a city I had been drawn to due to its progressive and open stance. I gave myself a year to immerse fully in coding and make a transition to being a full-time web developer.`,
    imageUrl: '/images/timeline/berlin-arrival.jpeg',
    color: '#FFEAA7',
  },
  {
    id: 'fintech',
    title: 'BCG Platinion & Klarna',
    detail: `I've held a couple different full stack roles at first working for BCG Platinion Design & Engineering team and then moving to Klarna. At Klarna, I was the second dev on the team that built our first live banking product, the Savings Account. I was promoted to Senior and had the chance to work on our launches in Sweden and Germany, becoming one of both countries' leading savings products.`,
    imageUrl: '/images/timeline/klarna.jpeg',
    color: '#DDA0DD',
  },
  {
    id: 'climate',
    title: 'Blue Layer - Climate Tech',
    detail: `I had the chance to be the founding engineer at Blue Layer, building an operating system for developers in the carbon markets. With involvement from the first days of our engineering team, I had the chance to support building basic infra and many features in our app along with services to attract and support our first customers.`,
    imageUrl: '/images/timeline/bluelayer.jpeg',
    color: '#98D8C8',
  },
  {
    id: 'deepl',
    title: 'DeepL & AI Agents',
    detail: `I am now building a horizontal browser use agent at DeepL - an AI-powered tool that brings automation capabilities to everyone at the company. This involves designing agentic systems, building browser automation infrastructure, and creating interfaces that make AI accessible to all employees across the organization.`,
    imageUrl: '/images/timeline/deepl.jpeg',
    color: '#6366F1',
  },
]

const About: NextPage = () => {
  return (
    <Page title="Winding road through Arabic, German, software, now AI agents at DeepL in Berlin">
      <InteractiveTimeline items={[...timelineItems].reverse()} />
    </Page>
  )
}

export default About
