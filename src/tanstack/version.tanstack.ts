import { useQuery } from "@tanstack/react-query";
import { TVersion } from "../types/app.type";

export const useGetAppVersion = () => {
   return useQuery({
      queryKey: [`get-app-version`],
      queryFn: async (): Promise<TVersion> => {
         if (window?.electron?.getAppVersion) {
            return await window.electron.getAppVersion();
         }
         return { current: null, latest: null };
      },
   });
};
