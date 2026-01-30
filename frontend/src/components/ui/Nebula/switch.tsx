import { Switch as SwitchPrimitive } from "radix-ui"
import { cn } from "src/lib/utils"

import s from "@styles/ui/Nebula/switch.module.scss"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default" | "lg" 
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        s.switch,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={s.switchThumb}
      />
    </SwitchPrimitive.Root>
  )
}
export { Switch }