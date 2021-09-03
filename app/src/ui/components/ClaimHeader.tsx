import React, { FC } from 'react';
import { Box, Flex, Heading, Image, Link } from '@chakra-ui/core';
import { RiShareBoxLine } from 'react-icons/ri';

// UI
import Content from 'ui/styled/Content';

// Types
import { AirdropEventData, GraphDelivery } from 'lib/types';

type ClaimHeaderProps = {
  event?: AirdropEventData;
  delivery?: GraphDelivery;
  migrated?: boolean;
};

const ClaimHeader: FC<ClaimHeaderProps> = ({ event, delivery, migrated }) => {
  const page_title_image = event ? event.pageTitleImage : delivery.page_title_image;
  const page_title = event ? event.pageTitle : delivery.page_title;
  const page_text = event ? event.pageText : delivery.page_text;

  return (
    <Flex
      p={['50px 45px', '50px 45px', '50px 45px', '50px 100px']}
      align={'center'}
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <Box color={'font'} fontFamily={'var(--alt-font)'} fontSize={'xl'}>
        <Heading
          as={'h1'}
          color={'primaryColor'}
          fontFamily={'body'}
          fontWeight={'bold'}
          fontSize={'40px'}
          lineHeight={'80px'}
          textAlign={'center'}
        >
          {page_title_image && (
            <Image
              size={'40px'}
              display={'inline'}
              margin={'0 10px 5px 0'}
              src={page_title_image}
              alt={page_title}
            />
          )}
          {page_title}
        </Heading>
        <Content dangerouslySetInnerHTML={{ __html: page_text }} />
        {migrated && (
          <Box mt={'10px'} as={'p'} lineHeight={'16px'} fontSize={'14px'}>
            Please note that this Airdrop was updated, and the new contract does not include address
            that already claimed the POAP before. If your address is not on the list, please check
            if it's already in your wallet.
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default ClaimHeader;
