import {
  GroceryCategory,
  GroceryPriority,
  useGroceryStore,
} from "@/store/grocery-store";
import {
  Bolt,
  BriefcaseMedical,
  Compass,
  CrownIcon,
  Earth,
  LeafIcon,
  PackageIcon,
  Plus,
  ShoppingBag,
  Tag,
} from "lucide-react-native";

import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const categories: GroceryCategory[] = [
  GroceryCategory.Produce,
  GroceryCategory.Dairy,
  GroceryCategory.Bakery,
  GroceryCategory.Pantry,
  GroceryCategory.Snacks,
];
const priorities: GroceryPriority[] = [
  GroceryPriority.low,
  GroceryPriority.medium,
  GroceryPriority.high,
];

const categoryIcons = {
  [GroceryCategory.Produce]: LeafIcon,
  [GroceryCategory.Dairy]: CrownIcon,
  [GroceryCategory.Bakery]: BriefcaseMedical,
  [GroceryCategory.Pantry]: PackageIcon,
  [GroceryCategory.Snacks]: Earth,
};

const PlannerFormCard = () => {
  const { error, addItem } = useGroceryStore();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState<GroceryCategory>(
    GroceryCategory.Produce,
  );
  const [priority, setPriority] = useState<GroceryPriority>(
    GroceryPriority.medium,
  );

  const canCreate = name.trim().length > 0;

  const handleQuantityChange = (value: string) => {
    // this regex is used to remove all non-numeric characters from the input
    setQuantity(value.replace(/[^0-9]/g, ""));
  };

  const createItem = async () => {
    await addItem({
      name: name.trim(),
      category,
      priority,
      quantity: Number(quantity),
    });

    // optional
    // Alert.alert("Success", "Item created");

    // reset our form
    setName("");
    setQuantity("1");
    setCategory(GroceryCategory.Produce);
    setPriority(GroceryPriority.medium);
  };

  return (
    <View className="rounded-3xl border border-border bg-card p-4">
      {/* NAME */}
      <Text className="text-sm font-semibold text-foreground">Item name</Text>
      <View className="mt-2 flex-row items-center rounded-2xl border border-border bg-muted px-4 py-3">
        <ShoppingBag size={13} color="#5b7567" />
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex: Blueberries"
          className="ml-3 flex-1 text-base text-foreground"
          placeholderTextColor="#8aa397"
        />
      </View>

      {/* QUANTITY */}
      <Text className="mt-4 text-sm font-semibold text-foreground">
        Quantity
      </Text>
      <View className="mt-2 flex-row items-center rounded-2xl border border-border bg-muted px-4 py-3">
        <Tag size={13} color="#5b7567" />
        <TextInput
          value={quantity}
          onChangeText={handleQuantityChange}
          keyboardType="number-pad"
          placeholder="1"
          placeholderTextColor="#8aa397"
          className="ml-3 flex-1 text-base text-foreground"
        />
      </View>

      {/* CATEGORIES */}
      <Text className="mt-4 text-sm font-semibold text-foreground">
        Category
      </Text>
      <View className="mt-2 flex-row flex-wrap gap-2">
        {categories.map((option) => {
          const active = option === category;
          const Icon = categoryIcons[option] as React.ElementType;
          return (
            <Pressable
              key={option}
              onPress={() => setCategory(option)}
              className={`flex-row items-center rounded-full px-4 py-2 ${
                active ? "bg-primary" : "bg-secondary"
              }`}
            >
              <Icon size={12} color={active ? "#fff" : "#486856"} />
              <Text
                className={`ml-2 text-sm font-semibold ${
                  active
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* PRIORITY */}
      <Text className="mt-4 text-sm font-semibold text-foreground">
        Priority
      </Text>
      <View className="mt-2 flex-row gap-2">
        {priorities.map((option) => {
          const active = option === priority;
          const Icon =
            option === GroceryPriority.high
              ? (Bolt as React.ElementType)
              : option === GroceryPriority.medium
                ? (Compass as React.ElementType)
                : (LeafIcon as React.ElementType);

          return (
            <Pressable
              key={option}
              onPress={() => setPriority(option)}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-2 ${
                active ? "bg-primary" : "bg-secondary"
              }`}
            >
              {Icon && (
                <Icon size={12} color={active ? "#ffffff" : "#486856"} />
              )}
              <Text
                className={`mt-1 text-sm font-semibold capitalize ${
                  active
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        className={`mt-5 flex-row items-center justify-center rounded-2xl py-3 ${
          canCreate ? "bg-primary" : "bg-muted"
        }`}
        onPress={createItem}
        disabled={!canCreate}
      >
        <Plus size={14} color={canCreate ? "#ffffff" : "#7a9386"} />
        <Text
          className={`ml-2 text-base font-semibold ${
            canCreate ? "text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Add to Grocery List
        </Text>
      </Pressable>

      {error ? (
        <View className="mt-3 rounded-2xl border border-destructive bg-destructive px-3 py-2">
          <Text className="text-sm text-white text-center uppercase">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
export default PlannerFormCard;
