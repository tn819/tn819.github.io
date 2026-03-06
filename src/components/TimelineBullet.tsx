import * as React from 'react'

import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import Typography from '@mui/material/Typography'

export interface TimelineBullet {
  title: string
  detail: string
  icon(): React.ReactElement
}

export const TimelineItemWithIcon = ({
  bullet,
}: {
  bullet: TimelineBullet
}) => {
  const Icon = bullet.icon

  return (
    <TimelineItem>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Typography variant="h5">{bullet.title}</Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color="secondary">
          <Icon />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Typography>{bullet.detail}</Typography>
      </TimelineContent>
    </TimelineItem>
  )
}
