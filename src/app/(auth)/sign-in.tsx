import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const navigateAfterAuth = ({
    session,
    decorateUrl,
  }: {
    session?: { currentTask?: unknown } | null;
    decorateUrl: (path: string) => string;
  }) => {
    if (session?.currentTask) {
      return;
    }

    const url = decorateUrl("/");
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.replace(url as Href);
    }
  };

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigateAfterAuth });
    } else if (signIn.status === "needs_second_factor") {
      // MFA is enabled. See Clerk's multi-factor custom flow guide.
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    }
  };

  const handleVerify = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigateAfterAuth });
    }
  };

  if (signIn.status === "needs_client_trust") {
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
          style={({ pressed }) => [
            styles.button,
            fetchStatus === "fetching" && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === "fetching"}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <Text style={styles.secondaryButtonText}>I need a new code</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => signIn.reset()}
        >
          <Text style={styles.secondaryButtonText}>Start over</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

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
      {errors.fields.identifier ? (
        <Text style={styles.error}>{errors.fields.identifier.message}</Text>
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
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>

      <View style={styles.linkContainer}>
        <Text>Don't have an account? </Text>
        <Link href="/(auth)/sign-up">
          <Text style={styles.link}>Sign up</Text>
        </Link>
      </View>
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
