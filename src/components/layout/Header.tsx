"use client";

import { Box, Flex, Heading, HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEmail } from "@/components/providers/AuthProvider";
import { LogoutButton } from "../LogoutButton";

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
        <Heading
          size="md"
          color="blue.solid"
          cursor="pointer"
          onClick={() => router.push("/")}
        >
          Next-Auth Fortress
        </Heading>

        {email ? <LogoutButton /> : null}
      </Flex>
    </Box>
  );
}
