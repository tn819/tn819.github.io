import Slide from '@mui/material/Slide'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { JSXElementConstructor } from 'react'

interface Props {
  children: React.ReactElement<unknown, string | JSXElementConstructor<unknown>>
}

const HideOnScroll: React.FC<Props> = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
  })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default HideOnScroll
