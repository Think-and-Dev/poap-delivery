import wretch, { WretcherError } from 'wretch';
import { useToast } from '@chakra-ui/core';

export type Params = {
  [key: string]: string | number | boolean | undefined;
};

// Endpoints
export const endpoints = {
  poap: {
    events: `${process.env.GATSBY_API_POAP}/events`,
    claim: `${process.env.GATSBY_API_POAP}/actions/claim-delivery`,
    claimV2: `${process.env.GATSBY_API_POAP}/actions/claim-delivery-v2`,
    scan: (address: string) => `${process.env.GATSBY_API_POAP}/actions/scan/${address}`,
    queue: (messageId: string) => `${process.env.GATSBY_API_POAP}/queue-message/${messageId}`,
    token: (token: number) => `${process.env.GATSBY_POAP_APP}/token/${token}`,
    wallet: (address: string) => `${process.env.GATSBY_POAP_APP}/scan/${address}`,
    deliveryAddresses: (id: number) => `${process.env.GATSBY_API_POAP}/delivery-addresses/${id}`,
    deliveryAddress: (id: number, address: string) =>
      `${process.env.GATSBY_API_POAP}/delivery-addresses/${id}/address/${address}`,
  },
};

// Handlers
const handleHttpError = (errorCode: number) => (error: WretcherError) => {
  console.error(`Fetch error on ${errorCode} code parsing`, error);
  const toast = useToast();
  toast({
    title: 'Fetch error',
    description: 'An error occurred while fetching data',
    status: 'error',
  });
};

const handleGenericError = () => (error: WretcherError) => {
  console.error(`Fetch error`, error);
  const toast = useToast();
  toast({
    title: 'Fetch error',
    description: 'Endpoint not found',
    status: 'error',
  });
};

// Custom fetch
export const api = () => {
  return wretch()
    .catcher(404, handleGenericError())
    .catcher(405, handleHttpError(405))
    .catcher(400, handleHttpError(400));
};
