import { Button, Group, ScrollArea, Stack, Switch, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Paper from "./custom/PaperCustom";
import { TFindProcess } from "../../types/find-process";

export default function FindProcess() {
   const [ripples, setRipples] = useState<number[]>([]);
   const [checked, setChecked] = useState(false);
   const nextId = useRef(0);
   const [listProcess, setlistProcess] = useState<TFindProcess[]>([]);

   useEffect(() => {
      const handlerNewProcess = (_: any, data: TFindProcess) => {
         console.log("🆕 Process mới:", data);
         setlistProcess((prev) => {
            return [data, ...prev];
         });
      };
      const handlerIntervalFindProcess = () => {
         const id = nextId.current++;
         setRipples((prev) => [...prev, id]);

         setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r !== id));
         }, 600);
      };

      // const interval = setInterval(() => {
      //    handlerNewProcess(null, { found: false });
      // }, 500);

      window.electron?.ipcRenderer?.on?.("new-process", handlerNewProcess);
      window.electron?.ipcRenderer?.on?.("interval-find-process", handlerIntervalFindProcess);

      return () => {
         window.electron?.ipcRenderer?.removeListener?.("new-process", handlerNewProcess);
         window.electron?.ipcRenderer?.removeListener?.("interval-find-process", handlerIntervalFindProcess);

         // clearInterval(interval);
      };
   }, []);

   useEffect(() => {
      window?.electron?.isFindProcess(checked);
   }, [checked]);

   return (
      <Paper>
         <Stack>
            <Group>
               <Text>Lắng nghe tiến trình mới</Text>
               <Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} size="sm" />
            </Group>
            <Group>
               <Text size="sm" c={`dimmed`}>
                  Tần suất lắng nghe
               </Text>

               <div
                  className="pulse-dot"
                  style={{ width: `10px`, height: `10px`, backgroundColor: checked ? "rgb(2, 230, 2)" : "rgba(2, 230, 2, 0.2)" }}
               >
                  {ripples.map((id) => (
                     <div key={id} className="pulse-ring" style={{ width: `20px`, height: `20px` }} />
                  ))}
               </div>
            </Group>
            <Paper shadow="sm" p="sm">
               <ScrollArea h={200}>
                  {listProcess.map((item, index) => (
                     <Group key={index} gap={2}>
                        <Text size="xs" c={`dimmed`}>
                           name:
                        </Text>
                        <Text size="xs" fw={`bold`}>
                           {item.name}
                        </Text>

                        <Text size="xs" c={`dimmed`}>
                           |
                        </Text>

                        <Text size="xs" c={`dimmed`}>
                           cpu:
                        </Text>
                        <Text size="xs" fw={`bold`}>
                           {item.cpu}
                        </Text>

                        <Text size="xs" c={`dimmed`}>
                           |
                        </Text>

                        <Text size="xs" c={`dimmed`}>
                           startedAt:
                        </Text>
                        <Text size="xs" fw={`bold`}>
                           {item.started}
                        </Text>
                     </Group>
                  ))}
               </ScrollArea>
            </Paper>
            <Button
               disabled={!checked}
               w={`fit-content`}
               variant="subtle"
               onClick={() => {
                  setlistProcess([]);
               }}
            >
               Clear
            </Button>
         </Stack>
      </Paper>
   );
}
