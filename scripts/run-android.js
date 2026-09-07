const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const sdkDir =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk");

if (!sdkDir || !fs.existsSync(sdkDir)) {
  console.error(
    `Android SDK not found. Install Android Studio or set ANDROID_HOME.\nLooked at: ${sdkDir}`,
  );
  process.exit(1);
}

process.env.ANDROID_HOME = sdkDir;
process.env.ANDROID_SDK_ROOT = sdkDir;

const androidDir = path.join(__dirname, "..", "android");
if (fs.existsSync(androidDir)) {
  fs.writeFileSync(
    path.join(androidDir, "local.properties"),
    `sdk.dir=${sdkDir.replace(/\\/g, "/")}\n`,
  );
}

const child = spawn("npx", ["expo", "run:android", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
  shell: true,
  cwd: path.join(__dirname, ".."),
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
