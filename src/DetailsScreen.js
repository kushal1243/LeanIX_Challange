import moment from 'moment';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

class DetailsScreen extends Component {

  render() {
    const Item = this.props.navigation.getParam('item')
    if (Item) {
      var m = moment.unix(new Date(Item.launch_date_local).getTime() / 1000);
      var formatted = m.format("MMM D, YYYY")
    }
  
    return (
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
