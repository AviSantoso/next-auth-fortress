"use client";

import {
  Box,
  Card,
  Text,
  Heading,
  VStack,
  Spinner,
  Progress,
} from "@chakra-ui/react";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

function getNormalDistribution() {
  return (Math.random() + Math.random()) / 2;
}

export function LoadingPage() {
  const [progress, setProgress] = useState(0);

  useInterval(() => {
    setProgress((prev) => {
      if (prev >= 95) return 95;
      return prev + (95 - prev) / (getNormalDistribution() * 20);
    });
  }, 100);

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
          <Heading size="xl" color="blue.solid">
            Next-Auth Fortress
          </Heading>
          <Text color="fg.muted" mt={2}>
            Initializing your session...
          </Text>
        </Card.Header>

        <Card.Body>
          <VStack gap={6}>
            {/* Loading Spinner */}
            <Box textAlign="center">
              <Spinner size="xl" color="blue.solid" />
            </Box>

            {/* Loading Text */}
            <VStack gap={2}>
              <Text fontSize="lg" fontWeight="medium">
                Please Wait
              </Text>
              <Text fontSize="sm" color="fg.muted">
                Securing your connection...
              </Text>
            </VStack>

            {/* Progress Bar */}
            <Box w="full">
              <Progress.Root value={progress} max={100}>
                <Progress.Track>
                  <Progress.Range colorPalette="blue" />
                </Progress.Track>
              </Progress.Root>
            </Box>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
