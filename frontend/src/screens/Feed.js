import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { windowHeight, windowWidth } from "../../Dimensions";
import FeedItem from "../components/FeedItem";
import axios from "axios";
import { clearStorage } from "../../AsyncStorageHandles";
const baseUrl = "http://192.168.0.174:8000";
const baseUrlAlternate = "http://10.100.102.12:8000";

const Feed = (props) => {
  const [feedItems, setFeedItems] = useState([]);
  const [data, setData] = useState([]);
  const [totalFetch, setTotalFetch] = useState(2);
  const [img, setImg] = useState(require("../../assets/down-chevron.png"));
  const flatList = useRef();

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

    <View>
      <FlatList
        ref={flatList}
        onContentSizeChange={() =>
          flatList.current.scrollToEnd({ animated: true })
        }
        data={data}
        // onEndReached={fetchMore}
        renderItem={({ item, index }) => {
          // if (item !== undefined)
          return (
            <FeedItem
              onPress={onPressHandler}
              id={item._id}
              key={item._id}
              index={index}
              dataSize={data.length}
              title={item.title}
              description={item.description}
              image={item.images[0] ? item.images[0] : null}
            />
          );
        }}
      />
      <TouchableOpacity onPress={fetchMore} style={styles.arrow}>
        <Image source={img} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  arrow: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: windowHeight - 180,
    left: windowWidth / 2 - 32,
  },
});

export default Feed;
