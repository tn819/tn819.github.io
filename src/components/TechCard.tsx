import { Avatar, AvatarGroup, Card, Grid, Typography } from '@mui/material'
import Image from 'next/image'

import { Spacer } from '.'

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

const TechCard = ({
  techItems,
  title,
  comment,
  png,
}: {
  techItems: string[]
  title: string
  comment: string
  png?: string
}) => (
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
        {title}
      </Typography>
      <TechAvatarGroup techItems={techItems} png={png} />
      <Spacer size={5} />
      <Typography variant="h6">{comment} </Typography>
    </Card>
  </Grid>
)

export default TechCard
