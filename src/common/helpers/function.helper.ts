import dayjs from "dayjs";
import { TSchedule } from "../../store/slices/schedule/schedule.type";
import { SCHEDULE_LIST } from "../constant/app.constant";

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
