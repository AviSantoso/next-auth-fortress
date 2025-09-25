"use client";

import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: MainLayoutProps) {
  return (
    <Flex 
      direction="column" 
      minH="100vh" 
      bg="bg.subtle"
    >
      {showHeader && <Header />}
      
      <Box 
        flex="1"
        display="flex"
        flexDirection="column"
      >
        {children}
      </Box>
      
      {showFooter && <Footer />}
    </Flex>
  );
}
