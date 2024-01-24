import { createRoot } from "react-dom/client";

import { App } from "@/app";
import { DebugProvider } from "@/components/Debug";

createRoot(document.getElementById('root')!)
  .render(
    <DebugProvider>
      <App />
    </DebugProvider>
  );