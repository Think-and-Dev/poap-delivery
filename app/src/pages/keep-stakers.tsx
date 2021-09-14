import React from 'react';

// Lib
import PageWrapper from 'lib/hoc/PageWrapper';

// Constants
import events from 'lib/constants/events';

// UI
import MainLayout from 'ui/layouts/MainLayout';
import Container from 'ui/components/Container';
import ClaimHeader from 'ui/components/ClaimHeader';
import Claim from 'ui/components/claim';

const KeepStakers = () => {
  return (
    <PageWrapper
      title={'POAP ✈️ | 🏰 KEEP Network Ethereum Stakers'}
      description={
        'This is a POAP created for the first 112 Ethereum ECDSA node runners on the KEEP Network. These initial 100 participants created a private, decentralized network where users could mint tBTC.'
      }
    >
      <MainLayout>
        <Container>
          <ClaimHeader event={events['keepStakers']} />
          <Claim event={events['keepStakers']} />
        </Container>
      </MainLayout>
    </PageWrapper>
  );
};

export default KeepStakers;
