import { Button, ButtonProps } from '@mantine/core'
import { gradients } from '../../../utils/gradients'

interface GradientButtonProps extends ButtonProps {
  gradientName?: keyof typeof gradients
}

export function GradientButton({
  gradientName = 'primary',
  children,
  ...props
}: GradientButtonProps) {
  return (
    <Button
      {...props}
      styles={{
        root: {
          background: gradients[gradientName],
          border: 0,
          color: 'white',
          '&:hover': {
            opacity: 0.9,
          },
        },
      }}
    >
      {children}
    </Button>
  )
}
