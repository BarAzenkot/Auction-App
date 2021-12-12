import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

const AuthInput = ({ ...rest }) => {
  return (
    <View style={styles.container}>
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
