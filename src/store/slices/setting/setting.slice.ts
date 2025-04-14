import { createSlice } from "@reduxjs/toolkit";
import { loadAppSetting, updateAppSetting } from "../../../common/helpers/function.helper";

type TInitialState = TAppSetting;

const settingInit = () => {
   const setting = loadAppSetting();
   window?.electron?.updateSetting(setting);
   return setting;
};

const initialState: TInitialState = settingInit();

const settingSlice = createSlice({
   name: "settingSlice",
   initialState,
   reducers: {
      UPDATE_CHECK_INTERVAL: (state, { payload }) => {
         const settingUpdated = updateAppSetting({ checkIntervalMs: payload });
         state.checkIntervalMs = settingUpdated.checkIntervalMs;
         window?.electron?.updateSetting(settingUpdated);
      },
      UPDATE_PROCESS_NAME: (state, { payload }) => {
         const settingUpdated = updateAppSetting({ processName: payload });
         state.processName = settingUpdated.processName;
         window?.electron?.updateSetting(settingUpdated);
      },
      UPDATE_CPU: (state, { payload }) => {
         const settingUpdated = updateAppSetting({ cpu: payload });
         state.cpu = settingUpdated.cpu;
         window?.electron?.updateSetting(settingUpdated);
      },
   },
});

export const { UPDATE_CHECK_INTERVAL, UPDATE_PROCESS_NAME, UPDATE_CPU } = settingSlice.actions;

export default settingSlice.reducer;
