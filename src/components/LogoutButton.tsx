import { ButtonProps, Button, Icon } from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import { logout as logoutAction } from "@/actions/logout";
import { useEmail } from "@/components/providers/AuthProvider";
import { useTransition } from "react";

export function LogoutButton(props: ButtonProps) {
  const { email } = useEmail();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      loading={isPending}
      disabled={!email}
      {...props}
    >
      <Icon as={MdLogout} mr={2} />
      Logout
    </Button>
  );
}
