import Link from "next/link";
import { Container, Main, Sidebar } from "@/app/components/layout";
import Input from "@/app/components/elements/input";

const examples = [
	"아이스 아메리카노 두 잔 주세요.",
	"아이들 간식으로도 손색이 없는 까르보나라 떡볶이 만들어봐요.",
	"우주에 그렇게 많은 행성이 있는데 외계인이 없을 리가 없어요.",
];

export default function Home() {
	return (
		<Container>
			<Sidebar />
			<Main>
				<h2>Enter your sentence</h2>
				<Input label="Enter your sentence" autofocus />
				<div>
					<h3>Example sentences</h3>
					<ul>
						{examples.map((item) => (
							<li key={item} lang="ko-KR">
								<Link href={`/${item}`}>{item}</Link>
							</li>
						))}
					</ul>
				</div>
				<p>
					This uses [ChatGPT whatever-model] to break down sentences into component parts
					for studying Korean. It will output a translation with grammar points for
					reference.
				</p>
			</Main>
		</Container>
	);
}
