"use client";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./input.module.css";

interface Props {
	label: string;
	placeholder?: string;
	autofocus?: boolean;
}

export default function Input({ label, placeholder = "", autofocus = false }: Props) {
	const router = useRouter();
	const [value, setValue] = useState("");
	const htmlId = useId();
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		router.push(`/${encodeURIComponent(value.replace(/^\s/, "").replace(/\s$/, ""))}`);
	};
	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<label htmlFor={htmlId} className="screen-reader-text">
				{label}
			</label>
			<input
				id={htmlId}
				lang="ko-KR"
				type="text"
				className={styles.input}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				autoFocus={autofocus}
			/>
		</form>
	);
}
