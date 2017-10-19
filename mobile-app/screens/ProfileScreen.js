import React from 'react';
import { Image, Button, StyleSheet, Text, View } from 'react-native';
import { AuthSession } from 'expo';
import firebase from 'firebase';

const FB_APP_ID = '672636582940821';

export default class ProfileScreen extends React.Component {
  state = {
    userInfo: null,
  };

    async loginWithFacebook() {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
        '672636582940821',
        { permissions: ['public_profile'] }
      );

      if (type === 'success') {
        // Build Firebase credential with the Facebook access token.
        const credential = firebase.auth().FacebookAuthProvider.credential(token);

        firebase.auth().currentUser.link(credential).then(function(user) {
          console.log("Account linking success", user);
        }, function(error) {
          console.log("Account linking error", error);
        });
        firebase.auth().signInWithCredential(credential).catch((error) => {
          console.log("Account sign", error);
        });
      }
    }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {!this.state.userInfo ? (
            <View>
            <Button title="Connect to Facebook" onPress={this.loginWithFacebook} />
          <Button title="Open Google Auth" onPress={this.loginWithFacebook} />
          </View>
        ) : (
          this._renderUserInfo()
        )}
      </View>
    );
  }

  _renderUserInfo = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: this.state.userInfo.picture.data.url }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ fontSize: 20 }}>{this.state.userInfo.name}</Text>
        <Text>ID: {this.state.userInfo.id}</Text>
      </View>
    );
  };

  _handlePressAsync = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();

    // You need to add this url to your authorized redirect urls on your Facebook app
    console.log({ redirectUrl });

    // NOTICE: Please do not actually request the token on the client (see:
    // response_type=token in the authUrl), it is not secure. Request a code
    // instead, and use this flow:
    // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
    // The code here is simplified for the sake of demonstration. If you are
    // just prototyping then you don't need to concern yourself with this and
    // can copy this example, but be aware that this is not safe in production.

    let result = await AuthSession.startAsync({
      authUrl:
        `https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
        `&client_id=${FB_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
    });

    if (result.type !== 'success') {
      alert('Uh oh, something went wrong');
      return;
    }

    let accessToken = result.params.access_token;
    let userInfoResponse = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,picture.type(large)`
    );
    const userInfo = await userInfoResponse.json();
    this.setState({ userInfo });
  };
}
