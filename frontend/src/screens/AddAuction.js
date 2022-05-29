import React, { useState } from "react";
import { Button, View } from "react-native";
import AuthInput from "../components/AuthInput";
import DatePicker from "react-native-date-picker";

const AddAuction = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [endOpen, setEndOpen] = useState(false);
  const [startPrice, setStartPrice] = useState();
  const [category, setCategory] = useState("");
  const [imgs, setImgs] = useState([]);

  return (
    <View>
      <AuthInput
        placeholder="Title"
        placeholderTextColor="grey"
        returnKeyType="done"
        onChangeText={(input) => setTitle(input)}
      />
      <AuthInput
        placeholder="Description"
        placeholderTextColor="grey"
        returnKeyType="done"
        onChangeText={(input) => setDescription(input)}
      />
      <Button title="Open" onPress={() => setStartOpen(true)} />
      <DatePicker
        modal
        open={startOpen}
        date={startDate}
        onConfirm={() => {
          setStartOpen(false);
          setStartDate(date);
        }}
        onCancel={() => setStartOpen(false)}
      />
      <Button title="Open" onPress={() => setEndOpen(true)} />
      <DatePicker
        modal
        open={endOpen}
        date={endDate}
        onConfirm={() => {
          setEndOpen(false);
          setEndDate(date);
        }}
        onCancel={() => setEndOpen(false)}
      />
    </View>
  );
};

export default AddAuction;
