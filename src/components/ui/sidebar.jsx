import React, { createContext, useContext, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils"; // keep this if you have the utility

const SidebarContext = createContext({
  open: true,
  toggle: () => {},
  isMobile: false,
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(true);
  const isMobile = window.innerWidth < 768;

  const toggle = () => setOpen((v) => !v);

  return (
    <SidebarContext.Provider value={{ open, toggle, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children }) => {
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-gray-800 text-white transition-width duration-300",
        open ? "w-64" : "w-16"
      )}
    >
      {children}
    </aside>
  );
};

export const SidebarTrigger = () => {
  const { toggle } = useSidebar();
  return (
    <button
      className="fixed top-4 left-4 p-2 bg-gray-700 rounded text-white"
      onClick={toggle}
      aria-label="Toggle Sidebar"
    >
      <PanelLeft />
    </button>
  );
};

export const SidebarMenu = ({ children }) => (
  <ul className="flex flex-col mt-4 space-y-2">{children}</ul>
);

export const SidebarMenuItem = ({ children }) => (
  <li className="px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">{children}</li>
);

export const SidebarMenuButton = ({ asChild, children }) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className="flex items-center gap-2 w-full text-left">{children}</Comp>;
};
