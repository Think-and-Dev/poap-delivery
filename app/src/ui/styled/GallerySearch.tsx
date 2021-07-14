import { ITheme } from '@chakra-ui/core';
import styled from '@emotion/styled';

// Styled Components
export default styled.div<{ theme: ITheme }>`
  position: relative;
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  place-self: end stretch;
  margin-bottom: 0.5rem;
  color: #4d5680;
  width: 200px;
  margin-left: 100px;
  @media (min-width: ${({ theme }) => theme.breakpoints['xxl']}) {
    margin-left: 0;
  }
`;
