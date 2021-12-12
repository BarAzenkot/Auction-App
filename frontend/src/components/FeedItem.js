import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const FeedItem = (props) => {
  const onPressHandler = () => {
    props.onPress({
      id: props.id,
    });
  };
  props.image && console.log("img", props.image);
  return (
    <TouchableOpacity onPress={onPressHandler} style={styles.container}>
      <Image
        style={styles.stretch}
        source={
          !props.image
            ? require("../../assets/not-found.jpg")
            : require(props.image)
        }
        // alt={require("../../assets/not-found.jpg")}
      />
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.description}>{props.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    margin: 10,
    padding: 5,
  },
  stretch: {
    width: 380,
    height: 380,
    resizeMode: "stretch",
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 5,
  },
});

export default FeedItem;
