import { Paper, ScrollArea, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export default function LogStatus() {
   const [status, setStatus] = useState<string[]>([]);

   useEffect(() => {
      console.log("📨 Đăng ký nhận recording-status", window.electron);

      const handler = (_: any, data: any) => {
         const timestamp = new Date().toLocaleTimeString();
         const message = data.message
            ? `[${timestamp}] ${data.message}`
            : `[${timestamp}] ${data.found ? "🟢 Đang ghi" : "🛑 Không ghi"} | PID: ${data.pid || "N/A"}`;
         setStatus((prev) => [...prev, message]);
      };

      window.electron?.ipcRenderer?.on?.("recording-status", handler);

      return () => {
         window.electron?.ipcRenderer?.removeListener?.("recording-status", handler);
      };
   }, []);

   return (
      <Paper shadow="md" p="md" radius="md" withBorder>
         <ScrollArea h={200}>
            {status.map((item, index) => (
               <Text key={index} size="sm" color="gray.4" style={{ whiteSpace: "pre-line" }}>
                  {item}
               </Text>
            ))}
         </ScrollArea>
      </Paper>
   );
}
