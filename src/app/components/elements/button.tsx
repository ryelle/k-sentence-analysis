"use client";

import Link from "next/link";
import styles from "./button.module.css";

interface BaseProps {
	children: React.ReactNode;
	className?: string;
}

interface ButtonProps extends BaseProps {
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	href?: never;
}

interface LinkProps extends BaseProps {
	href: string;
	onClick?: never;
}

export default function Button({
	href,
	onClick,
	children,
	className = "",
}: ButtonProps | LinkProps) {
	if (href) {
		return (
			<Link href={href} className={`${className} ${styles.button} is-link`}>
				{children}
			</Link>
		);
	}
	return (
		<button onClick={onClick} className={`${className} ${styles.button} is-button`}>
			{children}
		</button>
	);
}
