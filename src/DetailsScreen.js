import React, { Component } from 'react';
import {
  StyleSheet, Text, View,
  StatusBar, SafeAreaView, Image, ImageBackground, FlatList, TouchableWithoutFeedback
} from 'react-native';
import { Card, Input, Button, ListItem, SearchBar } from 'react-native-elements';
import { HttpLink } from 'apollo-link-http';
import { Query } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { BarIndicator } from 'react-native-indicators';
import LaunchListItem from './LaunchListItem';
import moment from 'moment';

export const FETCH_PAST_LAUNCHES = gql`
  {
    launchesPast{
      mission_name
      launch_date_local
      links {
        video_link
      }
      rocket {
        rocket_name
      }
      launch_year
    }
  }
`

export const FETCH_UPCOMING_LAUNCHES = gql`
  {
    launchesUpcoming{
      mission_name
      launch_date_local
      links {
        video_link
      }
      rocket {
        rocket_name
      }
      launch_year
    }
  }
  `


const makeApolloClient = () => {
  const link = new HttpLink({
    uri: 'https://api.spacex.land/graphql/',
  })

  const cache = new InMemoryCache()

  const client = new ApolloClient({
    link,
    cache
  })

  return client
}

class DetailsScreen extends Component {

  state = {
    client: null,
    isStatusPast: true,
    searchText: '',
    querySearchText: '',
    refresh: false,
    pastLaunchData: null,
    upcomingLaunchData: null,
    pastLaunchSearchData: null,
    upcomingLaunchSearchData: null
  }

  updateSearch = searchText => {
    this.setState({ searchText });

    const newPastData = this.state.pastLaunchData.filter(item => {
      const itemData = `${item.mission_name.toUpperCase()} ${item.rocket.rocket_name.toUpperCase()} ${item.launch_year.toUpperCase()}`;
      const textData = searchText.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    const newUpcomingData = this.state.upcomingLaunchData.filter(item => {
      const itemData = `${item.mission_name.toUpperCase()} ${item.rocket.rocket_name.toUpperCase()} ${item.launch_year.toUpperCase()}`;
      const textData = searchText.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({ pastLaunchSearchData: newPastData, upcomingLaunchSearchData: newUpcomingData });
  };

  fetchPastLaunches = (client) => {
    client.query({
      query: FETCH_PAST_LAUNCHES
    }).then(response => {
      this.setState({
        pastLaunchData: response.data.launchesPast,
        pastLaunchSearchData: response.data.launchesPast
      })
    })
  }

  fetchUpcomingLaunches = (client) => {
    client.query({
      query: FETCH_UPCOMING_LAUNCHES
    }).then(response => {
      this.setState({
        upcomingLaunchData: response.data.launchesUpcoming,
        upcomingLaunchSearchData: response.data.launchesUpcoming
      })
    })
  }

  componentDidMount() {
    const client = makeApolloClient()
    this.setState({ client })
    this.fetchPastLaunches(client)
    this.fetchUpcomingLaunches(client)
  }

  renderPastLaunchesContent() {
    if (this.state.pastLaunchData) {
      return (
        <FlatList
          extraData={this.state.refresh}
          data={this.state.pastLaunchSearchData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <LaunchListItem launchItem={item} />}
          keyExtractor={item => item.mission_name}
        />
      )
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <BarIndicator color='blue' />
        </View>
      </View>
    )
  }

  renderUpcomingLaunchesContent() {
    if (this.state.upcomingLaunchData) {
      return (
        <FlatList
          extraData={this.state.refresh}
          data={this.state.upcomingLaunchSearchData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <LaunchListItem launchItem={item} />}
          keyExtractor={item => item.mission_name}
        />
      )
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <BarIndicator color='blue' />
        </View>
      </View>
    )
  }

  renderMainContent() {
    if (this.state.isStatusPast) {
      return (
        <View>
          {this.renderPastLaunchesContent()}
        </View>
      )
    }
    return (
      <View>
        {this.renderUpcomingLaunchesContent()}
      </View>
    )
  }

  renderButtonContainer() {
    if (this.state.isStatusPast) {
      return (
        <Button
          title="Show Upcoming Launches"
          onPress={() => this.setState({ isStatusPast: false })}
          buttonStyle={styles.bottomButton}
          titleStyle={styles.buttonTextStyle}
        />
      )
    }
    return (
      <Button
        title="Show Past Launches"
        onPress={() => this.setState({ isStatusPast: true })}
        buttonStyle={styles.bottomButton}
        titleStyle={styles.buttonTextStyle}
      />
    )
  }

  render() {
    const Item = this.props.navigation.getParam('item')
    if (Item) {
      var m = moment.unix(new Date(Item.launch_date_local).getTime() / 1000);
      var formatted = m.format("MMM D, YYYY")
    }
    if (!this.state.client) {
      return (
        <View style={styles.mainContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/launchify_logo.png')}
              style={styles.logoStyle}
            />
          </View>
        </View>
      );
    }
    return (
      <ApolloProvider client={this.state.client}>
        <SafeAreaView style={styles.mainContainer}>
          {
            Item ?
              <View>
                <Text style={styles.missionName}>{Item.mission_name}</Text>
                <View style={styles.item_txtView}>
                  <Text>Rocket Name:</Text>
                  <Text style={styles.launch_year}> {Item.rocket.rocket_name}</Text>
                </View>
                <View style={styles.item_txtView}>
                  <Text>Launch Year :</Text>
                  <Text style={styles.launch_year}> {formatted}</Text>
                </View>
                <View style={styles.item_txtView}>
                  <Text>Links : </Text>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.video_link}>{Item.links.video_link}</Text>
                </View>
              </View>
              : null
          }

        </SafeAreaView>
      </ApolloProvider >
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%'
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 200
  },
  logoStyle: {
    width: 400,
    height: 400
  },
  listContainer: {
    flex: 12,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomButton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#026eca',
  },
  buttonTextStyle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  timelineIconStyle: {
    width: 30,
    height: 30
  },
  missionName: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#dcdcdc',
    padding: 10,
    alignSelf: 'center',
    marginVertical: 10
  },
  launch_year: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  video_link: {
    textDecorationLine: 'underline',
    textDecorationColor: 'red',
    color: 'blue',
    width: '70%'
  },
  item_txtView: {
    flexDirection: 'row',
    alignSelf: "center",
    justifyContent: 'center',
    marginTop: 10
  }
});

export default DetailsScreen;
