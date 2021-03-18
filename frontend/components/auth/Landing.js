import React from "react";
import { Text, View, Dimensions } from "react-native";
import { Button } from 'native-base';
import colors from '../colors';

export default function Landing({ navigation }) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: Dimensions.get('screen').height / 3 }}>
      <Button bordered dark
        style={{
          flex: 1,
          marginRight: 10,
          marginLeft: 5,
          justifyContent: 'center',
          height: 30,
          marginTop: 10
        }} title="Following" onPress={() => navigation.navigate("Register")} >
        <Text style={{ color: colors.lightBlue }}>Register</Text>
      </Button>
      <Button bordered
        style={{
          flex: 1,
          marginRight: 10,
          marginLeft: 5,
          justifyContent: 'center',
          height: 30,
          marginTop: 10,
          color: colors.lightRed,
        }} onPress={() => navigation.navigate("Login")} >
        <Text style={{ color: colors.lightRed }}>Login</Text>
      </Button>
    </View>
  );
}
