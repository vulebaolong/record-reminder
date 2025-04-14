import type { TSchedule } from "@/store/slices/schedule/schedule.type";
import { TAppSetting } from "../common/helpers/function.helper";

declare global {
   interface Window {
      electron: {
         quitApp: () => Promise<any>;
         updateSchedule: (scheduleList: TSchedule[]) => Promise<any>;
         updateSetting: (setting: TAppSetting) => Promise<any>;
         ipcRenderer?: {
            invoke: (channel: string, ...args: any[]) => Promise<any>;
            on?: (channel: string, listener: (...args: any[]) => void) => void;
            removeListener?: (channel: string, listener: (...args: any[]) => void) => void;
         };
      };
   }
   type TAppSetting = {
      checkIntervalMs: number;
      processName: string;
      cpu: number;
   };
}
