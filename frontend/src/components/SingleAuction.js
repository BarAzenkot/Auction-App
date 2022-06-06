import { View, Text, StyleSheet } from "react-native";
import React from "react";

const SingleAuction = ({ data }) => {
  console.log(data.endDate.split("T"));
  return (
    <View
      style={{
        ...styles.container,
        borderColor:
          new Date(data.endDate) < new Date() ? "rgb(150, 230, 150)" : "black",
        backgroundColor:
          new Date(data.endDate) < new Date()
            ? "rgba(150, 230, 150, 0.3)"
            : "white",
      }}
    >
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.text}>Category: {data.category}</Text>
      <Text style={styles.text}>
        Ends at: {data.endDate.split("T")[0]} |{" "}
        {data.endDate.split("T")[1].split(".")[0]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
  },
  title: {
    fontSize: 26,
  },
});

export default SingleAuction;
