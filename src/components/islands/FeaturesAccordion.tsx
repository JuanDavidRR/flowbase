import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import type { Feature } from '@/data/site';

interface FeaturesAccordionProps {
	features: Feature[];
}

export default function FeaturesAccordion({ features }: FeaturesAccordionProps) {
	return (
		<Accordion multiple defaultValue={[]} className="divide-y divide-border rounded-xl border border-border bg-card px-4 sm:px-6">
			{features.map((feature) => (
				<AccordionItem key={feature.id} value={feature.id} className="py-1">
					<AccordionTrigger
						data-event="feature_expand"
						data-feature-name={feature.id}
						className="py-4 text-base font-medium sm:text-lg hover:cursor-pointer hover:text-indigo-600"
					>
						<span className="flex flex-col items-start gap-1 text-left">
							{feature.title}
							<span className="text-sm font-normal text-gray-600 ">{feature.teaser}</span>
						</span>
					</AccordionTrigger>
					<AccordionContent className="text-base text-gray-600 ">
						<p>{feature.detail}</p>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
