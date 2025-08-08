"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import styles from "./navigation.module.css";

interface Props {
	title: string;
}

const items = [
	"아이들 간식으로도 손색이 없는 까르보나라 떡볶이 만들어봐요.",
	"대파를 먹어야 하는 10가지 이유!",
	"쫄깃쫄깃 씹는 소리까지 맛있는 오늘의 요리는 궁중떡볶이입니다.",
];

export default function Navigation({ title }: Props) {
	const params = useParams<{ slug: string }>();
	const slug = decodeURIComponent(params.slug);

	return (
		<nav className={styles.nav}>
			<h2>{title}</h2>
			<ul className={styles.links}>
				{items.map((item) => (
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
