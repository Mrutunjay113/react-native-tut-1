import ListHeroCard from "@/components/list/ListHeroCard";
import PendingItemCard from "@/components/list/PendingItemCard";
import TabScreenBackground from "@/components/TabScreenBackground";
import { useGroceryStore } from "@/store/grocery-store";
import { useAuth, useClerk } from "@clerk/expo";

import { router } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import CompletedItems from "./CompletedItems";

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  //   const { startHostedAuth, signOut } = useHostedAuth();
  const { signOut: signOutClerk } = useClerk();
  const { items } = useGroceryStore();
  const pendingItems = items.filter((item) => !item.purchased);
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
    // <ScrollView
    //   className="flex-1 bg-background py-4"
    //   contentContainerStyle={{ padding: 16, gap: 12 }}
    // >
    //   <TabScreenBackground />
    //   <ListHeroCard />{" "}
    //   <View className="flex-row items-center justify-between px-1">
    //     <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
    //       Shopping items
    //     </Text>
    //     <Text className="text-sm text-muted-foreground">
    //       {pendingItems.length} active
    //     </Text>
    //   </View>{" "}
    //   {pendingItems.map((item) => (
    //     <PendingItemCard key={item.id} item={item} />
    //   ))}
    //   <CompletedItems />
    // </ScrollView>  <FlatList
    <FlatList
      className="flex-1 bg-background "
      data={pendingItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PendingItemCard item={item} />}
      contentContainerStyle={{ padding: 20, gap: 14 }}
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View style={{ gap: 14, paddingTop: 20 }}>
          <TabScreenBackground />
          <ListHeroCard />
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
              Shopping items
            </Text>
            <Text className="text-sm text-muted-foreground">
              {pendingItems.length} active
            </Text>
          </View>
        </View>
      }
      ListFooterComponent={<CompletedItems />}
    />
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
