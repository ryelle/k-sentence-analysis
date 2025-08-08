"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useHistory } from "@/app/providers/history";
import { useEffect } from "react";

import styles from "./navigation.module.css";

interface Props {
	title: string;
}

export default function Navigation({ title }: Props) {
	const { history, pushHistory } = useHistory();
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

	return (
		<nav className={styles.nav}>
			<h2>{title}</h2>
			<ul className={styles.links}>
				{history.map((item) => (
					<li key={item} lang="ko-KR">
						<Link href={`/${item}`} aria-current={item === slug ? "page" : false}>
							{item}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
