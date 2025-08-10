import { Container, Main, Sidebar } from "@/app/components/layout";
import Explainer from "@/app/components/explainer";
import HomeButton from "@/app/components/home-button";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	return (
		<Container>
			<Sidebar />
			<Main>
				<h2 className="screen-reader-text">Annotated sentence</h2>
				<Explainer input={slug} />
				<HomeButton />
			</Main>
		</Container>
	);
}
