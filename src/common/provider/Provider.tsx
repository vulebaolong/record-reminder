import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ReactNode } from "react";
import { Provider as ProviderRedux } from "react-redux";
import { store } from "../../store/store";
import { resolver, themeOverride } from "./mantine/theme";
import TanstackProvider from "./tanstack/TanstackProvider";
import ToastProvider from "./toast/ToastProvider";

export default function Provider({ children }: { children: ReactNode }) {
   return (
      <>
         <TanstackProvider>
            <ProviderRedux store={store}>
               <MantineProvider theme={themeOverride} defaultColorScheme="dark" cssVariablesResolver={resolver}>
                  <ToastProvider />
                  {children}
               </MantineProvider>
            </ProviderRedux>
         </TanstackProvider>
      </>
   );
}
