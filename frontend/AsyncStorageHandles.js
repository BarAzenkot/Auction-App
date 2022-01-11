import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (err) {
    console.log(error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token").then((res) => {
      return res;
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};

export const clearStorage = async () => {
  AsyncStorage.clear();
};

export const storeUserID = async (userID) => {
  try {
    await AsyncStorage.setItem("userID", userID);
  } catch (err) {
    console.log(error);
  }
};

export const getUserID = async () => {
  try {
    const userID = await AsyncStorage.getItem("userID").then((res) => {
      return res;
    });
    return userID;
  } catch (err) {
    console.log(err);
  }
};
