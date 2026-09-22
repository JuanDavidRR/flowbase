import { useId, useRef, useState, type FocusEvent, type SubmitEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pushDataLayerEvent(event: string, params: Record<string, unknown> = {}) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event, ...params });
}

export default function NewsletterSignup() {
	const formId = useId();
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const hasStartedRef = useRef(false);

	function handleFocus(_event: FocusEvent<HTMLFormElement>) {
		if (hasStartedRef.current) return;
		hasStartedRef.current = true;
		pushDataLayerEvent('newsletter_start');
	}

	// Placeholder submit handler: there's no backend/ESP wired up yet. On
	// success it only pushes the `newsletter_signup` tracking event and shows
	// a confirmation state.
	// TODO: replace with a real subscribe call (API route, ESP integration) once one exists.
	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmed = email.trim();
		if (!trimmed) {
			setError('Enter your email address.');
			return;
		}
		if (!EMAIL_PATTERN.test(trimmed)) {
			setError('Enter a valid email address.');
			return;
		}

		setError(null);
		pushDataLayerEvent('newsletter_signup');
		console.info('[Flowbase newsletter] Signup submitted (placeholder, no backend wired up):', trimmed);
		setSubmitted(true);
	}

	if (submitted) {
		return (
			<p role="status" className="text-sm text-foreground">
				You're on the list &mdash; we'll email you at {email}.
			</p>
		);
	}

	return (
		<form noValidate onFocusCapture={handleFocus} onSubmit={handleSubmit} className="flex flex-col gap-2">
			<Label htmlFor={`${formId}-newsletter-email`} className="text-sm font-medium text-foreground">
				Get product news by email
			</Label>
			<div className="flex flex-col gap-2 sm:flex-row">
				<Input
					id={`${formId}-newsletter-email`}
					name="email"
					type="email"
					autoComplete="email"
					placeholder="you@example.com"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${formId}-newsletter-error` : undefined}
					className="sm:max-w-56 border-indigo-500"
				/>
				<Button type="submit">Subscribe</Button>
			</div>
			{error && (
				<p id={`${formId}-newsletter-error`} role="alert" className="text-sm text-destructive">
					{error}
				</p>
			)}
			<p className="text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
		</form>
	);
}
