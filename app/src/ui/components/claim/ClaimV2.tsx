import React, { FC, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { BaseProvider } from '@ethersproject/providers/lib';
import { Box, useToast } from '@chakra-ui/core';

// Hooks
import { useClaimV2 } from 'lib/hooks/useClaimV2';
import { useStateContext } from 'lib/hooks/useCustomState';

// Components
import AddressForm from './AddressForm';
import BadgeHolder from './BadgeHolder';
import Transactions from './Transactions';
import CardWithBadges from 'ui/components/CardWithBadges';
import SiteNoticeModal from 'ui/components/SiteNoticeModal';

// Types
import {
  Transaction,
  PoapEvent,
  Queue,
  QueueStatus,
  GraphDelivery,
  DeliveryAddress,
} from 'lib/types';
import { api, endpoints } from 'lib/api';

type ClaimProps = {
  delivery: GraphDelivery;
  deliveryId: number;
  reloadAction: () => void;
};

const ClaimV2: FC<ClaimProps> = ({ delivery, deliveryId, reloadAction }) => {
  const { account, saveTransaction, transactions } = useStateContext();
  // Query hooks
  const [claimV2POAP, { isLoading: isClaimingPOAP }] = useClaimV2();
  const toast = useToast();

  const [poapsToClaim, setPoapsToClaim] = useState<PoapEvent[]>([]);
  const [providerL1, setProviderL1] = useState<BaseProvider | null>(null);
  const [providerL2, setProviderL2] = useState<BaseProvider | null>(null);
  const [address, setAddress] = useState<string>(account);
  const [ens, setEns] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [addressValidated, setAddressValidated] = useState<boolean>(false);
  const [validatingAddress, setValidatingAddress] = useState<boolean>(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | undefined>(undefined);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);

  const [eventTransactions, setEventTransactions] = useState<Transaction[]>([]);

  const handleInputChange = (value: string) => {
    setAddress(value);
  };

  const handleSubmit = async () => {
    //todo encapsulate this fetch
    setValidatingAddress(true);

    const response = await fetch(endpoints.poap.deliveryAddress(delivery.id, address));

    if (!response.ok) {
      if (response.status === 404) {
        setError('Address not found in claim list');
      } else if (response.status === 400) {
        setError('Please enter a valid Ethereum address or ENS Name');
      } else if (response.status === 500) {
        setError('An internal error has ocurred, please try again later');
      }
      setValidatingAddress(false);
      return;
    }

    const _deliveryAddress: DeliveryAddress = await response.json();

    setDeliveryAddress(_deliveryAddress);
    setAddress(_deliveryAddress.address);
    setPoapsToClaim(_deliveryAddress.events);
    setValidatingAddress(false);
    setAddressValidated(true);
    checkClaim();
  };

  const clearForm = () => {
    setAddress('');
    setEns('');
    setError('');
    setAddressValidated(false);
    setClaiming(false);
    setDeliveryAddress(undefined);
    setClaimed(false);
    setPoapsToClaim([]);
  };

  const handleClaimSubmit = async () => {
    setClaiming(true);

    try {
      const claimResponse = await claimV2POAP({ id: deliveryId, address });
      if (claimResponse) {
        let tx: Transaction = {
          key: delivery.slug,
          address,
          queue_uid: claimResponse.queue_uid,
          status: 'pending',
        };
        console.log(tx);
        saveTransaction(tx);
      } else {
        throw new Error('No response received');
      }
    } catch (e) {
      console.log('Error while claiming');
      console.log(e);
    }
  };

  let filteredTransactions =
    transactions &&
    deliveryAddress &&
    transactions.filter((tx) => tx.key === delivery.slug && tx.address === deliveryAddress.address);

  const transactionPassed =
    filteredTransactions &&
    filteredTransactions.length > 0 &&
    filteredTransactions.some((tx) => tx.status === 'passed');

  useEffect(() => {
    if (transactionPassed) {
      const _deliveryAddress = { ...deliveryAddress };
      _deliveryAddress.claimed = true;
      setDeliveryAddress(_deliveryAddress);
    }
    // eslint-disable-next-line
  }, [transactionPassed]);

  const checkClaim = useCallback(() => {
    if (deliveryAddress && deliveryAddress.claimed) {
      setClaimed(true);
    }
  }, [deliveryAddress]);

  // Effects
  useEffect(() => {
    if (!providerL1) {
      try {
        let _provider = ethers.getDefaultProvider(process.env.GATSBY_ETHEREUM_NETWORK, {
          infura: process.env.GATSBY_INFURA_KEY,
        });
        setProviderL1(_provider);
      } catch (e) {
        console.log('Error while initiating provider');
      }
    }
    if (!providerL2) {
      try {
        let _providerL2 = ethers.getDefaultProvider(process.env.GATSBY_L2_PROVIDER);
        setProviderL2(_providerL2);
      } catch (e) {
        console.log('Error while initiating provider');
      }
    }
  }, []); //eslint-disable-line
  useEffect(() => {
    const interval = setInterval(() => {
      if (transactions && providerL2) {
        transactions
          .filter((tx) => tx.status === 'pending')
          .forEach(async (tx) => {
            if (tx.hash) {
              let receipt = await providerL2.getTransactionReceipt(tx.hash);
              if (receipt) {
                let newTx: Transaction = { ...tx, status: 'passed' };
                if (!receipt.status) {
                  newTx = { ...tx, status: 'failed' };
                  setClaiming(false);
                }
                saveTransaction(newTx);
                reloadAction();
              }
            } else {
              const queue: Queue = await api().url(endpoints.poap.queue(tx.queue_uid)).get().json();
              if (queue.status == QueueStatus.finish && queue.result && queue.result.tx_hash) {
                let newTx: Transaction = { ...tx, hash: queue.result.tx_hash };
                saveTransaction(newTx);
                toast({
                  title: 'Delivery in process!',
                  description: 'The POAP token is on its way to your wallet',
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                });
              } else if (queue.status == QueueStatus.finish_with_error) {
                let newTx: Transaction = { ...tx, hash: queue.result.tx_hash, status: 'failed' };
                saveTransaction(newTx);
                toast({
                  title: "Couldn't deliver your POAP!",
                  description: 'There was an error processing your POAP token. Please try again',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
              }
            }
          });
        checkClaim();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [transactions]); //eslint-disable-line
  useEffect(() => {
    let filteredTransactions = transactions.filter((tx) => tx.key === delivery.slug);
    setEventTransactions(filteredTransactions);
  }, [transactions]); //eslint-disable-line

  useEffect(() => {
    if (account && address === '') setAddress(account);
  }, [account]); //eslint-disable-line

  useEffect(() => {
    checkClaim();
  }, [checkClaim, delivery, deliveryAddress]);

  return (
    <Box maxW={['90%', '90%', '90%', '600px']} m={'0 auto'} p={'50px 0'}>
      {!addressValidated && (
        <CardWithBadges>
          <AddressForm
            address={address}
            error={error}
            inputAction={handleInputChange}
            submitAction={handleSubmit}
            buttonDisabled={validatingAddress}
            isDisabled={!delivery.active}
          />
        </CardWithBadges>
      )}
      {addressValidated && (
        <CardWithBadges>
          <BadgeHolder
            backAction={clearForm}
            ens={ens}
            address={address}
            poaps={poapsToClaim}
            claimed={claimed}
            submitAction={handleClaimSubmit}
            buttonDisabled={claiming}
            isLoading={isClaimingPOAP}
          />
        </CardWithBadges>
      )}
      <Transactions transactions={eventTransactions} />
      {!delivery.active && <SiteNoticeModal />}
    </Box>
  );
};

export default ClaimV2;
