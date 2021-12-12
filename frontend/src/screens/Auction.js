import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Slideshow from "react-native-image-slider-show";
import Btn from "../components/Btn";
import Bid from "../components/Bid";

const Auction = (props) => {
  const [offerBid, setOfferBid] = useState(false);
  const onPressHandler = () => {
    setOfferBid(!offerBid);
  };

  const viewRef = useRef();

  const [auction, setAuction] = useState({
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

  const [seller, setSeller] = useState({
    user: {
      _id: "61a758db1105dfeed51745c4",
      username: "baraz12",
      password: "$2b$10$t9jFw0FmbYWt3/6WMLdwPelYuii7Y3UuIaK1sbJ4OEztg07WjqSaW",
      email: "bar1@api.com",
      fullName: "Bar Azenkot",
      bids: [],
      auctions: [
        "61ae05f5e96bf1cc6a8cb976",
        "61ae05f7e96bf1cc6a8cb97a",
        "61ae05fee96bf1cc6a8cb982",
        "61ae0606e96bf1cc6a8cb98e",
        "61ae060ae96bf1cc6a8cb992",
        "61ae060de96bf1cc6a8cb996",
        "61ae0611e96bf1cc6a8cb99a",
      ],
      __v: 13,
    },
  });

  const urls = [];
  auction.images.map((image) => {
    urls.push({ url: image });
  });

  return (
    <ScrollView
      ref={viewRef}
      onContentSizeChange={() => {
        viewRef.current.scrollToEnd({ animated: true });
      }}
    >
      <Slideshow dataSource={urls} height={400} />
      <View style={styles.container}>
        <Text style={styles.title}>{auction.title}</Text>
        <Text>{auction.category}</Text>
        <View style={styles.hr} />
        <Text style={styles.secondaryTitle}>Description</Text>
        <Text>{auction.description}</Text>
        <View style={styles.hr} />
        <Text style={styles.secondaryTitle}>Start Date</Text>
        <Text>{auction.startDate}</Text>
        <Text style={styles.secondaryTitle}>End Date</Text>
        <Text>{auction.endDate}</Text>
        <View style={styles.hr} />
        <Text style={styles.secondaryTitle}>Start Bid</Text>
        <Text>{auction.startPrice}</Text>
        <Text style={styles.secondaryTitle}>Current Bid</Text>
        <Text>{bid.amount}</Text>
        {offerBid ? (
          <View>
            <Bid />
            <Btn onPress={onPressHandler} title="Close" />
          </View>
        ) : (
          <Btn onPress={onPressHandler} title="Offer a Bid" />
        )}
        {/* <Btn title="Offer a Bid" /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 40,
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
});

export default Auction;
