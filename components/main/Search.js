import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import firebase from "firebase";
require("firebase/firestore");

function Search(props) {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  return (
    <View style={styles.view}>
      <TextInput
        style={styles.inputStyle}
        placeholder="Type here ..."
        onChangeText={(search) => fetchUsers(search)}
      />

      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Search;

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 16,
    backgroundColor: "#fff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    marginTop: 5,
    marginBottom: 10,
    color: "#040707",
    paddingRight: 30,
  },
  view: {
    marginTop: 15,
    padding: 15,
  },
});
