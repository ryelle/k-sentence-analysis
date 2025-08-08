"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./input.module.css";

export default function Input() {
	const router = useRouter();
	const [value, setValue] = useState("");
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		router.push(`/${encodeURIComponent(value)}`);
	};
	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<input
				lang="ko-KR"
				type="text"
				className={styles.input}
				value={value}
				onChange={handleChange}
			/>
		</form>
	);
}
