import Link from "next/link";
import Navigation from "@/app/components/navigation";
import styles from "./sidebar.module.css";
import ModelControl from '@/app/components/model-control';

export default function Sidebar() {
	return (
		<div className={styles.sidebar}>
			<header>
				<h1>
					<Link href="/">Korean Sentence Analysis</Link>
				</h1>
				<p>
					A learning tool by <a href="https://ryelle.codes">ryelle.codes</a>
				</p>
			</header>
			<ModelControl />
			<Navigation title="History" />
		</div>
	);
}
