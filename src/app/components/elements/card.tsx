"use client";
import styles from "./card.module.css";

interface Props {
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	children?: React.ReactNode;
	isLoading?: boolean;
}

export default function Card({ children, subtitle, title, isLoading = false }: Props) {
	return (
		<div className={styles.container}>
			{title && (
				<div className={`${styles.heading} ${isLoading ? styles.placeholder : ""}`}>
					{title}
				</div>
			)}
			{subtitle && (
				<div className={`${styles.subtitle} ${isLoading ? styles.placeholder : ""}`}>
					{subtitle}
				</div>
			)}
			{children && (
				<div className={`${styles.body} ${isLoading ? styles.placeholder : ""}`}>
					{children}
				</div>
			)}
		</div>
	);
}
