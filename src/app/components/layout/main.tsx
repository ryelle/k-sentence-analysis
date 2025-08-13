import styles from "./main.module.css";

export default function Page({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className={styles.main}>
			<div>{children}</div>
		</main>
	);
}
