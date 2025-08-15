import Link from "next/link";
import { Container, Main, Sidebar } from "@/app/components/layout";
import Input from "@/app/components/elements/input";

const examples = [
	"아이스 아메리카노 두 잔 주세요.",
	"지금 가을이라서 단풍이 정말 아름다울 거예요.",
	"그 일은 고생할 만한 가치가 없으니까 하지 않는 게 좋겠어요.",
	"한국어는 공부할 만해요.",
	"어제는 많이 춥던데 오늘은 따뜻하네요.",
	"네, 남산에서 본 서울 야경이 아주 아름답던데요.",
	"아마 커피숍에 있을걸요.",
	"손님이 없는 걸 보니 저 식당은 음식이 맛없나 봐요.",
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
					This uses ChatGPT 4.1 nano to break down sentences into component parts
					for studying Korean. It will output a translation with grammar points for
					reference.
				</p>
			</Main>
		</Container>
	);
}
