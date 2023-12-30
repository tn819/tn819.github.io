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
        variant="h5"
        color="text.secondary"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {bullet.title}
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
