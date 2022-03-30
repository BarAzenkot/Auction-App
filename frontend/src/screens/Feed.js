import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import FeedItem from "../components/FeedItem";
import axios from "axios";
import { clearStorage } from "../../AsyncStorageHandles";
const baseUrl = "http://192.168.31.95:8000";
const baseUrlAlternate = "http://10.100.102.12:8000";

const Feed = (props) => {
  const [feedItems, setFeedItems] = useState([]);
  const [data, setData] = useState([]);
  const [totalFetch, setTotalFetch] = useState(2);

  const fetchMore = () => {
    setData((prevState) => [
      ...prevState,
      ...feedItems.slice(
        prevState.length,
        Math.min(prevState.length + 2, feedItems.length)
      ),
    ]);
  };

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
        .get(`${baseUrl}/auctions/`)
        .then((response) => setFeedItems(response.data.auctions));
    };
    callApi();
  }, [`${baseUrl}/auctions`]);

  useEffect(() => {
    setData(() => [...feedItems.slice(0, Math.min(2, feedItems.length))]);
    console.log("this is data:", data);
  }, [feedItems]);

  return (
    // <ScrollView style={styles.container}>
    //   {data?.map((item) => (
    //     <FeedItem
    //       onPress={onPressHandler}
    //       id={item._id}
    //       key={item._id}
    //       title={item.title}
    //       description={item.description}
    //       image={item.images[0] ? item.images[0] : null}
    //     />
    //   ))}
    // </ScrollView>

    //---------------------

    <View style={styles.container}>
      <FlatList
        data={data}
        // onEndReached={fetchMore}
        renderItem={({ item }) => {
          console.log(item);
          // if (item !== undefined)
          return (
            <FeedItem
              onPress={onPressHandler}
              id={item._id}
              key={item._id}
              title={item.title}
              description={item.description}
              image={item.images[0] ? item.images[0] : null}
            />
          );
        }}
      />
      <TouchableOpacity onclick={fetchMore}>
        <Text>Load More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});

export default Feed;
