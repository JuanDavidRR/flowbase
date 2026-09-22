import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type BillingPeriod = "monthly" | "annual";

const PRICING_SECTION_ID = "pricing";

export default function BillingToggle() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  function handleValueChange(value: string[]) {
    const next = value[0];
    // Base UI's ToggleGroup allows deselecting the pressed item, which would
    // leave the group empty; ignore that so one period is always selected.
    if (next !== "monthly" && next !== "annual") return;

    setPeriod(next);
    document
      .getElementById(PRICING_SECTION_ID)
      ?.setAttribute("data-billing-period", next);
  }

  return (
    <ToggleGroup
      aria-label="Billing period"
      value={[period]}
      onValueChange={handleValueChange}
      variant="outline"
    >
      <ToggleGroupItem
        value="monthly"
        data-event="toggle_billing"
        data-billing-period="monthly"
        className="data-pressed:bg-primary data-pressed:text-primary-foreground data-pressed:hover:bg-primary cursor-pointer"
      >
        Monthly
      </ToggleGroupItem>
      <ToggleGroupItem
        value="annual"
        data-event="toggle_billing"
        data-billing-period="annual"
        className="data-pressed:bg-primary data-pressed:text-primary-foreground data-pressed:hover:bg-primary cursor-pointer"
      >
        Annual
        <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-semibold text-primary group-data-pressed/toggle:bg-primary-foreground/15 group-data-pressed/toggle:text-primary-foreground">
          Save 20%
        </span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
