export function Comparison() {
	return (
		<section className="container mx-auto py-20 md:py-32">
			<div className="text-center">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">The Finvase Advantage</h2>
				<p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
					See how our AI-native platform stacks up against traditional investment banking.
				</p>
			</div>
			<div className="mt-12 grid gap-8 md:grid-cols-2">
				<div className="rounded-lg border bg-card p-6">
					<h3 className="text-2xl font-bold">Traditional</h3>
					<ul className="mt-4 space-y-2 text-muted-foreground">
						<li>
							<span className="font-semibold text-foreground">Timeline:</span> 6-12 months
						</li>
						<li>
							<span className="font-semibold text-foreground">Team:</span> 5-10 analysts
						</li>
						<li>
							<span className="font-semibold text-foreground">Cost:</span> High, variable fees
						</li>
					</ul>
				</div>
				<div className="rounded-lg border-2 border-primary bg-card p-6">
					<h3 className="text-2xl font-bold">Finvase</h3>
					<ul className="mt-4 space-y-2 text-muted-foreground">
						<li>
							<span className="font-semibold text-foreground">Timeline:</span> 2-4 weeks
						</li>
						<li>
							<span className="font-semibold text-foreground">Team:</span> 1 AI agent
						</li>
						<li>
							<span className="font-semibold text-foreground">Cost:</span> Fixed, transparent pricing
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
}
