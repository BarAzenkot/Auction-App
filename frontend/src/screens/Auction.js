import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Slideshow from "react-native-image-slider-show";
import Btn from "../components/Btn";
import Bid from "../components/Bid";
const axios = require("axios");

const Auction = (props) => {
  const [offerBid, setOfferBid] = useState(false);
  const onPressHandler = () => {
    setOfferBid(!offerBid);
  };
  const [amount, onChangeAmount] = useState(null);
  const [load, setLoad] = useState(false);
  const viewRef = useRef();
  const isInitialMount = useRef(true);

  const [auction, setAuction] = useState({});
  const [bid, setBid] = useState({});
  const [seller, setSeller] = useState({});
  const [urls, setUrls] = useState([]);

  var config = {
    method: "get",
    url: "localhost:8000/auctions/619cf29764797d624f5eb8e5",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjFjZjgxMDBhYTdiNTQ4NGE5ZjE1MiIsImVtYWlsIjoiYmFyQGdtYWlsLmNvbSIsImlhdCI6MTYzOTQxMzI1OCwiZXhwIjoxNjM5NDk5NjU4fQ.d-GmSYzsB0-ZC8cehgIicKAwy7RBj5nI7F4OUODahDQ",
    },
  };

  var config = {
    method: "get",
    url: "localhost:8000/bids/61b89cd82eb8822d1798d122",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjFjZjgxMDBhYTdiNTQ4NGE5ZjE1MiIsImVtYWlsIjoiYmFyQGdtYWlsLmNvbSIsImlhdCI6MTYzOTQ4NjE3MiwiZXhwIjoxNjM5NTcyNTcyfQ.tfqt70pBdD2D1kO4LrkKNm2tevEwgiCNS803r64yopc",
    },
  };

  useEffect(() => {
    const callApi1 = async () => {
      const result = axios
        .get(`http://192.168.250.1:8000/auctions/${props.route.params.id}`)
        .then((response) => {
          // console.log(JSON.stringify(response.data.auction));
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
            .get(`http://192.168.250.1:8000/bids/${bidID}`)
            .then((response) => {
              setBid(response.data.bid);
            });
        }
      };
      const callApi3 = async () => {
        const sellerID = auction.user;
        const result = axios
          .get(`http://192.168.250.1:8000/users/${sellerID}`)
          .then((response) => {
            setSeller(response.data.user);
          });
      };
      const callApi4 = async () => {
        auction.images?.map((image) => {
          let result = axios
            .get(`http://192.168.250.1:8000/image/${image}`)
            .then((response) => {
              // setImg({ uri: response.config.url });
              // setLoad(true);
              // urls.push({ uri: response.config.url });
              const url = urls;
              url.push({ url: response.config.url });
              setUrls(url);
              // setUrls([...urls, { url: response.config.url }]);
              // setLoad(true);

              console.log(urls);
            })
            .catch((error) => {
              // setLoad(true);
            });
        });
        // console.log(result);
      };
      callApi2().then(() => {
        callApi3().then(() => {
          callApi4().then(() => setLoad(true));
        });
      });
      // callApi2();
      // callApi3();
      // callApi4().then(() => setLoad(true));
    }
  }, [auction]);

  // useEffect(() => {
  //   const callApi4 = async () => {
  //     auction.images?.map((image) => {
  //       let result = axios
  //         .get(`http://192.168.250.1:8000/image/${image}`)
  //         .then((response) => {
  //           // setImg({ uri: response.config.url });
  //           // setLoad(true);
  //           // urls.push({ uri: response.config.url });
  //           const url = urls;
  //           url.push({ url: response.config.url });
  //           setUrls(url);
  //           // setUrls([...urls, { url: response.config.url }]);
  //           // setLoad(true);

  //           console.log(urls);
  //         })
  //         .catch((error) => {
  //           // setLoad(true);
  //         });
  //     });
  //     // console.log(result);
  //   };
  //   // console.log(auction.images[0]);

  //   // console.log(image);
  //   callApi(); /*.then(setLoad(true));*/
  // }, [auction]);

  if (!load) return <Text>Loading...</Text>;

  return (
    <ScrollView
      ref={viewRef}
      onContentSizeChange={() => {
        viewRef.current.scrollToEnd({ animated: true });
      }}
    >
      <Slideshow dataSource={urls} height={400} />
      <View style={styles.container}>
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
        <Text>{auction.startPrice}</Text>
        <Text style={styles.secondaryTitle}>Current Bid</Text>
        <Text>{bid.amount}</Text>
        {offerBid ? (
          <View>
            <Bid bid={bid} />
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
