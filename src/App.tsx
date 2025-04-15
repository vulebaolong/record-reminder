import { Button, Stack } from "@mantine/core";
import AddSchedule from "./common/components/AddSchedule";
import ListSchedule from "./common/components/ListSchedule";
import Setting from "./common/components/Setting";
import Status from "./common/components/Status";
import Version from "./common/components/Version";

function App() {
   return (
      <>
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
            <Version />
         </Stack>
      </>
   );
}

export default App;


// sudo xattr -r -d com.apple.quarantine /Applications/Record\ Reminder.app
// /Applications/Record\ Reminder.app/Contents/MacOS/Record\ Reminder
