import React, { Component } from "react";
import {
  View,
  Button,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Loader from "../Loader";

import firebase from "firebase";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loading: false,
    };
    this.onSignUp = this.onSignUp.bind(this);
  }
  onSignUp() {
    const { email, password } = this.state;
    this.setState({ loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Loader loading={this.state.loading} />
        <View style={styles.view}>
          <TextInput
            style={styles.inputStyle}
            placeholder="email"
            onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="password"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
          />
          <Button title="Sign In" onPress={() => this.onSignUp()} />
        </View>
      </SafeAreaView>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: "#50bbb2",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
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
  button: {
    marginTop: 15,
    backgroundColor: "#040707",
  },
  view: {
    marginTop: 15,
    padding: 15,
  },
});
