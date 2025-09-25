"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";
import { Button, Icon, HStack, Text } from "@chakra-ui/react";
import { MdKey } from "react-icons/md";
import { get } from "lodash";

import { getLoginOptions } from "@/actions/passkeys/getLoginOptions";
import { verifyLogin } from "@/actions/passkeys/verifyLogin";
import { toaster } from "./ui/toaster";

export interface LoginWithPasskeyButtonProps {
  variant?: "solid" | "outline" | "ghost";
  colorPalette?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function LoginWithPasskeyButton({
  variant = "solid",
  size = "lg",
  fullWidth = true,
}: LoginWithPasskeyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    try {
      e.preventDefault();
      e.stopPropagation();
      setIsLoading(true);

      const options = await getLoginOptions();

      if (!options) {
        throw new Error(
          "User not found or no passkeys registered for this account."
        );
      }

      const authResponse = await startAuthentication({
        optionsJSON: options,
      });

      await verifyLogin(authResponse);

      toaster.create({
        title: "Login successful!",
        type: "success",
      });

      redirect("/");
    } catch (err: unknown) {
      if (get(err, "name") === "NotAllowedError") {
        toaster.create({
          title: "Login was cancelled by the user.",
          type: "error",
        });
        return;
      }

      console.error("Error during passkey login:", err);
      toaster.create({
        title: "Error during passkey login.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      w={fullWidth ? "full" : "auto"}
      loading={isLoading}
      loadingText="Signing in..."
      onClick={handleLogin}
    >
      <HStack gap={2}>
        <Icon>
          <MdKey />
        </Icon>
        <Text>Sign In with Passkey</Text>
      </HStack>
    </Button>
  );
}
