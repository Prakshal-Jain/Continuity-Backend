import AsyncStorage from '@react-native-async-storage/async-storage';
// CRUD on storage.
// https://react-native-async-storage.github.io/async-storage/docs/api


const set = async (key, value) => {
  try {
    const v = (value instanceof String) ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, v);
    return true;
  } catch (e) {
    return false;
    // saving error
  }
}

const get = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
    // error reading value
  }
}

const remove = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    // remove error
    return false;
  }
}

export const clearAll = async () => {
  try {
    await AsyncStorage.clear()
    return true;
  } catch (e) {
    // clear error
    return false;
  }

  // console.log('Done.')
}

export default { set, get, remove, clearAll };