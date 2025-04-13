import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Provider from "./common/provider/Provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
   <Provider>
      <App />
   </Provider>
);
