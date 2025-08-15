export function Footer() {
	return (
		<footer className="border-t">
			<div className="container mx-auto flex h-14 items-center justify-center">
				<p className="text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Finvase. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
