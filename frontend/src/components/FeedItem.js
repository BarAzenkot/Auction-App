import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import axios from "axios";
import Btn from "../components/Btn";
const baseUrl = "https://192.168.250.1:8000";

const FeedItem = (props) => {
  const [Item, setItem] = useState({});
  const [img, setImg] = useState(require("../../assets/not-found.jpg"));
  const [load, setLoad] = useState(false);
  const onPressHandler = () => {
    props.onPress({
      id: props.id,
    });
  };

  const fetchUser = () => {
    var data = "";

    const config = {
      method: "get",
      url: `localhost:8000/auctions/${props.id}`,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjFjZjgxMDBhYTdiNTQ4NGE5ZjE1MiIsImVtYWlsIjoiYmFyQGdtYWlsLmNvbSIsImlhdCI6MTYzOTQxMzI1OCwiZXhwIjoxNjM5NDk5NjU4fQ.d-GmSYzsB0-ZC8cehgIicKAwy7RBj5nI7F4OUODahDQ",
      },
    };

    axios(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {});
  };
  useEffect(() => {
    const callApi = async () => {
      if (props.image) {
        console.log(props.image);
        const result = axios
          .get(`http://192.168.250.1:8000/image/${props.image}`)
          .then((response) => {
            setImg({ uri: response.config.url });
            setLoad(true);
          })
          .catch((error) => {
            setLoad(true);
          });
      }
    };
    callApi();
  }, []);
  // console.log(props.image);
  // console.log();

  // const imgAddress = props.image
  //   ? require("../../../backend/uploads/1638794750924-mewtwo.jpg")
  //   : require("../../assets/not-found.jpg");
  // console.log(imgAddress);

  // setImg(props.image ? props.image : "../../assets/not-found.jpg");
  // console.log(`${img}`);

  if (!load) return <Text>Loading...</Text>;

  return (
    <TouchableOpacity onPress={onPressHandler} style={styles.container}>
      <Image style={styles.stretch} source={img} />
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.description}>{props.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    margin: 10,
    padding: 5,
  },
  stretch: {
    width: 380,
    height: 380,
    resizeMode: "stretch",
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 5,
  },
});

export default FeedItem;
