import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router"
import "xterm/css/xterm.css"
import { DevPodProvider, SettingsProvider } from "./contexts"
import { router } from "./routes"
import { ThemeProvider } from "./Theme"
import { ColorModeScript } from "@chakra-ui/react"
import { client } from "./client"

dayjs.extend(relativeTime)
client.subscribe("event", console.warn)


const queryClient = new QueryClient({
  logger: {
    log(...args) {
      console.log(args)
    },
    warn(...args) {
      console.warn(args)
    },
    error(...args) {
      const maybeError = args[0]
      if (maybeError instanceof Error) {
        console.error(maybeError.name, maybeError.message, maybeError.cause, maybeError)

        return
      }

      console.error(args)
    },
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<Root />)

function Root() {
  return (
    <StrictMode>
      <ColorModeScript initialColorMode="system" />
      <SettingsProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <DevPodProvider>
              <RouterProvider router={router} />
            </DevPodProvider>
            {/* Will be disabled in production automatically */}
            <ReactQueryDevtools
              position="bottom-right"
              toggleButtonProps={{ style: { margin: "0.5em 0.5em 2rem" } }}
            />
          </QueryClientProvider>
        </ThemeProvider>
      </SettingsProvider>
    </StrictMode>
  )
}
