import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Keyboard } from "react-native";
import Slideshow from "react-native-image-slider-show";
import Btn from "../components/Btn";
import Bid from "../components/Bid";
import { windowWidth, windowHeight } from "../../Dimensions";
const axios = require("axios");
const baseUrl = "http://172.20.8.235:8000";

const Auction = (props) => {
  const [offerBid, setOfferBid] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboard(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboard(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onPressHandler = () => {
    setOfferBid(!offerBid);
  };

  const onChangeBidHandler = (amount) => {
    setBid({ ...bid, amount });
  };

  const [load, setLoad] = useState(false);
  const viewRef = useRef();
  const isInitialMount = useRef(true);

  const [auction, setAuction] = useState({});
  const [bid, setBid] = useState({});
  const [seller, setSeller] = useState({});
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const callApi1 = () => {
      const result = axios
        .get(`${baseUrl}/auctions/${props.route.params.id}`)
        .then((response) => {
          setAuction(response.data.auction);
        });
    };
    callApi1();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const callApi2 = async () => {
        const bidID = auction.bids ? auction.bids.pop() : null;
        if (bidID) {
          const result = axios
            .get(`${baseUrl}/bids/${bidID}`)
            .then((response) => {
              setBid(response.data.bid);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      };
      const callApi3 = async () => {
        const sellerID = auction.user;
        const result = axios
          .get(`${baseUrl}/users/${sellerID}`)
          .then((response) => {
            setSeller(response.data.user);
          })
          .catch((error) => {
            res.status(500).json({ err });
          });
      };
      const callApi4 = async () => {
        auction.images?.map((image) => {
          let result = axios
            .get(`${baseUrl}/image/${image}`)
            .then((response) => {
              // const url = urls;
              // url.push({ url: response.config.url });
              // setUrls([...new Set(url)]);
              setUrls((lastState) => {
                let alreadyIn = false;
                let urlsArr = lastState;
                lastState.forEach((url) => {
                  if (url.url === response.config.url) {
                    alreadyIn = true;
                  }
                });
                if (!alreadyIn) {
                  urlsArr.push({ url: response.config.url });
                }
                return urlsArr;
              });
            })
            .catch((error) => {
              response.status(500).json({ err });
            });
        });
      };
      callApi2().then(() => {
        callApi3().then(() => {
          callApi4().then(() => {
            setLoad(true);
          });
        });
      });
    }
  }, [auction]);

  if (!load) return <Text>Loading...</Text>;

  return (
    <ScrollView
      ref={viewRef}
      onContentSizeChange={() => {
        viewRef.current.scrollToEnd({ animated: true });
      }}
    >
      <Slideshow dataSource={urls} height={400} />
      <View
        style={{
          marginBottom: keyboard ? windowHeight * 0.35 : 0,
          marginLeft: 15,
          marginRight: 15,
          paddingBottom: 40,
        }}
      >
        <View style={styles.secContainer}>
          <Text style={styles.title}>{auction.title}</Text>
          <View>
            <Text style={styles.title}>Seller</Text>
            <Text>{seller.fullName}</Text>
          </View>
        </View>
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
        <Text>{auction.startPrice}$</Text>
        <Text style={styles.secondaryTitle}>Current Bid</Text>
        {bid.amount ? (
          <Text>{bid.amount}$</Text>
        ) : (
          <Text>{auction.startPrice}$</Text>
        )}

        {offerBid ? (
          <View>
            <Bid bid={bid} auction={auction} onChangeBid={onChangeBidHandler} />
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
  secContainer: {
    flex: 1,
    flexDirection: "row",
  },
  title: {
    flex: 1,
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
  helper: {
    flex: 1,
  },
});

export default Auction;
