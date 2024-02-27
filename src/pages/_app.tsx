import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // 개발자 도구

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={true} position="bottom" />
    </QueryClientProvider>
  )
}
