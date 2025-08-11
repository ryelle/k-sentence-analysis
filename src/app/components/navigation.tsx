"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHistory } from "@/app/providers/history";
import Button from "@/app/components/elements/button";

import styles from "./navigation.module.css";

interface Props {
	title: string;
}

export default function Navigation({ title }: Props) {
	const { history, pushHistory, removeHistory } = useHistory();
	const router = useRouter();
	const params = useParams<{ slug: string }>();
	const slug = params.slug ? decodeURIComponent(params.slug) : "";

	useEffect(
		() => {
			if (slug) {
				pushHistory(slug);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[slug],
	);

	// @todo Add way to remove items from history.
	const onDelete = (item: string) => () => {
		removeHistory(item);
		if (item === slug) {
			router.push("/");
		}
	};

	return (
		<nav className={styles.nav}>
			<h2>{title}</h2>
			<ul className={styles.links}>
				{history.map((item) => (
					<li key={item} lang="ko-KR">
						<Link
							href={`/${encodeURIComponent(item)}`}
							aria-current={item === slug ? "page" : false}
						>
							{item}
						</Link>
						<Button onClick={onDelete(item)} className={styles.delete}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="16"
								height="16"
								aria-hidden="true"
								focusable="false"
							>
								<path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z"></path>
							</svg>
							<span className="screen-reader-text">Delete {item}</span>
						</Button>
					</li>
				))}
			</ul>
		</nav>
	);
}
