import { app, BrowserWindow, ipcMain, shell } from "electron";
import updater from "electron-updater";
import path from "path";
import { fileURLToPath } from "url";
import { checkMacScreenRecording } from "./helpers/check-mac-screen-recording.helper.js";
import { detectNewProcesses } from "./helpers/detect-new-processes.helper.js";
const { autoUpdater } = updater;

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

   win.webContents.setWindowOpenHandler(({ url }) => {
      // Mở các link ngoài bằng trình duyệt mặc định
      shell.openExternal(url);
      return { action: "deny" };
   });

   win.webContents.on("will-navigate", (event, url) => {
      if (url !== win.webContents.getURL()) {
         event.preventDefault();
         shell.openExternal(url);
      }
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
   if (process.platform !== "darwin") quitApp();
});

let activeSchedule = [];
let checkInterval = null;
let findProcessInterval = null;
let scheduledTimeouts = [];
let warningWindow = null;
let currentIntervalMs = 10000;
let findProcessIntervalMs = 1000;
let processName = "VTEncoderXPCService";
let cpu = 1;

function startCheckLoop() {
   if (checkInterval) return;
   checkInterval = setInterval(() => {
      checkMacScreenRecording({
         cpu: cpu,
         processName: processName,
         callback: (result) => {
            console.log(result);
            if (!result.found) {
               showPersistentNotification();
               win?.webContents.send("recording-status", result);
            } else {
               hidePersistentNotification();
               win?.webContents.send("recording-status", result);
            }
         },
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
   }, currentIntervalMs);
   win?.webContents.send("is-check-loop", true);
   console.log("🔁 Bắt đầu kiểm tra ghi hình");
}

function stopCheckLoop() {
   if (checkInterval) clearInterval(checkInterval);
   checkInterval = null;
   win?.webContents.send("is-check-loop", false);
   console.log("⏹️ Dừng kiểm tra ghi hình");
}

function startFindProcessLoop() {
   if (findProcessInterval) return;
   findProcessInterval = setInterval(() => {
      win?.webContents.send("interval-find-process");

      detectNewProcesses((newList) => {
         newList.forEach((proc) => {
            console.log("🆕 Process mới:", proc);
            win?.webContents.send("new-process", proc);
         });
      });
   }, findProcessIntervalMs);
   console.log("🔁 Bắt đầu tìm process");
}

function stopFindProcessLoop() {
   if (findProcessInterval) clearInterval(findProcessInterval);
   findProcessInterval = null;
   console.log("⏹️ Dừng tìm process");
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
   stopFindProcessLoop();
   scheduledTimeouts.forEach(clearTimeout);
   scheduledTimeouts = [];
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

function quitApp() {
   // 1. Clear interval và timeout
   if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
   }
   if (findProcessInterval) {
      clearInterval(findProcessInterval);
      findProcessInterval = null;
   }

   scheduledTimeouts.forEach(clearTimeout);
   scheduledTimeouts = [];

   // 2. Đóng warningWindow nếu còn
   if (warningWindow) {
      warningWindow.close();
      warningWindow = null;
   }

   // 3. Đóng tất cả BrowserWindow nếu có thêm
   BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) win.destroy();
   });

   // 4. Thoát ứng dụng hoàn toàn
   // app.exit(0);
   app.quit();
}

ipcMain.handle("update-schedule", async (_, scheduleUpdate) => {
   activeSchedule = scheduleUpdate;
   restart();
});
ipcMain.handle("update-setting", async (_, setting) => {
   if (setting) {
      currentIntervalMs = Number(setting.checkIntervalMs) > 100 ? Number(setting.checkIntervalMs) : 100;
      processName = setting.processName;
      cpu = setting.cpu;
      restart();
   }
});
ipcMain.handle("quit-app", async () => {
   console.log("👋 Goodbye!");
   quitApp();
});
ipcMain.handle("restart-app", () => {
   console.log("🔄 Restarting...");
   autoUpdater.quitAndInstall();
});
ipcMain.handle("get-app-version", async () => {
   const current = app.getVersion();
   let latest = null;

   try {
      const updateCheck = await autoUpdater.checkForUpdates();
      latest = updateCheck?.updateInfo?.version || null;
   } catch (error) {
      console.warn("⚠️ Không thể kiểm tra bản cập nhật:", error);
   }

   return { current, latest };
});
ipcMain.handle("is-find-process", async (_, isFindProcess) => {
   if (isFindProcess) {
      startFindProcessLoop();
   } else {
      stopFindProcessLoop();
   }
});
