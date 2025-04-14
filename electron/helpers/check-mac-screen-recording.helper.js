import { exec } from "child_process";

export function checkMacScreenRecording({callback, processName, cpu}) {
   exec("ps -eo pid=,ppid=,user=,%cpu=,%mem=,etime=,comm=,command=", (err, stdout) => {
      const now = new Date().toISOString();
      if (err) {
         return callback({
            found: false,
            error: "Failed to run ps",
            timestamp: now,
         });
      }

      const lines = stdout.trim().split("\n");

      const matches = lines
         .map((line) => line.trim())
         .filter((line) => line.includes(processName))
         .map((line) => {
            const parts = line.trim().split(/\s+/);
            return {
               pid: parts[0],
               ppid: parts[1],
               user: parts[2],
               cpu: parseFloat(parts[3]), // ✨ ép kiểu để so sánh
               mem: parts[4],
               elapsed: parts[5],
               commandShort: parts[6],
               commandFull: parts.slice(7).join(" "),
            };
         })
         .filter((proc) => proc.cpu > cpu); // ✨ chỉ lấy những process có %CPU > 1

      if (matches.length > 0) {
         return callback({
            found: true,
            timestamp: now,
            matches,
         });
      }

      return callback({
         found: false,
         timestamp: now,
         matches: [],
      });
   });
}
