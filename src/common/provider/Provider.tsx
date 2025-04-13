import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ReactNode } from "react";
import { resolver, themeOverride } from "./mantine/theme";
import ToastProvider from "./toast/ToastProvider";
import { Provider as ProviderRedux } from "react-redux";
import { store } from "../../store/store";

export default function Provider({ children }: { children: ReactNode }) {
   return (
      <>
         <ProviderRedux store={store}>
            <MantineProvider theme={themeOverride} defaultColorScheme="dark" cssVariablesResolver={resolver}>
               <ToastProvider />
               {children}
            </MantineProvider>
         </ProviderRedux>
      </>
   );
}
