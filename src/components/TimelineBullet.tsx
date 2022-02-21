import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
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
  icon(): EmotionJSX.Element
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
        sx={{ m: 'auto 0' }}
        variant="h5"
        color="text.secondary"
      >
        {bullet.title}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot>
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
