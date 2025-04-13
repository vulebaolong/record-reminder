import { exec } from "child_process";

export function isMacScreenRecording(callback) {
  let foundByProcess = false;
  let foundByQuickTime = false;

  const suspiciousProcesses = [
    "VTEncoderXPCService",
    "screencapture",
    "ScreenCaptureKitAgent",
    "CaptureKit",
  ];

  // Step 1: Check for suspicious processes
  exec("ps -eo pid=,command=", (err, stdout) => {
    if (!err && stdout) {
      const lowerOutput = stdout.toLowerCase();
      foundByProcess = suspiciousProcesses.some((keyword) =>
        lowerOutput.includes(keyword.toLowerCase())
      );
    }

    // Step 2: Check QuickTime via AppleScript
    const appleScript = `
      tell application id "com.apple.QuickTimePlayerX"
        set isRecording to false
        repeat with doc in documents
          try
            if name of doc is "Screen Recording" and (current time of doc) > 0 then
              set isRecording to true
            end if
          end try
        end repeat
        return isRecording
      end tell
    `;

    exec(`osascript -e '${appleScript}'`, (qtErr, qtStdout) => {
      if (!qtErr && qtStdout.trim() === "true") {
        foundByQuickTime = true;
      }

      const isRecording = foundByProcess || foundByQuickTime;

      callback({
        found: isRecording,
        byProcess: foundByProcess,
        byQuickTime: foundByQuickTime,
        timestamp: new Date().toISOString(),
      });
    });
  });
}
