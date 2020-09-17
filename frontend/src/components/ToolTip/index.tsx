import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  title: string;
  className?: string;
}

const ToolTip: React.FC<TooltipProps> = ({ title, children, className }) => (
  <Container className={className}>
    {children}
    <span>{title}</span>
  </Container>
);

export default ToolTip;
