import { Group, Paper, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

export default function Status() {
   const [ripples, setRipples] = useState<number[]>([]);
   const nextId = useRef(0);
   const [isRecord, setIsRecord] = useState(false);
   const [isCheckLoop, setIsCheckLoop] = useState(false);

   useEffect(() => {
      console.log("📨 Đăng ký nhận recording-status", window.electron);

      const handlerRecordingStatus = (_: any, data: any) => {
         setIsRecord(data.found);
         const id = nextId.current++;
         setRipples((prev) => [...prev, id]);

         setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r !== id));
         }, 600);
      };

      const handlerIsCheckLoop = (_: any, data: boolean) => {
         setIsCheckLoop(data);
      };

      // const interval = setInterval(() => {
      //    handler(null, { found: false });
      // }, 3000);

      window.electron?.ipcRenderer?.on?.("recording-status", handlerRecordingStatus);
      window.electron?.ipcRenderer?.on?.("is-check-loop", handlerIsCheckLoop);

      return () => {
         window.electron?.ipcRenderer?.removeListener?.("recording-status", handlerRecordingStatus);
         window.electron?.ipcRenderer?.removeListener?.("is-check-loop", handlerIsCheckLoop);
         // clearInterval(interval);
      };
   }, []);

   return (
      <>
         <Paper shadow="md" p="md" radius="md" withBorder>
            <Stack>
               <Group>
                  <Text size="sm" c={`dimmed`}>
                     Tần suất kiểm tra
                  </Text>
                  <div
                     className="pulse-dot"
                     style={{ width: `10px`, height: `10px`, backgroundColor: isCheckLoop ? "rgb(2, 230, 2)" : "rgba(2, 230, 2, 0.2)" }}
                  >
                     {ripples.map((id) => (
                        <div key={id} className="pulse-ring" style={{ width: `20px`, height: `20px` }} />
                     ))}
                  </div>
               </Group>
               <Group>
                  <Text size="sm" c={`dimmed`}>
                     Trạng thái:{" "}
                  </Text>
                  <Text> {isRecord ? "🟢 Đang ghi" : "🛑 Không ghi"}</Text>
               </Group>
            </Stack>
         </Paper>
      </>
   );
}
