
import { cn } from "@lib/utils";
import { Button } from "./button";
import React from "react";
import { Icon } from "./icon";

type SidebarContextProps = {
    state: "expanded" | "collapsed"
    open: boolean
    setOpen: (open: boolean) => void
    toggleSidebar: () => void
}

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"


const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.")
    }
    return context
}

function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
                if (setOpenProp) {
                    setOpenProp(openState)
                } else {
                    _setOpen(openState)
                }
                document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
            },
        [setOpenProp, open]
    )
    const toggleSidebar = React.useCallback(() => {
        return setOpen((open) => !open)
    }, [setOpen])
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
        if (
            event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
            (event.metaKey || event.ctrlKey)
        ) {
            event.preventDefault()
            toggleSidebar()
        }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"
    const contextValue = React.useMemo<SidebarContextProps>(
        () => ({
            state,
            open,
            setOpen,
            toggleSidebar,
        }),
        [state, open, setOpen, toggleSidebar]
    )
    return (
        <SidebarContext.Provider value={contextValue}>
            <div
                data-component="sidebar-wrapper"
                style={
                {
                    "--sidebar-width": SIDEBAR_WIDTH,
                    "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                    ...style,
                } as React.CSSProperties
                }
                className={cn(
                    "has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    )
}

function Sidebar({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    const {state} = useSidebar();

    return (
    <div 
        data-component="sidebar"
        data-state= {state}
    >
        <div
            data-component="sidebar-gap"
        >
            <div
                data-component="sidebar-container"
                className={cn(className)}
                {...props}
            >
                <div
                    data-component="sidebar-inner"
                >
                    {children}
                </div>

            </div>

        </div>

    </div>
    )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <Icon value=""/>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarHeader() {
    
}

function SidebarFooter() {
    
}

function SidebarContent() {
    
}