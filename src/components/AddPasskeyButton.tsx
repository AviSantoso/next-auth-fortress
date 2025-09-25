"use client";

import React, { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { Button, Icon, HStack, Text } from "@chakra-ui/react";
import { MdFingerprint } from "react-icons/md";
import { get } from "lodash";

import { getRegistrationOptions } from "@/actions/passkeys/getRegistrationOptions";
import { verifyRegistration } from "@/actions/passkeys/verifyRegistration";
import { toaster } from "./ui/toaster";
import { useRouter } from "next/navigation";

export interface AddPasskeyButtonProps {
  variant?: "solid" | "outline" | "ghost";
  colorPalette?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function AddPasskeyButton({
  variant = "solid",
  colorPalette = "blue",
  size = "lg",
  fullWidth = true,
}: AddPasskeyButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPasskey = async () => {
    setIsLoading(true);

    try {
      const options = await getRegistrationOptions();

      if (!options) {
        toaster.create({
          title:
            "Could not get passkey registration options. Are you logged in?",
          type: "error",
        });
        return;
      }

      const registrationResponse = await startRegistration({
        optionsJSON: options,
      });

      await verifyRegistration(registrationResponse);

      toaster.create({
        title: "Passkey added successfully! You can now use it to sign in.",
        type: "success",
      });

      router.push("/");
    } catch (err: unknown) {
      if (get(err, "name") === "NotAllowedError") {
        toaster.create({
          title: "Passkey registration was cancelled.",
          type: "error",
        });
        return;
      }
      console.error(err);
      toaster.create({
        title: "Error during passkey registration.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddPasskey}
      colorPalette={colorPalette}
      variant={variant}
      size={size}
      w={fullWidth ? "full" : "auto"}
      loading={isLoading}
      loadingText="Processing..."
    >
      <HStack gap={2}>
        <Icon>
          <MdFingerprint />
        </Icon>
        <Text>{isLoading ? "Waiting for device..." : "Add Passkey"}</Text>
      </HStack>
    </Button>
  );
}
