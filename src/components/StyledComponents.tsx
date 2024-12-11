import styled from '@emotion/styled';
import React from 'react';

interface ContainerProps {
  backgroundColor: string;
}

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`; 

export const Container: React.FC<React.PropsWithChildren<ContainerProps>> = styled.div<ContainerProps>`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, ${props => props.backgroundColor} 0%, #16213e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Canvas = React.forwardRef<HTMLCanvasElement>((props, ref) => (
  <StyledCanvas {...props} ref={ref} />
));
