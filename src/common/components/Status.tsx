import { Group, Paper, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

export default function Status() {
   const [ripples, setRipples] = useState<number[]>([]);
   const nextId = useRef(0);
   const [isRecord, setIsRecord] = useState(false);

   useEffect(() => {
      console.log("📨 Đăng ký nhận recording-status", window.electron);

      const handler = (_: any, data: any) => {
         setIsRecord(data.found);
         const id = nextId.current++;
         setRipples((prev) => [...prev, id]);

         setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r !== id));
         }, 600);
      };

      // const interval = setInterval(() => {
      //    handler(null, { found: false });
      // }, 3000);

      window.electron?.ipcRenderer?.on?.("recording-status", handler);

      return () => {
         window.electron?.ipcRenderer?.removeListener?.("recording-status", handler);
         // clearInterval(interval);
      };
   }, []);

   return (
      <Paper shadow="md" p="md" radius="md" withBorder>
         <Stack>
            <Group>
               <Text size="sm" c={`dimmed`}>Tần suất kiểm tra</Text>
               <div className="pulse-dot">
                  {ripples.map((id) => (
                     <div key={id} className="pulse-ring" />
                  ))}
               </div>
            </Group>
            <Group>
               <Text size="sm" c={`dimmed`}>Trạng thái: </Text>
               <Text> {isRecord ? "🟢 Đang ghi" : "🛑 Không ghi"}</Text>
            </Group>
         </Stack>
      </Paper>
   );
}
