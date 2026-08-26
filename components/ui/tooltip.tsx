"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipPortal = TooltipPrimitive.Portal

function TooltipPositioner({
  sideOffset = 8,
  ...props
}: TooltipPrimitive.Positioner.Props) {
  return (
    <TooltipPrimitive.Positioner
      data-slot="tooltip-positioner"
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function TooltipPopup({ className, children, ...props }: TooltipPrimitive.Popup.Props) {
  return (
    <TooltipPrimitive.Popup
      data-slot="tooltip-popup"
      className={cn(
        "z-50 max-w-56 rounded-lg bg-foreground px-3 py-2 text-xs leading-relaxed text-background shadow-md transition-[transform,opacity] duration-100 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </TooltipPrimitive.Popup>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipPortal, TooltipPositioner, TooltipPopup }
