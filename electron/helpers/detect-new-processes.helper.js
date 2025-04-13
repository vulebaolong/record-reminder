import { exec } from "child_process";

let previousProcesses = new Set();

export function detectNewProcesses(callback) {
   // Lấy nhiều thông tin hơn từ mỗi tiến trình
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

         // split giữ lại dấu cách trong command cuối cùng
         const parts = trimmed.match(/^(\d+)\s+(\d+)\s+(\S+)\s+([\d.]+)\s+([\d.]+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/);
         if (!parts) continue;

         const [
            _full, pid, ppid, user, cpu, mem, etime, start, rss, stat, commandShort, commandFull
         ] = parts;

         const key = `${pid}-${commandFull}`;
         if (!previousProcesses.has(key)) {
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
               name: commandShort,
               command: commandFull,
            });
         }

         previousProcesses.add(key);
      }

      callback(newProcesses);
   });
}
