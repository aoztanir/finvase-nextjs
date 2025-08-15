import { Button } from '@/components/shadcn/button';
import Link from 'next/link';

export function Cta() {
	return (
		<section className="container mx-auto py-20 md:py-32">
			<div className="rounded-lg bg-primary/10 p-8 text-center md:p-16">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to See Finvase in Action?</h2>
				<p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
					Schedule a demo to see how our AI-native platform can transform your investment banking process.
				</p>
				<div className="mt-8">
					<Link href="/signup">
						<Button size="lg">Sign Up for Demo</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
