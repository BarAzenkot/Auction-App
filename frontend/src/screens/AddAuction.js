import React, { useState, useEffect, useRef } from "react";
import { Button, View, StyleSheet, Text, Image } from "react-native";
import { windowWidth, windowHeight } from "../../Dimensions";
import AuthInput from "../components/AuthInput";
import DatePicker from "react-native-date-picker";
import TimeInput from "../components/TimeImput";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Btn from "../components/Btn";
import axios from "axios";
// import * as RNFS from "react-native-fs";
const baseUrl = "http://192.168.31.95:8000";
import { getToken, getUserID } from "../../AsyncStorageHandles";
const tokenize = async () => {
  return await getToken();
};
// import FormData from "form-data";

const AddAuction = () => {
  const [title, setTitle] = useState("");
  const [titleValid, setTitleValid] = useState(true);
  const [description, setDescription] = useState("");
  const [descriptionValid, setDescriptionValid] = useState(true);
  const [startDate, setStartDate] = useState("Choose Start Date");
  const [actualStartDate, setActualStartDate] = useState(null);
  const [startDateValid, setStartDateValid] = useState(true);
  const [endDate, setEndDate] = useState("Choose End Date");
  const [actualEndDate, setActualEndDate] = useState(null);
  const [endDateValid, setEndDateValid] = useState(true);
  const [startPrice, setStartPrice] = useState(0);
  const [startPriceValid, setStartPriceValid] = useState(true);
  const [category, setCategory] = useState("");
  const [categoryValid, setCategoryValid] = useState(true);
  const [imgs, setImgs] = useState([]);
  const [imgsValid, setImgsValid] = useState(true);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [imgIcon, setImgIcon] = useState(require("../../assets/picture.png"));
  const [calendarIcon, setCalendarIcon] = useState(
    require("../../assets/calendar.png")
  );
  const [clockIcon, setClockIcon] = useState(require("../../assets/clock.png"));

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
      // if (galleryStatus.status !== "granted") {
      //   alert("Sorry, there is no permission");
      // }
    })();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImgs((prevState) => [...prevState, result.uri]);
    }
  };

  const onSubmit = async () => {
    let valid = true;
    setDescriptionValid(true);
    setTitleValid(true);
    setCategoryValid(true);
    setStartPriceValid(true);
    setStartDateValid(true);
    setEndDateValid(true);

    if (description.length < 3) {
      setDescriptionValid(false);
      valid = false;
    }
    if (title.length < 3) {
      setTitleValid(false);
      valid = false;
    }
    if (category.length < 3) {
      setCategoryValid(false);
      valid = false;
    }
    if (startPrice < 1) {
      setStartPriceValid(false);
      valid = false;
    }
    if (startDate.includes("hoose")) {
      setStartDateValid(false);
      valid = false;
    } else if (actualStartDate < new Date()) {
      setStartDateValid(false);
      valid = false;
    }
    if (endDate.includes("hoose")) {
      setEndDateValid(false);
      valid = false;
    } else if (actualEndDate < actualStartDate) {
      setEndDateValid(false);
      valid = false;
    }

    if (valid) {
      const userID = await getUserID();
      let formData = {
        title: title,
        description: description,
        startDate: actualStartDate,
        endDate: actualEndDate,
        startPrice: startPrice,
        category: category,
        images: imgs,
      };

      let data = new FormData();

      data.append("title", title);
      data.append("description", description);
      data.append("startDate", actualStartDate);
      data.append("endDate", actualEndDate);
      data.append("startPrice", startPrice);
      data.append("category", category);
      data.append("images", {
        name: new Date() + "_image",
        uri: imgs[0],
        type: "image/jpg",
      });

      console.log(data._parts.map((item) => item[0]));

      tokenize().then((token) => {
        console.log("THIS IS TOKEN: " + token);
        axios
          .post(`${baseUrl}/auctions`, {
            // headers: {
            //   Authorization: `Bearer ${token}`,
            //   // "Content-Type": "multipart/form-data",
            // },
            body: formData,
            user: userID,
          })
          .then((response) => console.log(JSON.stringify(response.data)))
          .catch((err) => console.log(err));
      });
    }
  };

  return (
    <View style={styles.container}>
      <AuthInput
        placeholder="Title"
        placeholderTextColor={titleValid ? "grey" : "white"}
        returnKeyType="done"
        onChangeText={(input) => setTitle(input)}
        error={!titleValid}
      />
      <AuthInput
        placeholder="Category"
        placeholderTextColor={categoryValid ? "grey" : "white"}
        returnKeyType="done"
        onChangeText={(input) => setCategory(input)}
        error={!categoryValid}
      />
      <AuthInput
        placeholder="Description"
        placeholderTextColor={descriptionValid ? "grey" : "white"}
        returnKeyType="done"
        onChangeText={(input) => setDescription(input)}
        error={!descriptionValid}
      />
      <AuthInput
        placeholder="Start Price ($)"
        placeholderTextColor={startPriceValid ? "grey" : "white"}
        returnKeyType="done"
        keyboardType="number-pad"
        onChangeText={(input) => setStartPrice(parseInt(input))}
        error={!startPriceValid}
      />
      <TimeInput
        timer={startDate}
        onChange={(input, date) => {
          setStartDate(input);
          setActualStartDate(new Date(date));
        }}
        placeholderTextColor={startDateValid ? "grey" : "white"}
        error={!startDateValid}
      />
      {/* <TimeInput
        clock
        timer={startTime}
        onChange={(input) => setStartTime(input)}
      /> */}
      <TimeInput
        timer={endDate}
        onChange={(input, date) => {
          setEndDate(input);
          setActualEndDate(new Date(date));
        }}
        placeholderTextColor={endDateValid ? "grey" : "white"}
        error={!endDateValid}
      />
      {/* <TimeInput
        clock
        timer={endTime}
        onChange={(input) => setEndTime(input)}
      /> */}
      {(hasGalleryPermission === false || hasGalleryPermission === false) && (
        <Text>No access to gallery</Text>
      )}
      <TouchableOpacity style={styles.imgSelect} onPress={() => pickImage()}>
        {true && (
          <View style={styles.wrapper}>
            <Text
              style={{
                ...styles.text,
                color: imgs.length === 0 ? "grey" : "rgb(100, 220, 100)",
              }}
            >
              {imgs.length === 0 ? "Select Main Image" : "Choose Another"}
            </Text>
            <Image source={imgIcon} />
          </View>
        )}
      </TouchableOpacity>
      <Btn title="Submit" onPress={onSubmit}></Btn>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: windowHeight * 0.2,
    marginLeft: windowWidth * 0.1,
    backgroundColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: windowWidth * 0.8,
  },
  imgSelect: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    // flexDirection: "row",
    // alignItems: "center",
  },
  text: {
    flex: 2,
    fontSize: 24,
  },
  wrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export default AddAuction;
