import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AuthInput from "../components/AuthInput";
import Btn from "../components/Btn";
const axios = require("axios");
const baseUrl = "http://192.168.0.174:8000";
const baseUrlAlternate = "http://10.100.102.12:8000";
import { getToken, getUserID } from "../../AsyncStorageHandles";

const Bid = (props) => {
  const [amount, setAmount] = useState();
  const [bid, setBid] = useState({});
  const [numOfBids, setNumOfBids] = useState();
  const [flag, setFlag] = useState(true);
  const [userCoins, setUserCoins] = useState(0);
  const tokenize = async () => {
    return await getToken();
  };

  useEffect(() => {
    tokenize()
      .then((token) => {
        // console.log("HERE IN Bid.js and this is the user: ", props.user);
        axios
          .get(`${baseUrl}/users/${props.user}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setUserCoins(res.data.user.coins);
            console.log(userCoins);
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const checkMaxPrice = (bid, token) => {
    axios
      .get(`${baseUrl}/bids/${bid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.bid.amount >= amount) {
          alert("Error, Someone offered higher bid.");
          setFlag(false);
        }
      });
  };

  const getLastBid = (token) => {
    axios
      .get(`${baseUrl}/auctions/${props.auction._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) =>
        checkMaxPrice(
          res.data.auction.bids[res.data.auction.bids.length - 1],
          token
        )
      )
      .catch((err) => {
        console.log(err);
      });
  };

  const makeABid = () => {
    tokenize().then((token) => {
      getLastBid(token);
      if (flag) {
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
            setUserCoins((prev) => prev - amount);
            setAmount("");
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
        userCoins < amount ? (
          <Text style={styles.warning}>
            You don't have enough coins in your wallet, {userCoins}$ left.
          </Text>
        ) : props.bid.amount ? (
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
