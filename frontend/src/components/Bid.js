import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AuthInput from "../components/AuthInput";
import Btn from "../components/Btn";
const axios = require("axios");
const baseUrl = "http://192.168.31.95:8000";
const baseUrlAlternate = "http://10.100.102.12:8000";
import { getToken } from "../../AsyncStorageHandles";

const Bid = (props) => {
  const [amount, setAmount] = useState();
  const [bid, setBid] = useState({});
  const [numOfBids, setNumOfBids] = useState();
  const tokenize = async () => {
    return await getToken();
  };

  // console.log(props);

  const onPressHandler = () => {
    console.log(amount);
  };

  const makeABid = () => {
    tokenize().then((token) => {
      axios
        .post(
          `${baseUrl}/auctions/${props.auction._id}`,
          {
            amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          props.onChangeBid(amount);
          setNumOfBids(res.numOfBids);
          setAmount("");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  // console.log(props.bid.auction);
  // const makeABid = async () => {
  //   console.log(amount + "barrrrrrrrrrrrrrr");
  //   const result = await axios
  //     .post(`${process.env.BASE_URL/auctions/${props.bid.auction}`, {
  //       amount: amount,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //     })
  //     .catch((err) => {
  //       console.log(err.response.data);
  //     });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.secondaryTitle}>Enter your bid</Text>
      <AuthInput
        placeholder="Amount"
        value={amount}
        keyboardType="number-pad"
        returnKeyType="done"
        onChangeText={(input) => setAmount(input)}
      />
      {amount ? (
        props.bid.amount ? (
          amount <= props.bid.amount ? (
            <Text style={styles.warning}>
              Please enter amount greater than the current bid.
            </Text>
          ) : (
            <Btn onPress={makeABid} title="Submit" />
          )
        ) : amount <= props.auction.startPrice ? (
          <Text style={styles.warning}>
            Please enter amount greater than the start price.
          </Text>
        ) : (
          <Btn onPress={makeABid} title="Submit" />
        )
      ) : (
        <Text>{amount}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 40,
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
