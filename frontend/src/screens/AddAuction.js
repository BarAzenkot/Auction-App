import React, { useState, useEffect } from "react";
import { Button, View, StyleSheet } from "react-native";
import { windowWidth, windowHeight } from "../../Dimensions";
import { ImageBrowser } from "../components/ImageBrowser";
import AuthInput from "../components/AuthInput";
import DatePicker from "react-native-date-picker";
import TimeInput from "../components/TimeImput";
import * as ImagePicker from "expo-image-picker";

const AddAuction = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("Choose Start Date");
  const [startTime, setStartTime] = useState("Choose Start Time");
  const [startOpen, setStartOpen] = useState(false);
  const [endDate, setEndDate] = useState("Choose End Date");
  const [endTime, setEndTime] = useState("Choose End Time");
  const [endOpen, setEndOpen] = useState(false);
  const [startPrice, setStartPrice] = useState();
  const [category, setCategory] = useState("");
  const [imgs, setImgs] = useState([]);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

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

    console.log(result);

    if (!result.cancelled) {
      setImgs(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <AuthInput
        placeholder="Title"
        placeholderTextColor="grey"
        returnKeyType="done"
        onChangeText={(input) => setTitle(input)}
      />
      <AuthInput
        placeholder="Category"
        placeholderTextColor="grey"
        returnKeyType="done"
        onChangeText={(input) => setCategory(input)}
      />
      <AuthInput
        placeholder="Description"
        placeholderTextColor="grey"
        returnKeyType="done"
        onChangeText={(input) => setDescription(input)}
      />
      <AuthInput
        placeholder="Start Price ($)"
        placeholderTextColor="grey"
        returnKeyType="done"
        keyboardType="number-pad"
        onChangeText={(input) => setStartPrice(new Number(input))}
      />
      <TimeInput timer={startDate} onChange={(input) => setStartDate(input)} />
      <TimeInput
        clock
        timer={startTime}
        onChange={(input) => setStartTime(input)}
      />
      <TimeInput timer={endDate} onChange={(input) => setEndDate(input)} />
      <TimeInput
        clock
        timer={endTime}
        onChange={(input) => setEndTime(input)}
      />
      {(hasGalleryPermission === false || hasGalleryPermission === false) && (
        <Text>No access to gallery</Text>
      )}
      <Button
        title="Pick Image From Gallery"
        onPress={() => pickImage()}
      ></Button>
      {/* <ImageBrowser
        max={4}
        onChange={(num, onSubmit) => {}}
        callback={(callback) => {
          setImgs(callback);
        }}
      /> */}
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
});

export default AddAuction;
