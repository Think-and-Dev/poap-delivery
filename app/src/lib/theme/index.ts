import { css } from '@emotion/core';

export const mainStyles = css`
  :root {
    /* fonts */
    --main-font: 'Archivo', sans-serif;
    --alt-font: 'Archivo Narrow', sans-serif;
    --mix-font: 'Roboto', sans-serif;
  }

  a {
    &:hover {
      text-decoration: none !important;
    }

    svg {
      margin-left: 2px;
      display: inline;
    }
  }

  ::placeholder {
    color: #ccced9 !important;
  }

  /* Web3 Modal Hack*/
  #WEB3_CONNECT_MODAL_ID {
    position: relative;
    z-index: 50;
  }

  button {
    &:focus {
      box-shadow: none !important;
    }
  }

  input[type='text'],
  input[type='password'],
  input[type='tel'],
  input[type='textarea'],
  input[type='email'],
  input[type='color'],
  input[type='number'],
  input[type='text'],
  input[type='file'] {
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

    font-size: 13px;

    @media (min-width: $bp-m) {
      font-size: 16px;
    }

    &:last-child {
      margin: 0;
    }

    &:focus,
    &:hover {
      border: 2px solid #8076fa;
    }

    &:disabled {
      background: #e6edfe;
      border-color: #e6edfe;
    }

    &.error {
      border: 2px solid #e13c5d;
    }
  }
`;
