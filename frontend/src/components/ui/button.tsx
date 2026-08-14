import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-90 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "btn-skew variant-default",
                destructive: "btn-skew variant-destructive",
                outline: "border-2 border-input bg-transparent hover:border-primary hover:text-primary",
                secondary: "btn-skew variant-secondary",
                ghost: "hover:bg-accent hover:text-accent-foreground border-2 border-transparent",
                link: "text-primary underline-offset-4 hover:underline border-2 border-transparent",
            },
            size: {
                default: "px-6 py-2.5 text-[15px] tracking-[0.5px]",
                sm: "px-4 py-1.5 text-[13px]",
                lg: "px-8 py-3 text-[16px] tracking-[1px]",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
