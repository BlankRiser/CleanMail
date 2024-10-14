"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

type GlobalProviderProps = React.ComponentProps<"div">;

const queryClient = new QueryClient();

export const GlobalProvider: React.FC<GlobalProviderProps> = ({
  children,
  ...rest
}) => {
  return (
    <SessionProvider {...rest}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
};
