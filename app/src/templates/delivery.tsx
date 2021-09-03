import React, { useState, useEffect } from 'react';

// Lib
import PageWrapper from 'lib/hoc/PageWrapper';
import { endpoints } from 'lib/api';

// Hooks
import { useDeliveryAddresses } from 'lib/hooks/useDeliveryAddresses';

// Types
import { AirdropEventData, AddressData, ClaimData } from 'lib/types';

// UI
import MainLayout from 'ui/layouts/MainLayout';
import Container from 'ui/components/Container';
import ClaimHeader from 'ui/components/ClaimHeader';
import ClaimV2 from 'ui/components/claim/ClaimV2';

const Delivery = ({ pathContext }) => {
  const { delivery } = pathContext;

  const reloadAction = () => {
    //todo fetch delivery again ¿?
  };

  return (
    <PageWrapper
      title={`POAP ✈️ | ${delivery.metadata_title}`}
      description={delivery.metadata_description}
    >
      <MainLayout>
        <Container>
          {delivery && (
            <>
              <ClaimHeader delivery={delivery} />
              <ClaimV2 delivery={delivery} deliveryId={delivery.id} reloadAction={reloadAction} />
            </>
          )}
        </Container>
      </MainLayout>
    </PageWrapper>
  );
};

export default Delivery;
