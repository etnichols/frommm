import * as React from "react";

import { cn } from "@lib/utils";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | React.ReactNode;
  mode?: "default" | "left" | "right";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, mode = "default", children, ...props }, ref) => {
    let titleElement = null;
    
    if (title || mode) {
      if (mode === "left") {
        titleElement = (
          <header className="flex items-end justify-between">
            <div 
              className="flex-shrink-0 shadow-[inset_2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] px-4 pb-0" 
              aria-hidden="true" 
            />
            {title ? <h2 className="flex-shrink-0 px-4 text-base font-bold">{title}</h2> : null}
            <div 
              className="min-w-[10%] w-full shadow-[inset_-2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] pr-8 pb-0 pl-4" 
              aria-hidden="true" 
            />
          </header>
        );
      } else if (mode === "right") {
        titleElement = (
          <header className="flex items-end justify-between">
            <div 
              className="min-w-[10%] w-full shadow-[inset_2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] pr-8 pb-0 pl-4" 
              aria-hidden="true" 
            />
            {title ? <h2 className="flex-shrink-0 px-4 text-base font-bold">{title}</h2> : null}
            <div 
              className="flex-shrink-0 shadow-[inset_-2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] px-4 pb-0" 
              aria-hidden="true" 
            />
          </header>
        );
      } else {
        titleElement = (
          <header className="flex items-end justify-between">
            <div 
              className="min-w-[10%] w-full shadow-[inset_2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] pr-8 pb-0 pl-4" 
              aria-hidden="true" 
            />
            {title ? <h2 className="flex-shrink-0 px-4 text-base font-bold">{title}</h2> : null}
            <div 
              className="min-w-[10%] w-full shadow-[inset_-2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] pr-8 pb-0 pl-4" 
              aria-hidden="true" 
            />
          </header>
        );
      }
    }

    return (
      <article
        ref={ref}
        className={cn("relative block p-0 whitespace-pre-wrap", className)}
        {...props}
      >
        {titleElement}
        <section 
          className="block pt-[calc(var(--theme-line-height-base)*0.5rem)] px-8 pb-[calc(var(--theme-line-height-base)*1rem)] overflow-visible shadow-[inset_2px_0_0_0_var(--theme-text),inset_-2px_0_0_0_var(--theme-text),inset_0_-2px_0_0_var(--theme-text)]"
        >
          {children}
        </section>
      </article>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-end justify-between", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "flex-shrink-0 px-4 text-base font-bold",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "block pt-[calc(var(--theme-line-height-base)*0.5rem)] px-8 pb-[calc(var(--theme-line-height-base)*1rem)] overflow-visible shadow-[inset_2px_0_0_0_var(--theme-text),inset_-2px_0_0_0_var(--theme-text),inset_0_-2px_0_0_var(--theme-text)]", 
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const CardLeftSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "min-w-[10%] w-full shadow-[inset_2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] pr-8 pb-0 pl-4",
      className
    )}
    {...props}
  />
));
CardLeftSection.displayName = "CardLeftSection";

const CardLeftCorner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-shrink-0 shadow-[inset_2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] px-4 pb-0",
      className
    )}
    {...props}
  />
));
CardLeftCorner.displayName = "CardLeftCorner";

const CardRightSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "min-w-[10%] w-full shadow-[inset_-2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] pr-8 pb-0 pl-4",
      className
    )}
    {...props}
  />
));
CardRightSection.displayName = "CardRightSection";

const CardRightCorner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-shrink-0 shadow-[inset_-2px_0_0_0_var(--theme-text),inset_0_2px_0_0_var(--theme-text)] pt-[calc((var(--font-size)*0.5)*var(--theme-line-height-base))] px-4 pb-0",
      className
    )}
    {...props}
  />
));
CardRightCorner.displayName = "CardRightCorner";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardLeftSection,
  CardLeftCorner,
  CardRightSection,
  CardRightCorner
};
