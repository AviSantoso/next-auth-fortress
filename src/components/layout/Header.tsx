"use client";

import { Box, Flex, Heading, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEmail } from "@/components/providers/AuthProvider";
import { LogoutButton } from "../LogoutButton";
import { MdCastle } from "react-icons/md";

export function Header() {
  const router = useRouter();
  const { email } = useEmail();

  return (
    <Box
      as="header"
      width="full"
      py={4}
      px={6}
      borderBottomWidth="1px"
      position="relative"
      overflow="hidden"
    >
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
      >
        <Flex gap={4} align="center">
          <Icon as={MdCastle} scale={1.4} />
          <Heading
            size="xl"
            cursor="pointer"
            fontWeight="bold"
            onClick={() => router.push("/")}
          >
            Next-Auth Fortress
          </Heading>
        </Flex>

        {email ? <LogoutButton /> : null}
      </Flex>
    </Box>
  );
}
