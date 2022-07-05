import { styled } from '@stitches/react'

const Button = styled('button', {
  '&:nth-child(2)': { margin: '0 25px' }
})

const Box = styled('div', {
  display: 'flex',
  'z-index': 20
})

const WindowControls = () => {

  return (
    <Box>
      <Button></Button>
      <Button></Button>
      <Button></Button>
    </Box>
  )
}

export default WindowControls