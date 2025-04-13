import { createSlice } from "@reduxjs/toolkit";
import { TSchedule } from "./schedule.type";
import { loadSchedule, addSchedule, deleteScheduleByIndex } from "../../../common/helpers/function.helper";

type TInitialState = {
   scheduleList: TSchedule[];
};

const scheduleInit = () => {
   const scheduleList = loadSchedule();
   window?.electron?.updateSchedule(scheduleList);
   return scheduleList;
};

const initialState: TInitialState = {
   scheduleList: scheduleInit(),
};

const scheduleSlice = createSlice({
   name: "scheduleSlice",
   initialState,
   reducers: {
      ADD_SCHEDULE: (state, { payload }) => {
         const scheduleListNew = addSchedule(payload);
         state.scheduleList = scheduleListNew;
         window?.electron?.updateSchedule(scheduleListNew);
      },
      DELETE_SCHEDULE: (state, { payload }) => {
         const scheduleListNew = deleteScheduleByIndex(payload);
         state.scheduleList = scheduleListNew;
         window?.electron?.updateSchedule(scheduleListNew);
      },
      RESET_SCHEDULE: () => initialState,
   },
});

export const { RESET_SCHEDULE, ADD_SCHEDULE, DELETE_SCHEDULE } = scheduleSlice.actions;

export default scheduleSlice.reducer;
