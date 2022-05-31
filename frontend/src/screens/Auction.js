import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Keyboard } from "react-native";
import Slideshow from "react-native-image-slider-show";
import Btn from "../components/Btn";
import Bid from "../components/Bid";
import ShadowBid from "../components/ShadowBid";
import { windowWidth, windowHeight } from "../../Dimensions";
import { getUserID } from "../../AsyncStorageHandles";
import Loading from "./Loading";
// import user from "../../../backend/api/models/user";
const axios = require("axios");
const baseUrl = "http://192.168.1.67:8000";
const baseUrlAlternate = "http://10.100.102.12:8000";

const Auction = (props) => {
  const [load, setLoad] = useState(false);
  const viewRef = useRef();
  const isInitialMount = useRef(true);
  const [auction, setAuction] = useState({});
  const [bid, setBid] = useState({});
  const [seller, setSeller] = useState({});
  const [urls, setUrls] = useState([]);
  const [offerBid, setOfferBid] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [user, setUser] = useState("");
  const startDate = new Date(auction.startDate);
  const endDate = new Date(auction.endDate);
  const currDate = new Date();
  const listener = useRef();

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

  useEffect(() => {
    const callApi1 = () => {
      const result = axios
        .get(`${baseUrl}/auctions/${props.route.params.id}`)
        .then((response) => {
          setAuction(response.data.auction);
        });
    };
    callApi1();

    getUserID().then((userID) => {
      setUser(userID);
    });
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
        console.log("Seller ID: ", sellerID);
        const result = axios
          .get(`${baseUrl}/users/${sellerID}`)
          .then((response) => {
            setSeller(response.data.user);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      const callApi4 = async () => {
        auction.images?.map((image) => {
          console.log("THIS IS IMAGE: ", image);
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
              urls.length === auction.images.length && setLoad(true);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      };

      callApi2().then(() => {
        callApi3().then(() => {
          callApi4();
        });
      });
    }
  }, [auction]);

  useEffect(() => {
    const result = axios
      .get(`${baseUrl}/auctions/${props.route.params.id}`)
      .then((response) => {
        setAuction(response.data.auction);
      });

    getUserID().then((userID) => {
      console.log(userID);
      setUser(userID);
    });
  }, []);

  // useEffect(async () => {
  //   const result = axios
  //     .get(`${baseUrl}/auctions/${props.route.params.id}`)
  //     .then((response) => {
  //       setAuction(response.data.auction);
  //     })
  //     .then(() => {
  //       getUserID().then((userID) => {
  //         console.log(userID);
  //         setUser(userID);
  //         console.log(user);
  //       });

  //       if (isInitialMount.current) {
  //         isInitialMount.current = false;
  //       } else {
  //         const bidID = auction.bids ? auction.bids.pop() : null;
  //         if (bidID) {
  //           const result = axios
  //             .get(`${baseUrl}/bids/${bidID}`)
  //             .then((response) => {
  //               setBid(response.data.bid);
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //             });
  //         }

  //         const sellerID = auction.user;
  //         console.log("Seller ID: ", sellerID);
  //         const result = axios
  //           .get(`${baseUrl}/users/${sellerID}`)
  //           .then((response) => {
  //             setSeller(response.data.user);
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //           });

  //         auction.images?.map((image) => {
  //           console.log("THIS IS IMAGE: ", image);
  //           let result = axios
  //             .get(`${baseUrl}/image/${image}`)
  //             .then((response) => {
  //               // const url = urls;
  //               // url.push({ url: response.config.url });
  //               // setUrls([...new Set(url)]);
  //               setUrls((lastState) => {
  //                 let alreadyIn = false;
  //                 let urlsArr = lastState;
  //                 lastState.forEach((url) => {
  //                   if (url.url === response.config.url) {
  //                     alreadyIn = true;
  //                   }
  //                 });
  //                 if (!alreadyIn) {
  //                   urlsArr.push({ url: response.config.url });
  //                 }
  //                 return urlsArr;
  //               });
  //               urls.length === auction.images.length && setLoad(true);
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //             });
  //         });
  //       }
  //     });
  // }, [auction]);

  // useEffect(() => {
  //   urls.length > 0 && setLoad(true);
  // }, [urls]);

  // console.log(auction);

  if (!load) return <Loading />;

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
        <Text>{startDate.toLocaleDateString()}</Text>
        <Text style={styles.secondaryTitle}>End Date</Text>
        <Text>{endDate.toLocaleDateString()}</Text>
        <View style={styles.hr} />
        <Text style={styles.secondaryTitle}>Start Bid</Text>
        <Text>{auction.startPrice}$</Text>
        {currDate.getTime() > startDate.getTime() && (
          <View>
            <Text style={styles.secondaryTitle}>Current Bid</Text>
            {/*HERE WE SHOULD CHANGE*/}
            {bid.amount ? (
              <Text>{bid.amount}$</Text>
            ) : (
              <Text>{auction.startPrice}$</Text>
            )}
          </View>
        )}
        {seller._id !== user ? (
          <View>
            {currDate.getTime() < startDate.getTime() ? (
              <View>
                {offerBid ? (
                  <View>
                    <ShadowBid
                      bid={bid}
                      auction={auction}
                      onChangeBid={onChangeBidHandler}
                      seller={seller._id}
                      signedInUser={props.route.params.signedInUser}
                      user={user}
                    />
                    <Btn
                      onPress={onPressHandler}
                      title="Close"
                      color="dimgrey"
                    />
                  </View>
                ) : (
                  <Btn
                    onPress={onPressHandler}
                    title="Offer a Shadow Bid"
                    color="dimgrey"
                  />
                )}
              </View>
            ) : (
              <View>
                {offerBid ? (
                  <View>
                    <Bid
                      bid={bid}
                      auction={auction}
                      onChangeBid={onChangeBidHandler}
                      seller={seller._id}
                      signedInUser={props.route.params.signedInUser}
                      user={user}
                    />
                    <Btn onPress={onPressHandler} title="Close" />
                  </View>
                ) : (
                  <Btn onPress={onPressHandler} title="Offer a Bid" />
                )}
              </View>
            )}
          </View>
        ) : (
          <View>
            {currDate.getTime() < startDate.getTime() && (
              <View>
                <View style={styles.hr} />
                <Text style={styles.secondaryTitle}>
                  Number Of Shadow Offers
                </Text>
                <Text>{auction.bids.length + 1}</Text>
              </View>
            )}
          </View>
        )}
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
