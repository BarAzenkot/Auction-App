import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Btn = (props) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={props.onPress} style={styles.container}>
        <Text style={styles.wrapper}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    alignItems: "center",
    width: "40%",
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  wrapper: {
    alignItems: "center",
    fontSize: 20,
    color: "white",
  },
});

export default Btn;
