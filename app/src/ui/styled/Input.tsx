import styled from '@emotion/styled';

export default styled.input`
  width: 100%;
  height: 50px;
  padding: 12px;
  box-shadow: none;
  border: 2px solid #c4cae8;
  background: #fff;
  transition: right 0.2s ease-out;
  border-radius: 4px;
  margin: 0 auto 16px;
  color: #8076fa;

  outline-color: #8076fa;

  &::placeholder {
    color: #8492ce;
  }

  @include x-rem(font-size, 13px);

  @media (min-width: 48em) {
    @include x-rem(font-size, 16px);
  }

  &:last-child {
    margin: 0;
  }

  &:focus-visible,
  &:focus,
  &:hover {
    border: 2px solid #8076fa;
    outline: none;
  }

  &:disabled {
    background: #e6edfe;
    border-color: #e6edfe;
  }

  &.error {
    border: 2px solid #e13c5d;
  }
`;
