"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Text,
  Heading,
  VStack,
  HStack,
  Icon,
  Alert,
} from "@chakra-ui/react";
import { MdSecurity, MdFingerprint, MdDevices } from "react-icons/md";
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/components/pages/LoadingPage";
import { AddPasskeyButton } from "@/components/AddPasskeyButton";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

export function RegisterPage() {
  const router = useRouter();
  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    setIsSupported(browserSupportsWebAuthn());
    setReady(true);
  }, []);

  if (!isReady) {
    return <LoadingPage />;
  }

  if (!isSupported) {
    router.push("/");
    return <LoadingPage />;
  }

  return (
    <Box
      flex={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Card.Root maxW="md" w="full">
        <Card.Header textAlign="center">
          <Box mb={4}>
            <Icon color="blue.500" boxSize={16}>
              <MdSecurity />
            </Icon>
          </Box>
          <Heading size="xl" color="blue.500">
            Secure Your Account
          </Heading>
          <Text color="fg.muted" mt={2}>
            Set up a passkey for seamless and secure login
          </Text>
        </Card.Header>

        <Card.Body>
          <VStack gap={6}>
            <VStack gap={4} align="start" w="full">
              <HStack gap={3}>
                <Icon color="blue.solid" flexShrink={0} mr={2}>
                  <MdFingerprint size={32} />
                </Icon>
                <VStack align="start" gap={0.5}>
                  <Text fontWeight="medium">Login with a Touch or Glance</Text>
                  <Text fontSize="sm" color="fg.muted">
                    Use your fingerprint, face, or physical key to login
                  </Text>
                </VStack>
              </HStack>

              <HStack gap={3}>
                <Icon color="blue.solid" flexShrink={0} mr={2}>
                  <MdSecurity size={32} />
                </Icon>
                <VStack align="start" gap={0.5}>
                  <Text fontWeight="medium">Stronger Protection</Text>
                  <Text fontSize="sm" color="fg.muted">
                    Safeguard your account from phishing attempts
                  </Text>
                </VStack>
              </HStack>

              <HStack gap={3}>
                <Icon color="blue.solid" flexShrink={0} mr={2}>
                  <MdDevices size={32} />
                </Icon>
                <VStack align="start" gap={0.5}>
                  <Text fontWeight="medium">Seamless Experience</Text>
                  <Text fontSize="sm" color="fg.muted">
                    Access your account instantly across all your devices
                  </Text>
                </VStack>
              </HStack>
            </VStack>

            <AddPasskeyButton colorPalette="blue" size="lg" fullWidth />

            <VStack gap={4}>
              <Alert.Root status="info" variant="subtle">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description fontSize="sm">
                    You can always set up your passkey later in your account
                    settings
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <Button
                onClick={() => {
                  router.push("/");
                }}
                variant="ghost"
                size="sm"
                color="fg.muted"
              >
                Skip for now
              </Button>
            </VStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
