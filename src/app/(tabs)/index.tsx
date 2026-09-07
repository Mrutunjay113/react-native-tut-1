import { useAuth, useClerk } from "@clerk/expo";

import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  //   const { startHostedAuth, signOut } = useHostedAuth();
  const { signOut: signOutClerk } = useClerk();

  const handleSignUp = async () => {
    try {
      //   await startHostedAuth({ mode: "sign-up" });
      router.replace("/sign-in");
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
      <View
        style={{
          flex: 1,
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isSignedIn ? (
        <Text>
          You're signed in
          <Pressable onPress={handleSignOut}>
            <Text>Sign out</Text>
          </Pressable>
        </Text>
      ) : (
        <Text>You're not signed in</Text>
      )}
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     gap: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
