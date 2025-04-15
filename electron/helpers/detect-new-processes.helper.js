import { exec } from "child_process";
import path from "path";

let previousProcesses = new Set();
let initialized = false;

export function detectNewProcesses(callback) {
   const psCommand = `ps -eo pid=,ppid=,user=,%cpu=,%mem=,etime=,start=,rss=,stat=,comm=,command=`;

   exec(psCommand, (err, stdout) => {
      if (err) {
         console.error("❌ Lỗi khi chạy lệnh ps:", err);
         return callback([]);
      }

      const lines = stdout.trim().split("\n");
      const newProcesses = [];

      for (const line of lines) {
         const trimmed = line.trim();
         if (!trimmed) continue;

         const parts = trimmed.match(/^(\d+)\s+(\d+)\s+(\S+)\s+([\d.]+)\s+([\d.]+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/);
         if (!parts) continue;

         const [_full, pid, ppid, user, cpu, mem, etime, start, rss, stat, _comm, commandFull] = parts;

         const key = `${pid}-${commandFull}`;
         const name = path.basename(commandFull);
         if (name === "ps" || commandFull.includes("ps -eo")) continue;

         if (initialized && !previousProcesses.has(key)) {
            newProcesses.push({
               pid,
               ppid,
               user,
               cpu: `${cpu}%`,
               mem: `${mem}%`,
               elapsed: etime,
               started: start,
               memory: `${rss} KB`,
               status: stat,
               name, // dùng tên chính xác
               command: commandFull,
            });
         }

         previousProcesses.add(key);
      }

      if (!initialized) {
         initialized = true;
         return callback([]);
      }

      callback(newProcesses);
   });
}
