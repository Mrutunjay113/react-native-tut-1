import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.replace(url as Href);
          }
        },
      });
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Verify your account</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        {errors.fields.code ? (
          <Text style={styles.error}>{errors.fields.code.message}</Text>
        ) : null}
        <Pressable
          style={styles.button}
          onPress={handleVerify}
          disabled={fetchStatus === "fetching"}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          <Text style={styles.secondaryButtonText}>I need a new code</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      {errors.fields.emailAddress ? (
        <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
      ) : null}

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry
        onChangeText={setPassword}
      />
      {errors.fields.password ? (
        <Text style={styles.error}>{errors.fields.password.message}</Text>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={!emailAddress || !password || fetchStatus === "fetching"}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>

      <View style={styles.linkContainer}>
        <Text>Already have an account? </Text>
        <Link href="/(auth)/sign-in">
          <Text style={styles.link}>Sign in</Text>
        </Link>
      </View>

      {/* Required for sign-up flows on Expo web. Clerk skips the browser CAPTCHA on iOS and Android */}
      <View nativeID="clerk-captcha" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    alignItems: "center",
  },
  link: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  error: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: -8,
  },
});
