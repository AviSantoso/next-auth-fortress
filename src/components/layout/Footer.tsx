"use client";

import { Box, Text, Link, VStack } from "@chakra-ui/react";

export function Footer() {
  return (
    <Box
      as="footer"
      width="full"
      py={6}
      px={4}
      mt="auto"
      textAlign="center"
      opacity={0.7}
    >
      <VStack gap={1}>
        <Text fontSize="sm" color="fg.muted">
          Built by{" "}
          <Link
            href="https://avisantoso.com"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.solid"
            fontWeight="medium"
          >
            Avi Santoso
          </Link>
          .
        </Text>
        <Text fontSize="sm" color="fg.muted">
          Need an AI expert? Visit{" "}
          <Link
            href="https://www.verticalai.com.au"
            target="_blank"
            rel="noopener noreferrer"
            color="blue.solid"
            fontWeight="medium"
          >
            VerticalAI
          </Link>
          .
        </Text>
      </VStack>
    </Box>
  );
}
