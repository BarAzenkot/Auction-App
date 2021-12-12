import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AuthInput from "../components/AuthInput";
import Btn from "../components/Btn";

const Bid = () => {
  const [amount, setAmount] = useState();

  const [action, setAuction] = useState({
    _id: "61ae05fee96bf1cc6a8cb982",
    title: "2 Pokemon Cards",
    description:
      "2 pokemon cards, first one is Mewtwo and second one is Pidgeot",
    startDate: "2022-01-01T00:00:00.000Z",
    endDate: "2022-02-01T00:00:00.000Z",
    startPrice: 100,
    category: "collections",
    images: [
      require("../../uploads/1638794750924-mewtwo.jpg"),
      require("../../uploads/1638794750924-peugeot.jpg"),
    ],
    bids: ["61b1ef9e18bcda6f0bfbd8b2"],
    user: "61a758db1105dfeed51745c4",
    __v: 0,
  });

  const [bid, setBid] = useState({
    _id: "61b1f6146847cf164c58d12d",
    amount: 150,
    auction: "61ae05fee96bf1cc6a8cb982",
    user: "61b1cf8100aa7b5484a9f152",
    date: "2021-12-09T12:27:00.546Z",
    __v: 0,
  });

  const onPressHandler = () => {
    console.log(amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.secondaryTitle}>Current Bid</Text>
      <Text>{bid.amount}</Text>
      <Text style={styles.secondaryTitle}>Enter your bid</Text>
      <AuthInput
        placeholder="Amount"
        keyboardType="number-pad"
        onChangeText={(input) => setAmount(input)}
      />
      {amount ? (
        amount <= bid.amount ? (
          <Text style={styles.warning}>
            Please enter amount greater than the current bid
          </Text>
        ) : (
          <Btn onPress={onPressHandler} title="Submit" />
        )
      ) : (
        <Text />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 100,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 10,
  },
  secondaryTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
  },
  hr: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  warning: {
    color: "red",
  },
});

export default Bid;
