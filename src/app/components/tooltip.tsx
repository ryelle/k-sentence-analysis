"use client";

import { Button, Tooltip, TooltipTrigger, type TooltipProps } from "react-aria-components";

import styles from "./tooltip.module.css";

interface MyTooltipProps extends Omit<TooltipProps, "children"> {
	title: string;
	children: React.ReactNode;
}

export default function WordTooltip({ children, title, ...props }: MyTooltipProps) {
	return (
		<TooltipTrigger delay={0}>
			<Tooltip {...props}>
				<div className={styles.tooltip}>{title}</div>
			</Tooltip>
			<Button className={styles.button}>{children}</Button>
		</TooltipTrigger>
	);
}
