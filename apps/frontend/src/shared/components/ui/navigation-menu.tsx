"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@frontend/lib/utils";

const NavigationMenu = ({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) => (
  <NavigationMenuPrimitive.Root
    data-slot="navigation-menu"
    className={cn("relative z-50 flex items-center", className)}
    {...props}
  />
);

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

type LinkProps = React.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  active?: boolean;
  asChild?: boolean;
};

function NavigationMenuLink({ className, active, asChild, ...props }: LinkProps) {
  return (
    <NavigationMenuPrimitive.Link asChild={asChild} {...props}>
      {asChild ? (
        <Slot
          data-slot="navigation-menu-link"
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative inline-flex items-center rounded-full min-h-11 px-3 text-sm font-medium transition-colors",
            "text-text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            active && "text-primary",
            "after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary/60 after:opacity-0 after:transition-opacity",
            active && "after:opacity-100",
            className
          )}
        />
      ) : (
        <a
          data-slot="navigation-menu-link"
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative inline-flex items-center rounded-full min-h-11 px-3 text-sm font-medium transition-colors",
            "text-text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            active && "text-primary",
            "after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary/60 after:opacity-0 after:transition-opacity",
            active && "after:opacity-100",
            className
          )}
        />
      )}
    </NavigationMenuPrimitive.Link>
  );
}

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn("top-full z-10 flex h-1 items-end justify-center", className)}
      {...props}
    />
  );
}

function NavigationMenuViewport({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full flex w-full justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "bg-surface border border-border shadow-md mt-2 rounded-xl overflow-hidden",
          className
        )}
        {...props}
      />
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
