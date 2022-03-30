import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { windowHeight } from "../../Dimensions";
import React from "react";

const Loading = () => {
  return (
    <View style={styles.container}>
      <LottieView source={require("../../assets/loading.json")} autoPlay loop />
      <Text style={styles.title}>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 48, marginTop: -windowHeight / 2 },
});

export default Loading;
