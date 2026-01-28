import style from "@styles/ui/Nebula/button.module.scss"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui";
import { cn } from "src/lib/utils";

const buttonVariants = cva(style.baseButton, {
    variants: {
        variant: {
            default: style.defaultVariant,
            oppose: style.opposeVariant,
            outline: style.outlineVariant,
            secondary: style.secondaryVariant,
            ghost: style.ghostVariant,
            destructive: style.destructiveVariant,
            link: style.linkVariant,
        },
        size: {
            default: style.defaultSize,
            xs: style.extraSmallSize,
            sm: style.smallSize,
            lg: style.largeSize,
            icon: style.defaultIcon,
            "icon-xs": style.extraSmallIcon,
            "icon-sm": style.smallIcon,
            "icon-lg": style.largeIcon,
        },
        bg: {
            light: style.bgLight,
            dark: style.bgDark
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default",
        bg: "light"
    },
})

export function Button({
    className,
    notification = 0,
    variant = "default",
    size = "default",
    bg = "light",
    asChild,
    ...props
}: {
    className?: string;
    variant?: VariantProps<typeof buttonVariants>["variant"];
    size?: VariantProps<typeof buttonVariants>["size"];
    bg?: VariantProps<typeof buttonVariants>["bg"];
    [key: string]: any;
}): React.ReactNode {

    const Comp = asChild ? Slot.Root : "button"


    return (
        <Comp
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, bg }), className)}
            {...props}
        />
    )
}