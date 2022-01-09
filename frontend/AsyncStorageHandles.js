import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
    console.log();
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
    return "ERROR";
  }
};

export const removeToken = async () => {
  AsyncStorage.clear();
};
