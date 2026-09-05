import { useAuth, useClerk } from "@clerk/expo";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  //   const { startHostedAuth, signOut } = useHostedAuth();
  const { signOut: signOutClerk } = useClerk();

  const handleSignUp = async () => {
    try {
      //   await startHostedAuth({ mode: "sign-up" });
      router.replace("/(auth)/sign-up");
    } catch (error) {
      // Handle the error in your app.
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutClerk();
      // Redirect to your desired page
      router.replace("/(auth)/sign-in");
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isSignedIn ? (
        <>
          <Text>You're signed in</Text>
          <Pressable onPress={handleSignOut}>
            <Text>Sign out</Text>
          </Pressable>
        </>
      ) : (
        <Button title="Sign up" onPress={handleSignUp} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
