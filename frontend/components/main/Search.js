import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import colors from '../colors';
import images from '../../res/images';
import { Button } from 'native-base';

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
    <ScrollView style={styles.view}>
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
          <TouchableOpacity style={styles.container}
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }>
            <View style={styles.nameContainer}>
              <Image
                source={{ uri: 'https://picsum.photos/300' }}
                style={styles.personImage}
              />
              <View>
                <Text style={styles.personName}> {item.name} </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
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
  container: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 6,
    marginStart: 10,
    marginEnd: 10,
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  personImage: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  personName: {
    color: colors.text,
    marginStart: 10,
    fontWeight: 'bold',
  },
  placeName: {
    color: colors.text,
    marginStart: 10,
    fontSize: 12,
  },
  iconMore: {
    height: 15,
    width: 15,
  },
});
