export const site = {
  name: 'Flowbase',
  tagline: 'Schedule and get paid, from one link.',
  description:
    'Flowbase is the booking link for freelancers: clients pick a time and pay upfront, so the money is already in your account when the call starts.',
  url: 'https://flowbase.example.com',
} as const;

// Fictional contact details: 555-01xx numbers and .example domains are reserved for fiction.
export const contact = {
  email: 'hello@flowbase.example.com',
  phone: '+1 (555) 010-0142',
  phoneHref: 'tel:+15550100142',
  linkedinLabel: 'linkedin.com/company/flowbase',
  linkedinUrl: 'https://www.linkedin.com/company/flowbase',
  address: '410 Market Street, Suite 200, Portland, OR 97204',
} as const;

export const logos = [
  'Northpeak',
  'Lumen & Co',
  'Orbital Studio',
  'Fernway',
  'Kastle',
  'Bluewire',
] as const;

export type Feature = {
  id: string;
  title: string;
  teaser: string;
  detail: string;
};

export const features: Feature[] = [
  {
    id: 'payment-vs-calendar-link',
    title: 'How is Flowbase different from a regular calendar link?',
    teaser: 'Booking and getting paid happen in the same step.',
    detail:
      "Flowbase combines scheduling and payment in one step. When a client books a call, they pay upfront based on the rate you set — no separate invoice, no chasing payments after the fact.",
  },
  {
    id: 'business-account-required',
    title: 'Do I need a business account to accept payments?',
    teaser: 'A personal account is enough to get started.',
    detail:
      "No. You can connect a personal bank account or debit card during setup. Flowbase handles the payout logic so you don't need a registered business to start charging clients.",
  },
  {
    id: 'multiple-rates',
    title: 'Can I set different rates for different types of calls?',
    teaser: 'Different call types, different prices, one link.',
    detail:
      "Yes. You can create multiple booking types (e.g., a 15-minute intro call at no charge, and a 60-minute consulting session at your hourly rate) and each one has its own scheduling rules and price.",
  },
  {
    id: 'cancellation-policy',
    title: 'What happens if a client cancels last minute?',
    teaser: 'You set the rules, Flowbase enforces them.',
    detail:
      "You set your own cancellation policy per booking type — full refund, partial fee, or no refund within a certain window. Flowbase enforces whatever policy you configure automatically.",
  },
  {
    id: 'tool-integrations',
    title: 'Can I use Flowbase alongside tools I already use, like Notion or Slack?',
    teaser: 'No manual copy-pasting into your other tools.',
    detail:
      "Flowbase integrates with common freelancer tools for notifications and record-keeping, so a new booking can automatically log to a workspace or send you an alert without manual copy-pasting.",
  },
];

export type Plan = {
  id: string;
  name: string;
  description: string;
  monthly: number;
  annual: number;
  highlighted: boolean;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For occasional paid calls.',
    monthly: 19,
    annual: 15,
    highlighted: false,
    features: [
      '1 booking page',
      'Stripe & PayPal payment collection',
      'Email reminders',
      'Up to 20 bookings / month',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For freelancers who live on calls.',
    monthly: 39,
    annual: 31,
    highlighted: true,
    features: [
      'Unlimited bookings',
      'Custom branding',
      'Email + SMS reminders',
      'Multiple connected calendars',
      'Priority payouts',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For small teams and agencies.',
    monthly: 79,
    annual: 63,
    highlighted: false,
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Team availability pooling',
      'Dedicated support',
      'API access',
    ],
  },
];

export type JourneyStep = {
  id: string;
  title: string;
  description: string;
  stat: string;
  iconName: 'link' | 'calendar-check' | 'bell-ring' | 'wallet';
  /** Drives the live mock booking-status card next to the step list. */
  progress: number;
  previewStatus: string;
  previewNote: string;
};

// The Flowbase story reframed as a sequence: this is what actually happens,
// in order, from the freelancer sharing a link to getting paid. The preview
// fields walk one fictional booking (Ada Lovelace, a 30-min strategy call)
// through all four stages so the section shows a concrete example, not just
// abstract feature copy.
export const journey: JourneyStep[] = [
  {
    id: 'share',
    title: 'Share your link',
    description:
      "Drop your Flowbase link in your bio, email signature, or a proposal. That's the entire setup a client ever sees — no back-and-forth over 'what times work for you?', no separate payment request after the call.",
    stat: 'One link, works everywhere',
    iconName: 'link',
    progress: 10,
    previewStatus: 'No bookings yet',
    previewNote: 'flowbase.co/ada is live across your bio, email signature, and last proposal — first click could come from any of them.',
  },
  {
    id: 'book-pay',
    title: 'They book and pay',
    description:
      'Clients see your real availability and pay upfront via Stripe or PayPal — the slot only confirms once payment clears, so you never end up holding time for someone who ghosts before paying.',
    stat: 'Paid before the call starts',
    iconName: 'calendar-check',
    progress: 45,
    previewStatus: 'Payment received — $75.00',
    previewNote: 'Ada Lovelace booked Thursday 2:00 PM for a 30-min strategy call and paid via Stripe on the spot — slot auto-confirmed.',
  },
  {
    id: 'show-up-ready',
    title: 'Everyone shows up ready',
    description:
      "Reminders go out automatically and every connected calendar stays in sync, so there's no double-booking and no forgotten calls. Clients get a heads-up with everything they need, and you get a clean calendar you don't have to babysit.",
    stat: 'Fewer no-shows, no double-books',
    iconName: 'bell-ring',
    progress: 75,
    previewStatus: 'Reminder sent to Ada',
    previewNote: 'Email + calendar invite went out 1 hour before the call, with the video link and your intake notes attached.',
  },
  {
    id: 'get-paid',
    title: 'You get paid, fast',
    description:
      'Funds settle to your bank account in as little as one business day. No invoice to write, no client to chase, no "did the payment go through?" messages — the money is already moving before you even close your laptop.',
    stat: 'Payout in ~1 business day',
    iconName: 'wallet',
    progress: 100,
    previewStatus: 'Payout sent — $75.00',
    previewNote: '$75.00 from Ada\'s call is on its way to your account ending in 4417, landing by tomorrow morning.',
  },
];

export const companySizes = [
  { value: 'solo', label: 'Just me' },
  { value: '2-10', label: '2–10 people' },
  { value: '11-50', label: '11–50 people' },
  { value: '51-200', label: '51–200 people' },
  { value: '200+', label: '200+ people' },
] as const;
