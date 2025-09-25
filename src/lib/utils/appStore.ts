"use client";

import { create } from "zustand";

interface AppState {
  loginPageEmail: string;
}

export const useAppStore = create<AppState>(() => ({
  loginPageEmail: "",
}));

const { setState, getState } = useAppStore;

export function setLoginPageEmail(email: string) {
  setState({ loginPageEmail: email });
}
