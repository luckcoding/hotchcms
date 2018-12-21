import React from 'react'

import Circle from './Circle'
import Wrapper from './Wrapper'

const LoadingIndicator = ({ size, color, ...props }) => (
  <Wrapper size={size} {...props}>
    <Circle />
    <Circle rotate={30} delay={-1.1} color={color} />
    <Circle rotate={60} delay={-1} color={color} />
    <Circle rotate={90} delay={-0.9} color={color} />
    <Circle rotate={120} delay={-0.8} color={color} />
    <Circle rotate={150} delay={-0.7} color={color} />
    <Circle rotate={180} delay={-0.6} color={color} />
    <Circle rotate={210} delay={-0.5} color={color} />
    <Circle rotate={240} delay={-0.4} color={color} />
    <Circle rotate={270} delay={-0.3} color={color} />
    <Circle rotate={300} delay={-0.2} color={color} />
    <Circle rotate={330} delay={-0.1} color={color} />
  </Wrapper>
)

LoadingIndicator.defaultProps = {
  color: '#999',
  size: 40,
}

export default LoadingIndicator
