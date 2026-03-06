import { Spacer } from '.'

import { Avatar, AvatarGroup, Card, Tooltip, Typography } from '@mui/material'
import Image from 'next/image'

type TechItemAvatarProps = { alt: string; path: string }

function TechItemAvatar({ alt, path }: TechItemAvatarProps) {
  return (
    <Tooltip key={alt} title={alt} disableFocusListener>
      <Avatar sx={{ width: 56, height: 56, bgcolor: '#E0E0E0' }}>
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
  <Card
    sx={{
      height: '100%',
      minHeight: 180,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: { xs: 2, sm: 3, md: 4 },
      boxShadow: 3,
    }}
  >
    <Typography variant="h6" fontWeight={700} gutterBottom textAlign="center">
      {title}
    </Typography>
    <TechAvatarGroup techItems={techItems} png={png} />
    <Spacer size={3} />
    <Typography variant="body2" textAlign="center">
      {comment}
    </Typography>
  </Card>
)

export default TechCard
