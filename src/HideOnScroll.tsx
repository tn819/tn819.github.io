import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'
import { JSXElementConstructor } from 'react'

interface Props {
  children: React.ReactElement<unknown, string | JSXElementConstructor<unknown>>
}

const HideOnScroll: React.FC<Props> = ({ children }) => {
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default HideOnScroll
