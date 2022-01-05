import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AuthInput from "../components/AuthInput";
import Btn from "../components/Btn";
const axios = require("axios");
const baseUrl = "http://172.20.8.235:8000";

const Bid = (props) => {
  const [amount, setAmount] = useState();
  const [bid, setBid] = useState({});

  const onPressHandler = () => {
    console.log(amount);
  };

  var config = {
    method: "post",
    url: `${baseUrl}/auctions/${props.auction._id}`,
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZDE2ODJjMTNlMDEzN2M3YTEwY2FlZCIsImVtYWlsIjoiYmExMTExMXJAZ21haWwuY29tIiwiaWF0IjoxNjQxMzg0MzM0LCJleHAiOjE2NDE0NzA3MzR9.4wsa8iwg5AJThqSKYwioH5ZLSsB7VBv5kcR2Bf0DMWA",
      "Content-Type": "application/json",
    },
    data: amount,
  };

  const makeABid = () => {
    axios
      .post(
        `${baseUrl}/auctions/${props.auction._id}`,
        {
          amount,
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZDE2ODJjMTNlMDEzN2M3YTEwY2FlZCIsImVtYWlsIjoiYmExMTExMXJAZ21haWwuY29tIiwiaWF0IjoxNjQxMzg0MzM0LCJleHAiOjE2NDE0NzA3MzR9.4wsa8iwg5AJThqSKYwioH5ZLSsB7VBv5kcR2Bf0DMWA`,
          },
        }
      )
      .then((res) => {
        props.onChangeBid(amount);
        setAmount("");
      })
      .catch((err) => {
        console.log(err);
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
