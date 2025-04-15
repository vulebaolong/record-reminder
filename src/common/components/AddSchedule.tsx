import { ActionIcon, Button, Group, Select, Stack, Text } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { ADD_SCHEDULE } from "../../store/slices/schedule/schedule.slice";
import { TSchedule } from "../../store/slices/schedule/schedule.type";
import { useAppDispatch, useAppSelector } from "../../store/store";
import Paper from "./custom/PaperCustom";
import { ESchedule } from "../../types/enum/schedule.enum";

const dayMap = Object.entries(ESchedule)
   .filter(([_, value]) => typeof value === "number")
   .map((item) => ({ value: item[1].toString(), label: item[0] }));

export default function AddSchedule() {
   const [value, setValue] = useState<number>(0);
   const ref1 = useRef<HTMLInputElement>(null);
   const ref2 = useRef<HTMLInputElement>(null);

   const scheduleList = useAppSelector((state) => state.schedule.scheduleList);
   const dispatch = useAppDispatch();

   const handleAddSchedule = () => {
      console.log(value, ref1.current?.value, ref2.current?.value);

      if (!ref1.current?.value || !ref2.current?.value) return;

      const [startHour, startMinute, startSecond] = ref1.current.value.split(":").map(Number);
      const [endHour, endMinute, endSecond] = ref2.current.value.split(":").map(Number);

      const startTime = startHour * 3600 + startMinute * 60 + startSecond;
      const endTime = endHour * 3600 + endMinute * 60 + endSecond;

      if (endTime <= startTime) {
         toast.warning(`Thời gian kết thúc phải lớn hơn thời gian bắt đầu`);
         return;
      }

      const isDuplicate = scheduleList.some(
         (item) =>
            item.day === value &&
            item.startHour === startHour &&
            item.startMinute === startMinute &&
            item.startSecond === startSecond &&
            item.endHour === endHour &&
            item.endMinute === endMinute &&
            item.endSecond === endSecond
      );

      if (isDuplicate) {
         toast.warning(`Lịch này đã tồn tại, vui lòng chọn khác`);
         return;
      }

      const result: TSchedule = {
         day: value,
         startHour: startHour,
         startMinute: startMinute,
         startSecond: startSecond,
         endHour: endHour,
         endMinute: endMinute,
         endSecond: endSecond,
      };

      dispatch(ADD_SCHEDULE(result));
   };

   return (
      <Paper>
         <Stack>
            <Text>Lịch học</Text>
            <Group w={200} justify="space-between" wrap="nowrap">
               <Text>Thứ</Text>
               <Select
                  w={`120px`}
                  data={dayMap}
                  value={value.toString()}
                  onChange={(value) => {
                     setValue(Number(value));
                  }}
               />
            </Group>
            <Group w={200} justify="space-between">
               <Text>Từ</Text>
               <TimeInput
                  ref={ref1}
                  w={`120px`}
                  defaultValue={`00:00:00`}
                  withSeconds
                  rightSection={
                     <ActionIcon variant="subtle" color="gray" onClick={() => ref1.current?.showPicker()}>
                        <IconClock size={16} stroke={1.5} />
                     </ActionIcon>
                  }
               />
            </Group>
            <Group w={200} justify="space-between">
               <Text>Đến</Text>
               <TimeInput
                  ref={ref2}
                  w={`120px`}
                  defaultValue={`00:00:00`}
                  withSeconds
                  rightSection={
                     <ActionIcon variant="subtle" color="gray" onClick={() => ref2.current?.showPicker()}>
                        <IconClock size={16} stroke={1.5} />
                     </ActionIcon>
                  }
               />
            </Group>
            <Button onClick={handleAddSchedule} w={`min-content`}>
               Thêm lịch học
            </Button>
         </Stack>
      </Paper>
   );
}
