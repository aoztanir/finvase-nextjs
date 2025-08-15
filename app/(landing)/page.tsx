import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { PlatformOverview } from '@/components/landing/platform-overview';
import { Comparison } from '@/components/landing/comparison';
import { Features } from '@/components/landing/features';
import { Cta } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
	return (
		<>
			<Header />
			<main className="flex-1">
				<Hero />
				<PlatformOverview />
				<Comparison />
				<Features />
				<Cta />
			</main>
			<Footer />
		</>
	);
}