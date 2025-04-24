import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE!, {
  apiVersion: "2025-03-31.basil",
});

// Country code to name mapping
const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GR: "Greece",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LV: "Latvia",
  LT: "Lithuania",
  LU: "Luxembourg",
  MT: "Malta",
  NL: "Netherlands",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SK: "Slovakia",
  SI: "Slovenia",
  ES: "Spain",
  SE: "Sweden",
  NG: "Nigeria",
  // Add more countries as needed
};

export async function getSupportedBankAccountInfo() {
  try {
    const countrySpecs = await stripe.countrySpecs.list({ limit: 200 });

    const result: {
      countries: Array<{ code: string; name: string }>;
      currenciesByCountry: Record<string, string[]>;
    } = {
      countries: [],
      currenciesByCountry: {},
    };

    countrySpecs.data.forEach((spec) => {
      const countryCode = spec.id;
      const currencies = Object.keys(
        spec.supported_bank_account_currencies || {}
      );

      if (currencies.length > 0) {
        result.countries.push({
          code: countryCode,
          name: COUNTRY_NAMES[countryCode] || countryCode,
        });
        result.currenciesByCountry[countryCode] = currencies;
      }
    });

    // Sort countries alphabetically
    result.countries.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  } catch (error) {
    console.error("Error fetching supported currencies:", error);
    return {
      countries: [
        { code: "US", name: "United States" },
        { code: "GB", name: "United Kingdom" },
        { code: "CA", name: "Canada" },
        { code: "AU", name: "Australia" },
        { code: "EU", name: "European Union" },
        { code: "NG", name: "Nigeria" },
      ],
      currenciesByCountry: {
        US: ["usd"],
        GB: ["gbp"],
        CA: ["cad"],
        AU: ["aud"],
        EU: ["eur"],
        NG: ["ngn"],
      },
    };
  }
}

export function getCurrencyOptions(currencies: string[]) {
  return currencies.map((currency) => ({
    value: currency,
    label: currency.toUpperCase(),
  }));
}
