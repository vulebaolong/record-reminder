const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
   ipcRenderer: {
      on: (channel, func) => ipcRenderer.on(channel, func),
      removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
   },
   quitApp: () => ipcRenderer.invoke("quit-app"),
   updateSchedule: (data) => ipcRenderer.invoke("update-schedule", data),
   updateSetting: (data) => ipcRenderer.invoke("update-setting", data),
});
