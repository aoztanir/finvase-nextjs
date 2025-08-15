import { LayoutDashboard, User, Briefcase } from 'lucide-react';

const platforms = [
	{
		icon: <LayoutDashboard className="h-8 w-8" />,
		title: 'Bank Dashboard',
		description: 'A powerful workspace for banks to manage deals, automate tasks, and collaborate with clients.'
	},
	{
		icon: <User className="h-8 w-8" />,
		title: 'Client Portal',
		description: 'A dedicated portal for clients to track deal progress, upload documents, and communicate with the bank.'
	},
	{
		icon: <Briefcase className="h-8 w-8" />,
		title: 'Investor Access',
		description: 'A secure space for investors to review deals, access materials, and engage with opportunities.'
	}
];

export function PlatformOverview() {
	return (
		<section className="container mx-auto py-20 md:py-32">
			<div className="text-center">
				<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Three Dashboards, One Agentic Workflow</h2>
				<p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
					Specialized interfaces for every stakeholder, all powered by a single AI engine.
				</p>
			</div>
			<div className="mt-12 grid gap-8 md:grid-cols-3">
				{platforms.map((platform, i) => (
					<div key={i} className="rounded-lg border bg-card p-6 text-center">
						<div className="mb-4 inline-block rounded-full bg-primary/10 p-4 text-primary">
							{platform.icon}
						</div>
						<h3 className="text-xl font-bold">{platform.title}</h3>
						<p className="mt-2 text-muted-foreground">{platform.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
