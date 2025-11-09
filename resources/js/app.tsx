import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/Components/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import SwipeDetector from "@/Components/SwipeDetector";
import { ToastProvider } from "@/Components/ToastProvider";
import { PageProps } from "@/types";
// const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

// createInertiaApp({
//     title: (title) => `${title} - ${appName}`,
//     resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
//     setup({ el, App, props }) {
//         const root = createRoot(el);

//         root.render(<App {...props} />);
//     },
//     progress: {
//         color: '#4B5563',
//     },
// });

// createInertiaApp({
//   resolve: (name) => {
//     const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
//     return pages[`./Pages/${name}.tsx`];
//   },
//   setup({ el, App, props }) {
//     const root = createRoot(el);
//     root.render(<App {...props} />);
//   },
// });

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
    return pages[`./Pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    const auth = (props.initialPage.props as any).auth;
    root.render(
      <AnimatePresence mode="wait">
        <motion.div
          key={props.initialPage.component} // 🔑 important: change on route
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="min-h-screen"
        >
          <SidebarProvider>
            <App {...props} />
            {/* <Sidebar auth={auth} currentUrl={window.location.pathname} /> */}
            <SwipeDetector />
            <ToastProvider />
          </SidebarProvider>
        </motion.div>
      </AnimatePresence>
    );
  },
});