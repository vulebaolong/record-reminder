import { combineReducers } from "redux";
import schedule from "./schedule/schedule.slice";

const combinedReducer = combineReducers({
   schedule,
  
});

export const rootReducer = (state: any, action: any) => {
   // RESET STORE (all slice) TO INIT
   if (action.type === "scheduleSlice/RESET_schedule") state = undefined;
   return combinedReducer(state, action);
};
