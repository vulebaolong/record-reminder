import { Button, Center, Modal, Stack, Text } from "@mantine/core";

type TProps = {
   opened: boolean;
   close: () => void;
   onSuccess?: () => void;
};

export default function ModalUpdate({ opened, close, onSuccess }: TProps) {
   return (
      <Modal
         styles={{
            body: {
               padding: 0,
            },
            content: {
               overflowY: `unset`,
            },
         }}
         size="auto"
         opened={opened}
         onClose={close}
         centered
         lockScroll={true}
         overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
         }}
         transitionProps={{ transition: "rotate-right" }}
      >
         <Stack pos={`relative`} w={320} p={20}>
            <Text ta={`center`}>Có bản cập nhật mới. Khởi động lại ứng dụng?</Text>

            <Center>
               <Button
                  data-autofocus
                  style={{ width: `120px` }}
                  onClick={() => {
                     window?.electron?.restartApp();
                     if (onSuccess) onSuccess();
                  }}
               >
                  Xác nhận
               </Button>
            </Center>
         </Stack>
      </Modal>
   );
}
