import dayjs from "dayjs";
import { TSchedule } from "../../store/slices/schedule/schedule.type";
import { INIT_CHECK_INTERVAL_MS, INIT_CPU, INIT_PROCESS_NAME, SCHEDULE_LIST, SETTING } from "../constant/app.constant";

export function loadSchedule() {
   const raw = localStorage.getItem(SCHEDULE_LIST);
   if (raw) {
      const sche = JSON.parse(raw);
      if (Array.isArray(sche)) {
         return sche;
      } else {
         localStorage.setItem(SCHEDULE_LIST, JSON.stringify([]));
         return [];
      }
   } else {
      localStorage.setItem(SCHEDULE_LIST, JSON.stringify([]));
      return [];
   }
}

export function addSchedule(value: TSchedule) {
   const schedule = loadSchedule();
   schedule.push(value);
   localStorage.setItem(SCHEDULE_LIST, JSON.stringify(schedule));
   return schedule;
}

export function deleteScheduleByIndex(index: number) {
   const schedule = loadSchedule();

   if (index >= 0 && index < schedule.length) {
      schedule.splice(index, 1);
      localStorage.setItem(SCHEDULE_LIST, JSON.stringify(schedule));
   }

   return schedule;
}

export function isNowInSchedule(schedule: TSchedule): boolean {
   const now = dayjs();
   const today = now.day(); // 0 = Sunday, 1 = Monday, ...

   if (today !== schedule.day) return false;

   const nowSec = now.hour() * 3600 + now.minute() * 60 + now.second();
   const startSec = schedule.startHour * 3600 + schedule.startMinute * 60 + schedule.startSecond;
   const endSec = schedule.endHour * 3600 + schedule.endMinute * 60 + schedule.endSecond;

   return nowSec >= startSec && nowSec <= endSec;
}

export function loadAppSetting(): TAppSetting {
   const raw = localStorage.getItem(SETTING);
   if (raw) {
      try {
         const parsed = JSON.parse(raw);
         return {
            checkIntervalMs: parsed.checkIntervalMs || INIT_CHECK_INTERVAL_MS,
            processName: parsed.processName || INIT_PROCESS_NAME,
            cpu: parsed.cpu || INIT_CPU,
         };
      } catch (e) {
         console.warn("❌ Lỗi đọc setting, dùng mặc định.");
      }
   }
   const defaultSetting: TAppSetting = {
      checkIntervalMs: INIT_CHECK_INTERVAL_MS,
      processName: INIT_PROCESS_NAME,
      cpu: INIT_CPU,
   };
   localStorage.setItem(SETTING, JSON.stringify(defaultSetting));
   return defaultSetting;
}

export function updateAppSetting(newSetting: Partial<TAppSetting>) {
   const current = loadAppSetting();
   const updated = { ...current, ...newSetting };
   localStorage.setItem(SETTING, JSON.stringify(updated));
   return updated;
}

export const wait = (miliseconds: number) => {
   return new Promise(function (resolve) {
      setTimeout(resolve, miliseconds);
   });
};