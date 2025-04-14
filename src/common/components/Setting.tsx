import { NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useMemo } from "react";
import { UPDATE_CHECK_INTERVAL, UPDATE_CPU, UPDATE_PROCESS_NAME } from "../../store/slices/setting/setting.slice";
import { useAppDispatch } from "../../store/store";
import { loadAppSetting } from "../helpers/function.helper";
import Paper from "./custom/PaperCustom";

export default function Setting() {
   const dispatch = useAppDispatch();

   const setting = useMemo(() => {
      return loadAppSetting();
   }, []);

   const handleUpdateCheckInterval = useDebouncedCallback(async (interval: number | string) => {
      dispatch(UPDATE_CHECK_INTERVAL(Number(interval)));
   }, 500);

   const handleUpdateProcessName = useDebouncedCallback(async (processName: string) => {
      dispatch(UPDATE_PROCESS_NAME(processName));
   }, 500);

   const handleUpdateCpu = useDebouncedCallback(async (cpu: number | string) => {
      dispatch(UPDATE_CPU(Number(cpu)));
   }, 500);

   return (
      <Paper>
         <Stack>
            <NumberInput
               label={<Text >Tần suất kiểm tra</Text>}
               styles={{
                  wrapper: { width: `200px` },
               }}
               description={`Mỗi ms sẽ kiểm tra 1 lần`}
               onChange={handleUpdateCheckInterval}
               placeholder="Milisecond"
               suffix="ms"
               defaultValue={setting.checkIntervalMs}
            />
            <TextInput
               label={<Text >Tên tiến trình</Text>}
               styles={{
                  wrapper: { width: `200px` },
               }}
               description={"VTEncoderXPCService là tiến trình record của macOS"}
               onChange={(event) => {
                  handleUpdateProcessName(event.currentTarget.value);
               }}
               placeholder="VTEncoderXPCService"
               defaultValue={setting.processName}
            />
            <NumberInput
               label={
                  <Text size="sm" >
                     CPU
                  </Text>
               }
               styles={{
                  wrapper: { width: `200px` },
               }}
               onChange={handleUpdateCpu}
               placeholder="%"
               suffix="%"
               defaultValue={setting.cpu}
            />
         </Stack>
      </Paper>
   );
}
