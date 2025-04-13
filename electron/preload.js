const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
   ipcRenderer: {
      on: (channel, func) => ipcRenderer.on(channel, func),
      removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
   },
   checkRecording: () => ipcRenderer.invoke("check-recording"),
   updateSchedule: (data) => ipcRenderer.invoke("update-schedule", data),
});
