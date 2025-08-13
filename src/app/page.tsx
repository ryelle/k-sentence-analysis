import Link from "next/link";
import { Container, Main, Sidebar } from "@/app/components/layout";
import Input from "@/app/components/elements/input";

const examples = [
	"아이스 아메리카노 두 잔 주세요.",
	"내가 어릴 때는 바다에 수영하러 가곤 했었지.",
	"콩나물국은 맵지 않아서 먹을 만해요.",
	"처음 키워 보는 건데 어렵지는 않겠지요?",
	"어렵지 않으니 따라 해봐요.",
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
