import { Stack } from "@mantine/core";
import AddSchedule from "./common/components/AddSchedule";
import ListSchedule from "./common/components/ListSchedule";
import LogStatus from "./common/components/LogStatus";

function App() {
 
   return (
      <Stack p={20}>
         <AddSchedule />
         <ListSchedule />
         <LogStatus />
      </Stack>
   );
}

export default App;
