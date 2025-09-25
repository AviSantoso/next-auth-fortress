"use client";

import { Box, VStack, Card, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LogoutButton } from "../LogoutButton";

export function DashboardPage({ email }: { email: string }) {
  return (
    <Box
      flex={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.subtle"
      p={4}
    >
      <VStack gap={6} w="full" maxW="2xl">
        <Card.Root w="full">
          <Card.Header textAlign="center">
            <Heading size="xl" color="blue.500" mb={2}>
              Welcome back, {email}!
            </Heading>
            <Text color="fg.muted">
              You are now logged in to your secure account.
            </Text>
          </Card.Header>

          <Card.Body>
            <VStack gap={6} align="stretch">
              <VStack gap={4}>
                <Text fontSize="lg" fontWeight="medium" textAlign="center">
                  🚀 Ready to build something amazing?
                </Text>

                <VStack gap={3} align="start">
                  <Text>
                    • <strong>Expert AI Development:</strong> Transform your
                    ideas into production-ready applications
                  </Text>
                  <Text>
                    • <strong>Full-Stack Solutions:</strong> End-to-end
                    development from concept to deployment
                  </Text>
                  <Text>
                    • <strong>Modern Tech Stack:</strong> React, Next.js,
                    Node.js, and cloud-native architectures
                  </Text>
                  <Text>
                    • <strong>Scalable & Secure:</strong> Built for growth with
                    enterprise-grade security
                  </Text>
                </VStack>
              </VStack>

              <VStack gap={4}>
                <Text fontSize="md" fontWeight="medium" textAlign="center">
                  Let&apos;s build your next big idea together
                </Text>

                <VStack gap={2}>
                  <Link
                    href="https://avisantoso.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.500"
                  >
                    💬 Chat with Avi Santoso →
                  </Link>

                  <Link
                    href="https://www.verticalai.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.500"
                  >
                    🚀 Hire VerticalAI →
                  </Link>
                </VStack>
              </VStack>

              <Box pt={4} borderTopWidth="1px" borderColor="border.subtle">
                <LogoutButton />
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}
