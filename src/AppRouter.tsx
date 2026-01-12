import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import RoutesApp from "./router/routers";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Open Sans",
          },
        }}
      >
        <AntdApp>
          <RoutesApp />
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
export default App;
