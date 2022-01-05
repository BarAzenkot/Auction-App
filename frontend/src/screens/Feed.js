import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import FeedItem from "../components/FeedItem";
import axios from "axios";
const baseUrl = "http://192.168.0.84:8000";

const Feed = (props) => {
  // const [feedItems, setFeedItems] = useState([
  //   {
  //     _id: "619cf29764797d624f5eb8e5",
  //     title: "Apple Iphone Pro",
  //     description:
  //       "Iphone 12 Pro Max, 256GB, Black, kfnetjlf wfjergb 4gmbj 13hr 3n4ioghnwrljvw;kwf jeighq u 2rufgb13 trwvhwu wl mrrh wetigj wtn mwirptj gh 35;glkjhv wee3i hbuskfn letjgtuo ehpj",
  //     startDate: "2022-02-01T00:00:00.000Z",
  //     endDate: "2022-02-01T00:00:00.000Z",
  //     startPrice: 500,
  //     images: [],
  //     __v: 15,
  //     category: "electronics",
  //     bids: [
  //       "619e896ba43ce44ac09b3315",
  //       "619e8971a43ce44ac09b331a",
  //       "619e8975a43ce44ac09b331f",
  //       "61a8ce4a1964290b37dc601e",
  //       "61ac9bfe3e973a2988b1f612",
  //       "61ac9c40b75771be3fc18be8",
  //       "61ac9c678ef2ac87a5507f98",
  //       "61ac9cde58e40a020a36d9d2",
  //       "61aca5a9aad33dcead843184",
  //       "61aca5baaad33dcead843189",
  //       "61aca5c0aad33dcead84318e",
  //       "61aca5c4aad33dcead843193",
  //       "61aca5c9aad33dcead843198",
  //       "61aca7ad12c1d1f0eea703ed",
  //       "61aca814252cd107908ddf25",
  //     ],
  //   },
  //   {
  //     _id: "61a35749d4e0a894b242d33f",
  //     title: "Pokemon Card2",
  //     description: "Piccachu2",
  //     startDate: "2021-12-01T00:00:00.000Z",
  //     endDate: "2022-01-01T00:00:00.000Z",
  //     startPrice: 50,
  //     category: "Collections",
  //     images: [],
  //     bids: [],
  //     __v: 0,
  //   },
  //   {
  //     _id: "61a35873e87aa73138ae022e",
  //     title: "Pokemon Card3",
  //     description: "Piccachu3",
  //     startDate: "2021-12-01T00:00:00.000Z",
  //     endDate: "2022-01-01T00:00:00.000Z",
  //     startPrice: 50,
  //     category: "Collections",
  //     images: [],
  //     bids: [],
  //     __v: 0,
  //   },
  //   {
  //     _id: "61ae05fee96bf1cc6a8cb982",
  //     title: "check4",
  //     description: "check4",
  //     startDate: "2022-01-01T00:00:00.000Z",
  //     endDate: "2022-02-01T00:00:00.000Z",
  //     startPrice: 100,
  //     category: "collections",
  //     images: [
  //       "uploads/1638794750924-mewtwo.jpg",
  //       "uploads/1638794750924-peugeot.jpg",
  //     ],
  //     bids: [],
  //     user: "61a758db1105dfeed51745c4",
  //     __v: 0,
  //   },
  // ]);
  const [feedItems, setFeedItems] = useState([]);

  const onPressHandler = (input) => {
    props.navigation.navigate("Auction", input);
  };
  // const config = {
  //   method: "get",
  //   url: `${baseUrl}/auctions`,
  //   // headers: {
  //   //   Authorization:
  //   //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjFjZjgxMDBhYTdiNTQ4NGE5ZjE1MiIsImVtYWlsIjoiYmFyQGdtYWlsLmNvbSIsImlhdCI6MTYzOTMyMjU2NCwiZXhwIjoxNjM5NDA4OTY0fQ.EERb7SwB1abgeJA9ThL3MIcCZInD5lcXZ8nG-kUsj4c",
  //   // },
  // };
  // const result = axios(config)
  //   .then((response) => {
  //     console.log("herererere");
  //     console.log(response);
  //     // setFeedItems(response.data.auctions);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });

  // axios.get(`${baseUrl}/auctions`).then((response) => {
  //   console.log(res.data);
  // });

  // var config = {
  //   method: "get",
  //   url: "192.168.250.1:8000/auctions",
  //   headers: {},
  // };

  // axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });

  useEffect(() => {
    const callApi = () => {
      const result = axios
        .get(`${baseUrl}/auctions/`)
        .then((response) => setFeedItems(response.data.auctions));
    };
    callApi();
  }, [`${baseUrl}/auctions`]);

  return (
    <ScrollView style={styles.container}>
      <View>
        {feedItems?.map((item) => (
          <FeedItem
            onPress={onPressHandler}
            id={item._id}
            key={item._id}
            title={item.title}
            description={item.description}
            image={item.images[0] ? item.images[0] : null}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});

export default Feed;
