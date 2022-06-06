import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { windowHeight, windowWidth } from "../../Dimensions";

const TimeInput = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (timeInput) => {
    let date = timeInput.toString().split(" ").slice(1, 4).toString();
    let time = timeInput.toString().split(" ")[4].slice(0, 5);
    props.onChange(date + " | " + time, timeInput);

    hideDatePicker();
  };

  return (
    <View
      style={{
        ...styles.container,
        borderColor: props.error ? "red" : "black",
        backgroundColor: props.error ? "rgba(200, 150, 150, 0.7)" : "white",
      }}
    >
      <TouchableOpacity onPress={showDatePicker}>
        <Text
          style={{
            ...styles.input,
            color: props.timer.includes("hoose")
              ? `${props.error ? "white" : "grey"}`
              : "black",
          }}
        >
          {props.timer}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        // mode={props.clock ? "time" : "date"}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        // {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    fontSize: 24,
    margin: 10,
  },
});

export default TimeInput;
