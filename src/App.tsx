import { Button, Stack } from "@mantine/core";
import AddSchedule from "./common/components/AddSchedule";
import ListSchedule from "./common/components/ListSchedule";
import Status from "./common/components/Status";
import Setting from "./common/components/Setting";

function App() {
   return (
      <Stack p={20}>
         <Status />
         <AddSchedule />
         <ListSchedule />
         <Setting />
         <Button
            w={`fit-content`}
            variant="subtle"
            onClick={() => {
               window?.electron?.quitApp();
            }}
         >
            Thoát
         </Button>
         {/* <LogStatus /> */}
      </Stack>
   );
}

export default App;
