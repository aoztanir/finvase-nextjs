export function Footer() {
	return (
		<footer className="border-t">
			<div className="w-full max-w-6xl mx-auto flex h-14 items-center justify-center px-4 sm:px-6 lg:px-8">
				<p className="text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Finvase. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
