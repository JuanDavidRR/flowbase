import { useEffect, useRef, useState } from 'react';
import { BellRing, CalendarCheck, Link2, Pause, Play, Wallet, type LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { JourneyStep } from '@/data/site';

const AUTO_ADVANCE_MS = 5000;

const ICONS: Record<JourneyStep['iconName'], LucideIcon> = {
	link: Link2,
	'calendar-check': CalendarCheck,
	'bell-ring': BellRing,
	wallet: Wallet,
};

interface HowItWorksTabsProps {
	steps: JourneyStep[];
}

export default function HowItWorksTabs({ steps }: HowItWorksTabsProps) {
	const [activeId, setActiveId] = useState(steps[0].id);
	const [isPlaying, setIsPlaying] = useState(true);
	const hasCheckedMotionPref = useRef(false);

	// Auto-advancing content must be user-pausable (WCAG 2.2.2) and should never
	// start moving at all for people who've asked for reduced motion.
	useEffect(() => {
		if (hasCheckedMotionPref.current) return;
		hasCheckedMotionPref.current = true;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setIsPlaying(false);
		}
	}, []);

	useEffect(() => {
		if (!isPlaying) return;

		const timer = setInterval(() => {
			setActiveId((current) => {
				const index = steps.findIndex((step) => step.id === current);
				return steps[(index + 1) % steps.length].id;
			});
		}, AUTO_ADVANCE_MS);

		return () => clearInterval(timer);
	}, [isPlaying, steps]);

	function handleTabsValueChange(value: unknown) {
		setActiveId(value as string);
	}

	// Any deliberate tab pick means the visitor is steering; stop overriding them.
	function handleManualSelect() {
		setIsPlaying(false);
	}

	return (
		<div className="rounded-xl border border-border bg-card p-4 sm:p-6">
			<div className="mb-4 flex items-center justify-between gap-4">
				<p className="text-sm font-medium text-gray-600 ">
					{isPlaying ? 'Auto-advancing' : 'Paused'}
				</p>
				<button
					type="button"
					onClick={() => setIsPlaying((playing) => !playing)}
					data-event="journey_autoplay_toggle"
					data-autoplay-state={isPlaying ? 'pause' : 'play'}
					className="inline-flex items-center gap-1.5 rounded-lg border border-input px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
				>
					{isPlaying ? (
						<Pause aria-hidden="true" className="size-3.5" />
					) : (
						<Play aria-hidden="true" className="size-3.5" />
					)}
					{isPlaying ? 'Pause' : 'Play'}
				</button>
			</div>

			<Tabs value={activeId} onValueChange={handleTabsValueChange} orientation="vertical" className="w-full">
				<div className="grid w-full gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
					<TabsList
						aria-label="Flowbase booking journey steps"
						className="h-fit w-full flex-col items-stretch gap-1 bg-transparent p-0"
					>
						{steps.map((step, index) => {
							const Icon = ICONS[step.iconName];
							return (
								<TabsTrigger
									key={step.id}
									value={step.id}
									onClick={handleManualSelect}
									data-event="journey_step_view"
									data-step-id={step.id}
									className="h-auto w-full items-start justify-start gap-3 rounded-lg border border-transparent px-3 py-3 text-left data-active:border-border data-active:bg-muted cursor-pointer"
								>
									<span
										aria-hidden="true"
										className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
									>
										<Icon className="size-4" />
									</span>
									<span className="flex flex-col gap-0.5">
										<span className="flex items-center gap-2 font-semibold text-foreground">
											<span aria-hidden="true" className="text-indigo-600 text-lg font-bold">
												{String(index + 1).padStart(2, '0')}
											</span>
											{step.title}
										</span>
										<span className="text-sm font-normal text-gray-600 ">{step.stat}</span>
									</span>
								</TabsTrigger>
							);
						})}
					</TabsList>

					{steps.map((step) => (
						<TabsContent key={step.id} value={step.id} className="flex flex-col gap-5">
							<h3 className="sr-only">{step.title}</h3>
							<p className="text-pretty text-gray-600 ">{step.description}</p>
							<BookingPreviewCard step={step} />
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
}

function BookingPreviewCard({ step }: { step: JourneyStep }) {
	return (
		<div className="rounded-lg border border-border bg-background p-4">
			<div className="flex items-center gap-3">
				<span
					aria-hidden="true"
					className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
				>
					AL
				</span>
				<div className="flex flex-col">
					<span className="font-medium text-foreground">Ada Lovelace</span>
					<span className="text-xs text-gray-600 ">30-min Strategy Call</span>
				</div>
			</div>

			<div
				role="progressbar"
				aria-label={`Booking progress: ${step.previewStatus}`}
				aria-valuenow={step.progress}
				aria-valuemin={0}
				aria-valuemax={100}
				className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
			>
				<div
					className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
					style={{ width: `${step.progress}%` }}
				/>
			</div>

			<p className="mt-3 text-sm font-semibold text-foreground pt-3">{step.previewStatus}</p>
			<p className="text-sm text-gray-600 pt-3">{step.previewNote}</p>
		</div>
	);
}
