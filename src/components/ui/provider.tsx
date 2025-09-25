"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { ColorModeProvider } from "./color-mode";

const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      colorPalette: "blue",
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: { value: "var(--font-bricolage-grotesque)" },
      },
    },
    semanticTokens: {
      radii: {
        l1: { value: "0.375rem" },
        l2: { value: "0.5rem" },
        l3: { value: "0.75rem" },
      },
    },
  },
});

export const Provider = (props: PropsWithChildren) => (
  <ChakraProvider value={system}>
    <ColorModeProvider>{props.children}</ColorModeProvider>
  </ChakraProvider>
);
