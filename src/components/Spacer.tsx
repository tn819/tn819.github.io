import { Box } from '@mui/material'

export interface Props {
  size?: number
  variant?: 'horizontal' | 'vertical'
}

const Spacer = ({ size = 1, variant = 'vertical' }: Props) => (
  <Box
    sx={{
      pb: variant === 'vertical' ? size : undefined,
      pr: variant !== 'vertical' ? size : undefined,
    }}
  />
)

export default Spacer
