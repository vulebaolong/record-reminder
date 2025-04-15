import { Anchor, Box, Center, Loader, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useGetAppVersion } from "../../tanstack/version.tanstack";
import ModalUpdate from "./modal/ModalUpdate";

export default function Version() {
   const [opened, handleModal] = useDisclosure(false);

   const getAppVersion = useGetAppVersion();

   console.log({ getAppVersion: getAppVersion.data });

   const renderVersion = () => {
      if (getAppVersion.isLoading) {
         return <Loader size={10} color={"dimmed"} />;
      }
      if (getAppVersion.isError) {
         return (
            <Text fz={`sm`} c={"dimmed"}>
               v-----
            </Text>
         );
      }
      return (
         <Box>
            <Text ta={`center`} fz={`xs`} c={"dimmed"}>
               v{getAppVersion.data?.current || `-----`}
            </Text>
            {getAppVersion.data?.latest && getAppVersion.data.current !== getAppVersion.data.latest && (
               <Text ta={`center`} fz={`xs`} c={"dimmed"}>
                  v{getAppVersion.data.latest} - Latest -{" "}
                  <Anchor
                     href={`https://github.com/vulebaolong/record-reminder/releases/tag/v${getAppVersion.data.latest}`}
                     underline="always"
                     c={"dimmed"}
                     inherit
                     target="_blank"
                  >
                     Downnload
                  </Anchor>
               </Text>
            )}
         </Box>
      );
   };

   return (
      <>
         <Box>
            <Center>{renderVersion()}</Center>
         </Box>

         <ModalUpdate opened={opened} close={handleModal.close} />
      </>
   );
}
