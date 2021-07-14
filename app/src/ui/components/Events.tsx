import React, { FC, useCallback, useEffect, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { PseudoBox, Flex, Grid, useTheme, theme } from '@chakra-ui/core';
import styled from '@emotion/styled';

// Constants
import events from 'lib/constants/events';

// UI
import EventCard from 'ui/components/EventCard';

// Assets
import question from '../../assets/images/events/question.png';
import FailedSearchImg from '../../assets/images/failed-search.svg';

// Types
import { GraphDelivery } from 'lib/types';
import Input from 'ui/styled/Input';
import GallerySearch from '../styled/GallerySearch';

const Events: FC = () => {
  const apiDeliveries = useStaticQuery(graphql`
    query {
      deliveries {
        list {
          card_text
          card_title
          event_ids
          id
          image
          page_title
          page_text
          page_title_image
          slug
        }
      }
    }
  `);
  let apiEvents: GraphDelivery[] = apiDeliveries?.deliveries?.list || [];

  const FailedSearchDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    grid-column: 1 / 5;
    height: 200px;
    margin-top: 38px;
    // font-family: 'Comfortaa';
    color: #8076fa;
    font-family: var(--alt-font);
    font-weight: $fontWeight-bold;
    font-size: 1.375rem;
  `;
  const [eventsToDisplay, setEventsToDisplay] = useState(events);
  const [eventsApiToDisplay, setEventsApiToDisplay] = useState(apiEvents);

  enum searchStatusType {
    FailedSearch,
    NoSearch,
    SuccessfulSearch,
  }
  const [searchStatus, setSearchStatus] = useState(searchStatusType.NoSearch);
  function debounce(func, delay: number): (...args: any[]) => void {
    let timer;
    return function () {
      let self = this;
      let args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(self, args);
      }, delay);
    };
  }
  const debounceHandleSearch = useCallback(
    debounce((nextValue, items) => handleNewSearchValue(nextValue, items), 800),
    [],
  );
  const handleSearch = (event) => {
    const value = event.target.value;
    debounceHandleSearch(value, events);
  };
  const handleNewSearchValue = (value, items) => {
    if (value === undefined || value.length == 0) {
      setEventsToDisplay(events);
      setEventsApiToDisplay(apiEvents);
      setSearchStatus(searchStatusType.NoSearch);
    } else if (value.length > 1 && items) {
      var matchingKeys = Object.keys(items).filter(
        (k) => items[k].cardTitle.toLowerCase().indexOf(value.toLowerCase()) !== -1,
      );
      const filteredItems = {};
      matchingKeys.map((k) => (filteredItems[k] = items[k]));
      setEventsToDisplay(filteredItems);

      const filteredItemsApi = apiEvents.filter(
        (event) => event.card_title.toLowerCase().indexOf(value.toLowerCase()) !== -1,
      );
      setEventsApiToDisplay(filteredItemsApi);

      if (Object.keys(filteredItems).length + filteredItemsApi.length > 0) {
        setSearchStatus(searchStatusType.SuccessfulSearch);
      } else {
        setSearchStatus(searchStatusType.FailedSearch);
      }
    }
  };

  const failedSearch = () => {
    return searchStatus === searchStatusType.FailedSearch;
  };
  const noSearch = () => {
    return searchStatus === searchStatusType.NoSearch;
  };
  const theme = useTheme();

  return (
    <PseudoBox w={'100%'} pb={'100px'} mt={'50px'}>
      <PseudoBox w={['100%', ' 100%', '100%', '100%', '100%', '85%']} maxW={1600} m={'0 auto'}>
        <GallerySearch theme={theme}>
          <Input onChange={handleSearch} type="text" placeholder="Search.." />{' '}
          {!noSearch() && (
            <span
              style={{
                position: 'absolute',
                top: '80%',
                right: '0',
                color: '#66666688',
                fontSize: '.8rem',
              }}
            >
              {Object.keys(eventsToDisplay).length + eventsApiToDisplay.length} result(s)
            </span>
          )}
        </GallerySearch>
        <Grid
          templateColumns={['1fr', '1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr 1fr 1fr']}
          padding={['0', '0', '0 50px', '0 150px', '0']}
        >
          {failedSearch() ? (
            <FailedSearchDiv>
              <img src={FailedSearchImg} alt="Failed search" />
              <h3>No results for that search {':('}</h3>
            </FailedSearchDiv>
          ) : (
            eventsApiToDisplay
              .map((delivery, idx) => {
                return (
                  <Flex flex={1} justifyContent={'center'} key={idx} mt={'50px'}>
                    <EventCard
                      title={delivery.card_title}
                      body={delivery.card_text}
                      image={delivery.image}
                      buttonText={'Claim your POAP'}
                      buttonEnabled
                      buttonLink={delivery.slug}
                    />
                  </Flex>
                );
              })
              .concat(
                Object.keys(eventsToDisplay).map((key, idx) => {
                  const _event = events[key];
                  return (
                    <Flex
                      flex={1}
                      justifyContent={'center'}
                      key={eventsApiToDisplay.length + idx + 100}
                      mt={'50px'}
                    >
                      <EventCard
                        title={_event.cardTitle}
                        body={_event.cardText}
                        image={_event.image}
                        // buttonText={_event.active ? 'Claim your POAP' : 'Migration in process'}
                        buttonText={'Claim your POAP'}
                        buttonEnabled
                        buttonLink={_event.link}
                      />
                    </Flex>
                  );
                }),
              )
          )}
          {noSearch() && (
            <Flex flex={1} justifyContent={'center'} mt={'50px'}>
              <EventCard
                title={'Have a suggestion?'}
                body={`<p>We love celebrating the community and these fantastic events. If you know about any other similar event, please let us know!</p>`}
                image={question}
                buttonText={'Contact us!'}
                buttonEnabled={true}
                buttonLink={'mailto:info@poap.xyz'}
                internalLink={false}
              />
            </Flex>
          )}
        </Grid>
      </PseudoBox>
    </PseudoBox>
  );
};

export default Events;
