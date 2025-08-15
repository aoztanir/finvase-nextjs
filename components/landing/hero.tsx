import { Button } from '@/components/shadcn/button';
import Link from 'next/link';

export function Hero() {
	return (
		<section className="container mx-auto grid items-center gap-6 pb-8 pt-6 md:py-10 lg:grid-cols-2">
			<div className="flex max-w-xl flex-col items-start gap-4">
				<h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
					AI-Native Investment Banking
				</h1>
				<p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
					Replace traditional analysts with autonomous AI agents. Deliver results in weeks, not
					months.
				</p>
				<div className="flex gap-4">
					<Link href="/signup">
						<Button size="lg">Sign Up for Demo</Button>
					</Link>
					<Link href="#features">
						<Button variant="outline" size="lg">
							Learn More
						</Button>
					</Link>
				</div>
			</div>
			<div className="hidden h-[400px] rounded-lg border bg-muted p-4 lg:block">
				{/* Placeholder for the visual element */}
				<div className="flex h-full w-full items-center justify-center rounded-md bg-background">
					<p className="text-muted-foreground">[Visual Placeholder]</p>
				</div>
			</div>
		</section>
	);
}