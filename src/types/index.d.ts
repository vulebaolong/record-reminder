import type { TSchedule } from "@/store/slices/schedule/schedule.type";

declare global {
   interface Window {
      electron: {
         checkRecording: () => Promise<any>;
         updateSchedule: (scheduleList: TSchedule[]) => Promise<any>;
         ipcRenderer?: {
            invoke: (channel: string, ...args: any[]) => Promise<any>;
            on?: (channel: string, listener: (...args: any[]) => void) => void;
            removeListener?: (channel: string, listener: (...args: any[]) => void) => void;
         };
      };
   }
}
