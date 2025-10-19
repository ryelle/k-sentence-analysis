"use client";
import { useModel } from "@/app/providers/model";
import styles from "./model-control.module.css";
import { useId } from "react";

export default function ModelControl() {
	const htmlId = useId();
	const { model, availableModels, setModel } = useModel();
	const updateModel = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setModel(event.target.value);
	};
    
	return (
		<div className={styles.container}>
			<label htmlFor={htmlId} className={styles.label}>Model</label>
			<select id={htmlId} onChange={updateModel} value={model} className={styles.select}>
				{availableModels.map((opt) => (
					<option value={opt.name} key={opt.name}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
}
