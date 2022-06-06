import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

const AuthInput = ({ error, ...rest }) => {
  // let err = error || false;
  return (
    <View
      style={{
        ...styles.container,
        borderColor: error ? "red" : "black",
        backgroundColor: error ? "rgba(200, 150, 150, 0.7)" : "white",
      }}
    >
      <TextInput style={styles.input} {...rest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    fontSize: 24,
    margin: 10,
  },
});

export default AuthInput;
