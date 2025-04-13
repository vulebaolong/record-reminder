import { exec } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { detectNewProcesses } from "./helpers/detect-new-processes.helper.js";
import { checkMacScreenRecording } from "./helpers/check-mac-screen-recording.helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let win;

function createWindow() {
   win = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      backgroundColor: "#1e1e1e",
      webPreferences: {
         contextIsolation: true,
         nodeIntegration: false,
         preload: path.join(__dirname, "preload.js"),
      },
   });

   win.loadFile(path.join(__dirname, "../dist/index.html"));
   win.webContents.once("did-finish-load", () => {
      win.show();
   });

   win.on("closed", () => {
      win = null;
   });
}

app.whenReady().then(() => {
   createWindow();
   app.on("activate", () => {
      if (!win || win.isDestroyed()) {
         createWindow();
      }
   });
});

app.on("window-all-closed", () => {
   if (process.platform !== "darwin") app.quit();
});

let activeSchedule = [];
let checkInterval = null;
let scheduledTimeouts = [];
let isCurrentlyRecording = false;
let warningWindow = null;

function startCheckLoop() {
   if (checkInterval) return;
   checkInterval = setInterval(() => {
      checkMacScreenRecording((result) => {
         console.log(result);
         if (!result.found) {
            showPersistentNotification();
            win?.webContents.send("recording-status", result);
            console.log(`send recording-status`);
            isCurrentlyRecording = false;
         } else {
            hidePersistentNotification();
            if (!isCurrentlyRecording) {
               win?.webContents.send("recording-status", result);
               console.log(`send recording-status`);
               isCurrentlyRecording = true;
            }
         }
      });

      // detectNewProcesses((newList) => {
      //    newList.forEach((proc) => {
      //       console.log("🆕 Process mới:", proc);
      //    });
      // });

      // isMacScreenRecording((result) => {
      //    console.log({ result });
      //    if (result.byProcess) console.log("📦 Phát hiện qua tiến trình nghi ngờ");
      //    if (result.byQuickTime) console.log("🍎 Phát hiện qua QuickTime");
      // });
   }, 2000);
   console.log("🔁 Bắt đầu kiểm tra ghi hình");
}

function stopCheckLoop() {
   if (checkInterval) clearInterval(checkInterval);
   checkInterval = null;
   console.log("⏹️ Dừng kiểm tra ghi hình");
}

function scheduleAllCheckWindows() {
   scheduledTimeouts.forEach(clearTimeout);
   scheduledTimeouts = [];

   const now = new Date();

   activeSchedule.forEach(({ day, startHour, startMinute, startSecond, endHour, endMinute, endSecond }) => {
      const nextStart = new Date();
      nextStart.setHours(startHour, startMinute, startSecond, 0);
      nextStart.setDate(now.getDate() + ((7 + day - now.getDay()) % 7));

      const nextEnd = new Date(nextStart);
      nextEnd.setHours(endHour, endMinute, endSecond, 0);

      const startDelay = nextStart.getTime() - now.getTime();
      const endDelay = nextEnd.getTime() - now.getTime();

      if (startDelay > 0) {
         scheduledTimeouts.push(
            setTimeout(() => {
               startCheckLoop();
               scheduledTimeouts.push(setTimeout(() => stopCheckLoop(), nextEnd.getTime() - nextStart.getTime()));
            }, startDelay)
         );
      } else if (now >= nextStart && now < nextEnd) {
         startCheckLoop();
         scheduledTimeouts.push(setTimeout(() => stopCheckLoop(), endDelay));
      }
   });
}

function restart() {
   hidePersistentNotification();
   stopCheckLoop();
   scheduledTimeouts.forEach(clearTimeout);
   scheduledTimeouts = [];
   isCurrentlyRecording = false;
   scheduleAllCheckWindows();
}

function showPersistentNotification() {
   if (warningWindow) return;

   warningWindow = new BrowserWindow({
      width: 360,
      height: 70,
      frame: false,
      alwaysOnTop: true,
      resizable: false,
      skipTaskbar: true,
      transparent: false,
      focusable: false,
      hasShadow: true,
      x: 0,
      y: 1000,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
      },
   });

   warningWindow.loadFile(path.join(__dirname, "./html/notification.html"));
}

function hidePersistentNotification() {
   if (warningWindow) {
      warningWindow.close();
      warningWindow = null;
   }
}

ipcMain.handle("update-schedule", async (_, scheduleUpdate) => {
   activeSchedule = scheduleUpdate;
   restart();
});