import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleAuction from "./SingleAuction";
import Loading from "../screens/Loading";
const baseUrl = "http://192.168.31.95:8000";
const MyAuctionsList = ({ data }) => {
  const [fetchedData, setFetchedData] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(data);
      data.map((item) => {
        axios
          .get(`${baseUrl}/auctions/${item}`)
          .then((res) =>
            setFetchedData((prevState) => [...prevState, res.data.auction])
          )
          .catch((error) => console.log(error.message));
      });
    };
    fetchData().then(() => {
      setTimeout(() => {
        setLoad(true);
      }, 1500);
    });
  }, [data]);
  if (!load) {
    return <Loading />;
  }
  if (fetchedData.length === 0) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.content}>No Data To Show!</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {fetchedData.map((item) => (
        <SingleAuction key={item._id} data={item} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
  },
  wrapper: {
    marginTop: 100,
    alignItems: "center",
  },
  content: {
    fontSize: 28,
  },
});

export default MyAuctionsList;
