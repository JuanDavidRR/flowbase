import { useId, useRef, useState, type FocusEvent, type SubmitEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { companySizes } from '@/data/site';

type FormValues = {
	name: string;
	email: string;
	company: string;
	companySize: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = { name: '', email: '', company: '', companySize: '' };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pushDataLayerEvent(event: string, params: Record<string, unknown> = {}) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event, ...params });
}

function validate(values: FormValues): FormErrors {
	const errors: FormErrors = {};

	if (!values.name.trim()) {
		errors.name = 'Enter your full name.';
	}

	if (!values.email.trim()) {
		errors.email = 'Enter your work email.';
	} else if (!EMAIL_PATTERN.test(values.email.trim())) {
		errors.email = 'Enter a valid email address.';
	}

	if (!values.companySize) {
		errors.companySize = 'Select your company size.';
	}

	return errors;
}

export default function DemoRequestForm() {
	const formId = useId();
	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitted, setSubmitted] = useState(false);
	const hasStartedRef = useRef(false);
	const successHeadingRef = useRef<HTMLHeadingElement>(null);

	function handleFormFocus(_event: FocusEvent<HTMLFormElement>) {
		if (hasStartedRef.current) return;
		hasStartedRef.current = true;
		pushDataLayerEvent('form_start', { form_name: 'demo_request' });
	}

	function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
		setValues((prev) => ({ ...prev, [field]: value }));
	}

	// Placeholder submit handler: there's no backend yet. On success it only
	// pushes the `form_submit` tracking event and shows a confirmation state.
	// TODO: replace with a real submission (API route, Zapier, etc.) once one exists.
	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const nextErrors = validate(values);
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0) {
			return;
		}

		pushDataLayerEvent('form_submit', {
			form_name: 'demo_request',
			company_size: values.companySize,
		});

		console.info('[Flowbase demo] Form submitted (placeholder, no backend wired up):', values);

		setSubmitted(true);
		requestAnimationFrame(() => successHeadingRef.current?.focus());
	}

	if (submitted) {
		return (
			<div role="status" className="rounded-xl border border-border bg-card p-6 text-center sm:p-8">
				<h3 ref={successHeadingRef} tabIndex={-1} className="font-heading text-lg font-semibold focus:outline-none">
					Thanks, {values.name.split(' ')[0] || 'there'}!
				</h3>
				<p className="mt-2 text-sm text-gray-600 ">
					We received your request and will reach out to {values.email} shortly.
				</p>
			</div>
		);
	}

	return (
		<form
			noValidate
			id={formId}
			onFocusCapture={handleFormFocus}
			onSubmit={handleSubmit}
			className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:p-8"
		>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`${formId}-name`}>Full name</Label>
				<Input
					id={`${formId}-name`}
					name="name"
					autoComplete="name"
					value={values.name}
					onChange={(event) => updateField('name', event.target.value)}
					aria-invalid={Boolean(errors.name)}
					aria-describedby={errors.name ? `${formId}-name-error` : undefined}
					required
				/>
				{errors.name && (
					<p id={`${formId}-name-error`} role="alert" className="text-sm text-destructive">
						{errors.name}
					</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`${formId}-email`}>Work email</Label>
				<Input
					id={`${formId}-email`}
					name="email"
					type="email"
					autoComplete="email"
					value={values.email}
					onChange={(event) => updateField('email', event.target.value)}
					aria-invalid={Boolean(errors.email)}
					aria-describedby={errors.email ? `${formId}-email-error` : undefined}
					required
				/>
				{errors.email && (
					<p id={`${formId}-email-error`} role="alert" className="text-sm text-destructive">
						{errors.email}
					</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`${formId}-company`}>Company (optional)</Label>
				<Input
					id={`${formId}-company`}
					name="company"
					autoComplete="organization"
					value={values.company}
					onChange={(event) => updateField('company', event.target.value)}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`${formId}-company-size`}>Company size</Label>
				<Select
					name="companySize"
					value={values.companySize || null}
					onValueChange={(value) => updateField('companySize', (value as string) ?? '')}
				>
					<SelectTrigger
						id={`${formId}-company-size`}
						className="w-full"
						aria-invalid={Boolean(errors.companySize)}
						aria-describedby={errors.companySize ? `${formId}-company-size-error` : undefined}
					>
						<SelectValue placeholder="Select an option" />
					</SelectTrigger>
					<SelectContent>
						{companySizes.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.companySize && (
					<p id={`${formId}-company-size-error`} role="alert" className="text-sm text-destructive">
						{errors.companySize}
					</p>
				)}
			</div>

			<Button type="submit" className="mt-2 w-full" size="lg">
				Request a demo
			</Button>
		</form>
	);
}
