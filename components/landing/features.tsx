import { Check } from 'lucide-react';

const features = [
	'Automated CIM Generation',
	'Real-time Deal Analytics',
	'Multi-stakeholder Portals',
	'AI Chat Assistance',
	'Secure Data Room',
	'Version Control',
	'Investor Matching',
	'Compliance Automation'
];

export function Features() {
	return (
		<section id="features" className="container mx-auto py-20 md:py-32">
			<div className="text-center">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Everything You Need In One Platform</h2>
				<p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
					The future of investment banking is here. Finvase provides all the tools you need to close deals faster.
				</p>
			</div>
			<div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{features.map((feature, i) => (
					<div key={i} className="flex items-start space-x-4">
						<div className="rounded-full bg-primary/10 p-2 text-primary">
							<Check className="h-5 w-5" />
						</div>
						<div>
							<h3 className="text-lg font-semibold">{feature}</h3>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}