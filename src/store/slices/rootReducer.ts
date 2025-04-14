import { combineReducers } from "redux";
import schedule from "./schedule/schedule.slice";
import setting from "./setting/setting.slice";

const combinedReducer = combineReducers({
   schedule,
   setting,
});

export const rootReducer = (state: any, action: any) => {
   // RESET STORE (all slice) TO INIT
   if (action.type === "scheduleSlice/RESET_schedule") state = undefined;
   return combinedReducer(state, action);
};
