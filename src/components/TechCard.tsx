import {
  Avatar,
  AvatarGroup,
  Card,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material'
import Image from 'next/image'

import { Spacer } from '.'

type TechItemAvatarProps = { alt: string; path: string }

function TechItemAvatar({ alt, path }: TechItemAvatarProps) {
  return (
    <Tooltip key={alt} title={alt} disableFocusListener>
      <Avatar sx={{ width: 56, height: 56 }}>
        <Image src={`/images/tech/${path}`} alt={alt} height={40} width={40} />
      </Avatar>
    </Tooltip>
  )
}

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
        <TechItemAvatar key={tech} alt={tech} path={tech + '.svg'} />
      ))}
      {png ? <TechItemAvatar alt={png} path={png + '.png'} /> : undefined}
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
  <Grid item xs={12} md={6} lg={4} component="div">
    <Card
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
        boxShadow: 5,
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <TechAvatarGroup techItems={techItems} png={png} />
      <Spacer size={5} />
      <Typography variant="h6">{comment} </Typography>
    </Card>
  </Grid>
)

export default TechCard
