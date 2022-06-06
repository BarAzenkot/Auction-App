import React, { useEffect, useState } from "react";
import AuthInput from "../components/AuthInput";
import { View, StyleSheet, Text } from "react-native";
import { windowWidth, windowHeight } from "../../Dimensions";
import Btn from "../components/Btn";
import axios from "axios";
const baseUrl = "http://192.168.31.95:8000";
import { getToken, getUserID } from "../../AsyncStorageHandles";
const tokenize = async () => {
  return await getToken();
};
const ChargeCoins = () => {
  const [amount, setAmount] = useState(0);
  const [amountValid, setAmountValid] = useState(true);
  const [userID, setUserID] = useState("");
  const [fetch, setFetch] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserID = async () => {
      // const fetchedUserID = await getUserID();
      setUserID(await getUserID());
    };
    fetchUserID();
  }, []);

  useEffect(() => {
    axios
      .get(`${baseUrl}/users/${userID}`)
      .then((res) => {
        setUser({
          fullName: res.data.user.fullName,
          email: res.data.user.email,
          coins: res.data.user.coins,
        });
      })
      .catch((err) => console.log(err.message));
  }, [userID, fetch]);

  const onSubmit = async () => {
    setAmountValid(true);
    if (amount < 1 || isNaN(amount)) {
      setAmountValid(false);
      //   const data = { amount: amount };
    } else {
      tokenize()
        .then((token) => {
          axios.post(`${baseUrl}/users/${userID}/charge`, {
            headers: {
              Authorization: `Bearer ${token}`,
              //   "Content-Type": "application/json",
            },
            body: { amount: amount },
          });
        })
        .then((response) => {
          console.log(response);
          setFetch((prevState) => !prevState);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={styles.maincontainer}>
      <Text style={styles.title}>My Personal Info</Text>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.content}>Hello {user.fullName}!</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.content}>{user.email}</Text>
        </View>

        <View style={styles.wrapper}>
          <Text style={styles.content}>Coins: {user.coins}$</Text>
        </View>
      </View>
      <View style={styles.container}>
        <AuthInput
          placeholder="Amount of coins"
          placeholderTextColor={amountValid ? "grey" : "white"}
          returnKeyType="done"
          keyboardType="number-pad"
          onChangeText={(input) => setAmount(parseInt(input))}
          error={!amountValid}
        />
        <Btn title="Submit" onPress={onSubmit}></Btn>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: windowHeight * 0.1,
    // marginLeft: windowWidth * 0.1,
    backgroundColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: windowWidth * 0.8,
    // alignItems: "center",
  },
  title: {
    fontSize: 26,
  },
  maincontainer: {
    marginTop: windowHeight * 0.1,
    textAlign: "center",
    alignItems: "center",
  },
  content: {
    padding: 5,
    fontSize: 18,
    margin: 10,
  },
  wrapper: {
    backgroundColor: "rgba(250, 250, 250, 0.8)",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default ChargeCoins;
