"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Field,
  Input,
  Stack,
  Text,
  Heading,
  VStack,
  Separator,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { loginWithGoogle } from "@/components/providers/AuthProvider";
import { toaster } from "@/components/ui/toaster";
import { sendMagicLink } from "@/actions/sendMagicLink";
import { setLoginPageEmail, useAppStore } from "@/lib/utils/appStore";
import { LoginWithPasskeyButton } from "../LoginWithPasskeyButton";
import { AnimatePresence, motion } from "motion/react";

export function LoginPage({
  failedToLoginWithToken,
}: {
  failedToLoginWithToken?: boolean;
}) {
  const email = useAppStore((s) => s.loginPageEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (failedToLoginWithToken) {
      toaster.create({
        title: "Invalid or expired token. Please try again.",
        type: "error",
      });
    }
  }, [failedToLoginWithToken]);

  const handleEmailLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    await sendMagicLink({ email });

    toaster.create({
      title: "Magic link sent to your email.",
      type: "success",
    });

    setLoginPageEmail("");

    setIsLoading(false);
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsGoogleLoading(true);

    await loginWithGoogle();
  };

  return (
    <Box
      flex={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      p={4}
    >
      <Card.Root maxW="md" w="full">
        <Card.Header textAlign="center">
          <Heading size="xl" color="blue.solid">
            Next-Auth Fortress
          </Heading>
          <Text color="fg.muted" mt={2}>
            Sign in or create an account to continue
          </Text>
        </Card.Header>

        <Card.Body>
          <VStack gap={6}>
            {/* Email Link Authentication */}
            <form onSubmit={handleEmailLinkSubmit} style={{ width: "100%" }}>
              <Stack gap={4}>
                <Field.Root>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setLoginPageEmail(e.target.value)}
                    size="lg"
                    required
                  />
                </Field.Root>

                <AnimatePresence>
                  {email ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        colorPalette="blue"
                        loading={isLoading}
                        loadingText="Sending magic link..."
                        w="full"
                        size="md"
                      >
                        <MdEmail style={{ marginRight: "8px" }} />
                        Continue with Email
                      </Button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Stack>
            </form>

            <Box w="full" position="relative">
              <Separator />
              <Text
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="bg.subtle"
                px={3}
                fontSize="sm"
                color="fg.muted"
              >
                OR
              </Text>
            </Box>

            <Stack gap={2} w="full">
              <LoginWithPasskeyButton size="md" />

              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                loading={isGoogleLoading}
                loadingText="Connecting to Google..."
                w="full"
                size="md"
              >
                <FcGoogle style={{ marginRight: "8px" }} />
                Continue with Google
              </Button>
            </Stack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
