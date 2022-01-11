import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FeedItem from "../components/FeedItem";
import axios from "axios";
import { clearStorage } from "../../AsyncStorageHandles";
const baseUrl = "http://172.20.8.235:8000";
const baseUrlAlternate = "http://10.100.102.12:8000";

const Feed = (props) => {
  const [feedItems, setFeedItems] = useState([]);
  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          clearStorage();
          props.route.params.reReadToken();
        }}
      >
        <Text>Log Out</Text>
      </TouchableOpacity>
    ),
  });
  const onPressHandler = (input) => {
    props.navigation.navigate("Auction", {
      ...input,
      signedInUser: props.route.params.signedInUser,
    });
  };

  useEffect(() => {
    const callApi = () => {
      const result = axios
        .get(`${baseUrlAlternate}/auctions/`)
        .then((response) => setFeedItems(response.data.auctions));
    };
    callApi();
  }, [`${baseUrlAlternate}/auctions`]);

  return (
    <ScrollView style={styles.container}>
      <View>
        {feedItems?.map((item) => (
          <FeedItem
            onPress={onPressHandler}
            id={item._id}
            key={item._id}
            title={item.title}
            description={item.description}
            image={item.images[0] ? item.images[0] : null}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});

export default Feed;
