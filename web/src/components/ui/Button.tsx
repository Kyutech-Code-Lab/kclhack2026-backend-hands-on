import type { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
  ariaPressed?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ariaPressed,
  onClick,
}: ButtonProps) {
  // children には <Button>ここに書いた文字</Button> の中身が入ります。
  const classes = `button button--${variant}${className ? ` ${className}` : ""}`;

  return (
    <button
      aria-pressed={ariaPressed}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
