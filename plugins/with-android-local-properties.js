const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

function resolveAndroidSdk() {
  return (
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk")
  );
}

function withAndroidLocalProperties(config) {
  return withDangerousMod(config, [
    "android",
    async (modConfig) => {
      const sdkDir = resolveAndroidSdk();
      if (!sdkDir || !fs.existsSync(sdkDir)) {
        throw new Error(
          `Android SDK not found. Set ANDROID_HOME or install Android Studio.\nLooked at: ${sdkDir}`,
        );
      }

      const file = path.join(
        modConfig.modRequest.platformProjectRoot,
        "local.properties",
      );
      fs.writeFileSync(file, `sdk.dir=${sdkDir.replace(/\\/g, "/")}\n`);
      return modConfig;
    },
  ]);
}

module.exports = withAndroidLocalProperties;
