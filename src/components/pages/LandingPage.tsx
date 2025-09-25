"use client";

import {
  Box,
  VStack,
  Card,
  Heading,
  Text,
  Container,
  List,
  ListItem,
  Icon,
  Separator,
  Grid,
  GridItem,
  Button,
  ButtonGroup,
  Code,
  Link as CkLink,
  Badge,
  HStack,
  Table,
} from "@chakra-ui/react";
import {
  MdKey,
  MdDescription,
  MdHelp,
  MdSecurity,
  MdSettings,
  MdOpenInNew,
  MdLink,
  MdCode,
  MdDataArray,
} from "react-icons/md";
import { useEmail } from "@/components/providers/AuthProvider";

const REPO_BASE = "https://github.com/avisantoso/next-auth-fortress";
const README_URL = `${REPO_BASE}/blob/main/README.md`;
const FAQ_URL = `${REPO_BASE}/blob/main/FAQ.md`;
const WEBAUTHN_TUTORIAL_URL = `${REPO_BASE}/blob/main/WEBAUTHN_TUTORIAL.md`;

const BLOG_URL = "https://avisantoso.com/blog";
const AI_HELP_URL = "https://verticalai.com.au";

export function LandingPage() {
  const { email } = useEmail();
  return (
    <Box
      flex={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.subtle"
      py={8}
      px={4}
    >
      <Container
        maxW="6xl"
        py={4}
        display="flex"
        flexDirection="column"
        gap={8}
      >
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6}>
          <GridItem>
            <Card.Root variant="subtle">
              <Card.Header>
                <HStack>
                  <Icon as={MdSettings} color="blue.500" />
                  <Heading size="sm">1. Configure environment</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Text fontSize="sm" color="fg.muted">
                    Create your environment file:
                  </Text>
                  <Code size="sm">cp dotenv.example .env.local</Code>

                  <Table.Root size="sm" mt={2} variant="outline">
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width="100px">
                          <Badge>Required</Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Code>SESSION_KEY</Code>
                          <br />
                          <Code>DATABASE_URL</Code>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Badge>OAuth</Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Code>GOOGLE_CLIENT_ID</Code>
                          <br />
                          <Code>GOOGLE_CLIENT_SECRET</Code>
                          <br />
                          <Code>GOOGLE_REDIRECT_URL</Code>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Badge>Email</Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Code>RESEND_API_KEY</Code>
                          <br />
                          <Code>NOREPLY_EMAIL</Code>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Badge>App</Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Code>NEXT_PUBLIC_APP_URL</Code>
                          <br />
                          <Code>RPID</Code>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>

                  <CkLink
                    href={README_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.solid"
                    fontSize="sm"
                  >
                    See README for details
                    <Icon as={MdOpenInNew} ml={1} />
                  </CkLink>
                </VStack>
              </Card.Body>
            </Card.Root>
          </GridItem>

          <GridItem>
            <Card.Root variant="subtle">
              <Card.Header>
                <HStack>
                  <Icon as={MdDataArray} color="blue.500" />
                  <Heading size="sm">2. Set up the database</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Text fontSize="sm" color="fg.muted">
                    Push the schema to your Postgres database:
                  </Text>
                  <Code size="sm">pnpm db:push</Code>

                  <Text fontSize="sm" color="fg.muted" mt={2}>
                    For production, use Drizzle migrations:
                  </Text>
                  <VStack gap={4} align="start">
                    <Code size="sm">pnpm db:generate</Code>
                    <Code size="sm">pnpm db:migrate</Code>
                  </VStack>

                  <CkLink
                    href={README_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.solid"
                    fontSize="sm"
                  >
                    Database notes in README
                    <Icon as={MdOpenInNew} ml={1} />
                  </CkLink>
                </VStack>
              </Card.Body>
            </Card.Root>
          </GridItem>

          <GridItem>
            <Card.Root variant="subtle">
              <Card.Header>
                <HStack>
                  <Icon as={MdKey} color="blue.500" />
                  <Heading size="sm">3. Choose an auth flow</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Text fontSize="sm">Available options:</Text>
                  <List.Root gap={2}>
                    <ListItem>
                      <Icon as={MdLink} color="blue.400" mr={2} />
                      Magic Link (email)
                    </ListItem>
                    <ListItem>
                      <Icon as={MdLink} color="blue.400" mr={2} />
                      Google OAuth 2.0
                    </ListItem>
                    <ListItem>
                      <Icon as={MdLink} color="blue.400" mr={2} />
                      WebAuthn (Passkeys)
                    </ListItem>
                  </List.Root>
                  <CkLink
                    href={WEBAUTHN_TUTORIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.solid"
                    fontSize="sm"
                  >
                    Learn how passkeys work
                    <Icon as={MdOpenInNew} ml={1} />
                  </CkLink>
                </VStack>
              </Card.Body>
            </Card.Root>
          </GridItem>
        </Grid>

        <Card.Root w="full" variant="subtle" shadow="md">
          <Card.Header pb={0}>
            <VStack gap={1} align="center" mb={2}>
              <Text fontSize="md" color="fg.muted">
                Signed in as {email}
              </Text>
            </VStack>
          </Card.Header>

          <Card.Body pt={6}>
            <VStack gap={4}>
              <ButtonGroup variant="outline" size="sm">
                <Button asChild>
                  <a
                    href={README_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon as={MdDescription} mr={2} />
                    README
                    <Icon as={MdOpenInNew} ml={2} />
                  </a>
                </Button>
                <Button asChild>
                  <a href={FAQ_URL} target="_blank" rel="noopener noreferrer">
                    <Icon as={MdHelp} mr={2} />
                    FAQ
                    <Icon as={MdOpenInNew} ml={2} />
                  </a>
                </Button>
                <Button asChild>
                  <a
                    href={WEBAUTHN_TUTORIAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon as={MdSecurity} mr={2} />
                    WebAuthn Tutorial
                    <Icon as={MdOpenInNew} ml={2} />
                  </a>
                </Button>
              </ButtonGroup>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root w="full" variant="subtle" shadow="sm">
          <Card.Header>
            <HStack gap={2}>
              <Icon as={MdCode} color="blue.500" />
              <Heading size="sm">Key files in this template</Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
              <GridItem>
                <Text fontWeight="light" mb={4}>
                  Auth flows (server actions)
                </Text>
                <Table.Root size="sm" variant="outline">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/actions/sendMagicLink.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Email magic link</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/actions/getGoogleAuthUrl.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Google OAuth URL</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>
                          src/actions/passkeys/getRegistrationOptions.ts
                        </Code>
                      </Table.Cell>
                      <Table.Cell>Passkey options</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/actions/passkeys/verifyRegistration.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Save credential</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/actions/passkeys/getLoginOptions.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Login options</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/actions/passkeys/verifyLogin.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Verify login</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </GridItem>

              <GridItem>
                <Text fontWeight="light" mb={4}>
                  Core utilities & schema
                </Text>
                <Table.Root size="sm" variant="outline">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/lib/utils/getSession.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Iron Session</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/lib/utils/schema.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Drizzle schema</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/lib/utils/db.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Database client</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/lib/utils/webauthn.ts</Code>
                      </Table.Cell>
                      <Table.Cell>Host settings & challenge</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <Code>src/app/api/auth/*</Code>
                      </Table.Cell>
                      <Table.Cell>OAuth / magic link callbacks</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table.Root>
              </GridItem>
            </Grid>
          </Card.Body>
        </Card.Root>

        <Separator my={8} />

        {/* Subtle personal links */}
        <Card.Root variant="subtle">
          <Card.Body>
            <VStack gap={2} align="center">
              <Text color="fg.muted" fontSize="sm">
                Looking for more context or walkthroughs?
              </Text>
              <HStack gap={4}>
                <CkLink
                  href={BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue.solid"
                  fontWeight="medium"
                  fontSize="sm"
                >
                  Personal Blog
                  <Icon as={MdOpenInNew} ml={1} />
                </CkLink>
                <CkLink
                  href={AI_HELP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue.solid"
                  fontWeight="medium"
                  fontSize="sm"
                >
                  AI Expertise
                  <Icon as={MdOpenInNew} ml={1} />
                </CkLink>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
    </Box>
  );
}
