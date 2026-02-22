// src/data/statePlans.ts
// Last verified: February 2026
// Sources: each state's 529 plan website and Saving for College (savingforcollege.com)
// IMPORTANT: Tax deduction details change. Verify amounts before shipping.
// When hasTaxDeduction is false, the UI falls back to Utah my529 as the recommended plan.

export type StatePlan = {
  state: string;           // Full state name
  code: string;            // Two-letter abbreviation
  hasTaxDeduction: boolean;
  planName: string;        // Recommended plan name
  planUrl: string;         // Direct link to open an account
  deductionNote?: string;  // Short description of the deduction (shown in UI)
  // lastVerified: string; // Uncomment and populate when verifying URLs
};

// Utah my529 — the national fallback for states with no meaningful deduction.
// Open to all US residents. Consistently rated among lowest-fee plans nationally.
export const FALLBACK_PLAN: StatePlan = {
  state: "Utah",
  code: "UT",
  hasTaxDeduction: true,
  planName: "Utah my529",
  planUrl: "https://my529.org",
  deductionNote: "Utah residents get a 4.85% state tax credit on contributions. Non-residents: no state deduction, but fees are among the lowest nationally.",
};

export const STATE_PLANS: StatePlan[] = [
  {
    state: "Alabama",
    code: "AL",
    hasTaxDeduction: true,
    planName: "CollegeCounts 529",
    planUrl: "https://www.collegecounts529.com",
    deductionNote: "Up to $5,000/year single, $10,000/year married",
  },
  {
    state: "Alaska",
    code: "AK",
    hasTaxDeduction: false, // No state income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Arizona",
    code: "AZ",
    hasTaxDeduction: true,
    planName: "Arizona 529",
    planUrl: "https://az529.gov",
    deductionNote: "Up to $2,000/year single, $4,000/year married — deductible for contributions to any state's plan",
  },
  {
    state: "Arkansas",
    code: "AR",
    hasTaxDeduction: true,
    planName: "GIFT College Investing Plan",
    planUrl: "https://www.gift529.com",
    deductionNote: "Up to $5,000/year single, $10,000/year married",
  },
  {
    state: "California",
    code: "CA",
    hasTaxDeduction: false, // CA offers no state income tax deduction for 529 contributions
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Colorado",
    code: "CO",
    hasTaxDeduction: true,
    planName: "CollegeInvest Direct Portfolio",
    planUrl: "https://www.collegeinvest.org",
    deductionNote: "Full deduction — no dollar limit on contributions deducted from Colorado income",
  },
  {
    state: "Connecticut",
    code: "CT",
    hasTaxDeduction: true,
    planName: "CHET (Connecticut Higher Education Trust)",
    planUrl: "https://www.aboutchet.com",
    deductionNote: "Up to $5,000/year single, $10,000/year married",
  },
  {
    state: "Delaware",
    code: "DE",
    hasTaxDeduction: true,
    planName: "Delaware College Investment Plan",
    planUrl: "https://www.fidelity.com/529-plans/delaware",
    deductionNote: "Up to $1,000/year per filer",
  },
  {
    state: "Florida",
    code: "FL",
    hasTaxDeduction: false, // No state income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Georgia",
    code: "GA",
    hasTaxDeduction: true,
    planName: "Path2College 529",
    planUrl: "https://www.path2college529.com",
    deductionNote: "Up to $4,000/year per beneficiary",
  },
  {
    state: "Hawaii",
    code: "HI",
    hasTaxDeduction: false, // No meaningful deduction
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Idaho",
    code: "ID",
    hasTaxDeduction: true,
    planName: "Idaho College Savings Program (IDeal)",
    planUrl: "https://idsaves.org",
    deductionNote: "Up to $6,000/year single, $12,000/year married",
  },
  {
    state: "Illinois",
    code: "IL",
    hasTaxDeduction: true,
    planName: "Bright Start College Savings",
    planUrl: "https://www.brightstart.com",
    deductionNote: "Up to $10,000/year single, $20,000/year married",
  },
  {
    state: "Indiana",
    code: "IN",
    hasTaxDeduction: true,
    planName: "Indiana CollegeChoice 529",
    planUrl: "https://www.collegechoicedirect.com",
    deductionNote: "20% tax credit on contributions up to $1,500/year ($750 credit max)",
  },
  {
    state: "Iowa",
    code: "IA",
    hasTaxDeduction: true,
    planName: "College Savings Iowa",
    planUrl: "https://www.collegesavingsiowa.com",
    deductionNote: "Up to $3,785/year per beneficiary (2025, indexed for inflation)",
  },
  {
    state: "Kansas",
    code: "KS",
    hasTaxDeduction: true,
    planName: "Kansas Learning Quest 529",
    planUrl: "https://www.learningquest.com",
    deductionNote: "Up to $3,000/year single, $6,000/year married — deductible for any state's plan",
  },
  {
    state: "Kentucky",
    code: "KY",
    hasTaxDeduction: false, // No meaningful deduction
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Louisiana",
    code: "LA",
    hasTaxDeduction: true,
    planName: "START Saving Program",
    planUrl: "https://www.startsaving.la.gov",
    deductionNote: "Full deduction on contributions (no dollar cap for LA residents)",
  },
  {
    state: "Maine",
    code: "ME",
    hasTaxDeduction: false, // No meaningful deduction
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Maryland",
    code: "MD",
    hasTaxDeduction: true,
    planName: "Maryland College Investment Plan",
    planUrl: "https://maryland529.com",
    deductionNote: "Up to $2,500/year per beneficiary, per account holder",
  },
  {
    state: "Massachusetts",
    code: "MA",
    hasTaxDeduction: true,
    planName: "U.Fund College Investing Plan (Fidelity)",
    planUrl: "https://www.fidelity.com/529-plans/massachusetts",
    deductionNote: "Up to $1,000/year single, $2,000/year married",
  },
  {
    state: "Michigan",
    code: "MI",
    hasTaxDeduction: true,
    planName: "Michigan Education Savings Program (MESP)",
    planUrl: "https://www.misaves.com",
    deductionNote: "Up to $5,000/year single, $10,000/year married",
  },
  {
    state: "Minnesota",
    code: "MN",
    hasTaxDeduction: true,
    planName: "Minnesota College Savings Plan",
    planUrl: "https://www.mnsaves.org",
    deductionNote: "Deduction or credit available — up to $1,500 single / $3,000 married deduction, or 50% credit on first $500 contributed",
  },
  {
    state: "Mississippi",
    code: "MS",
    hasTaxDeduction: true,
    planName: "Mississippi Affordable College Savings (MACS)",
    planUrl: "https://www.treasury.ms.gov/for-citizens/college-savings-macs/",
    deductionNote: "Full deduction — no dollar cap",
  },
  {
    state: "Missouri",
    code: "MO",
    hasTaxDeduction: true,
    planName: "MOST — Missouri's 529",
    planUrl: "https://www.missourimost.org",
    deductionNote: "Up to $8,000/year single, $16,000/year married",
  },
  {
    state: "Montana",
    code: "MT",
    hasTaxDeduction: true,
    planName: "Montana Family Education Savings Program",
    planUrl: "https://montana529.com",
    deductionNote: "Up to $3,000/year single, $6,000/year married",
  },
  {
    state: "Nebraska",
    code: "NE",
    hasTaxDeduction: true,
    planName: "NEST 529 Direct College Savings Plan",
    planUrl: "https://www.nest529direct.com",
    deductionNote: "Up to $10,000/year single, $10,000/year married (each filer)",
  },
  {
    state: "Nevada",
    code: "NV",
    hasTaxDeduction: false, // No state income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "New Hampshire",
    code: "NH",
    hasTaxDeduction: false, // No broad income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "New Jersey",
    code: "NJ",
    hasTaxDeduction: false, // NJ NJBEST has no state income tax deduction
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "New Mexico",
    code: "NM",
    hasTaxDeduction: true,
    planName: "The Education Plan",
    planUrl: "https://www.theeducationplan.com",
    deductionNote: "Full deduction — no dollar cap for NM residents",
  },
  {
    state: "New York",
    code: "NY",
    hasTaxDeduction: true,
    planName: "NY 529 Direct Plan",
    planUrl: "https://www.nysaves.org",
    deductionNote: "Up to $5,000/year single, $10,000/year married",
  },
  {
    state: "North Carolina",
    code: "NC",
    hasTaxDeduction: false, // No meaningful deduction
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "North Dakota",
    code: "ND",
    hasTaxDeduction: true,
    planName: "College SAVE",
    planUrl: "https://www.collegesave4u.com",
    deductionNote: "Full deduction — no dollar cap",
  },
  {
    state: "Ohio",
    code: "OH",
    hasTaxDeduction: true,
    planName: "Ohio CollegeAdvantage 529",
    planUrl: "https://www.collegeadvantage.com",
    deductionNote: "Up to $4,000/year per beneficiary — deductible for any state's 529",
  },
  {
    state: "Oklahoma",
    code: "OK",
    hasTaxDeduction: true,
    planName: "Oklahoma 529 College Savings Plan",
    planUrl: "https://www.ok4saving.org",
    deductionNote: "Up to $10,000/year single, $20,000/year married",
  },
  {
    state: "Oregon",
    code: "OR",
    hasTaxDeduction: true,
    planName: "Oregon College Savings Plan",
    planUrl: "https://www.oregoncollegesavings.com",
    deductionNote: "Credit of $150 single / $300 married, OR deduction up to $2,435/$4,865 (income-dependent)",
  },
  {
    state: "Pennsylvania",
    code: "PA",
    hasTaxDeduction: true,
    planName: "PA 529 Investment Plan",
    planUrl: "https://www.pa529.com",
    deductionNote: "Up to $17,000/year per beneficiary — deductible for any state's 529",
  },
  {
    state: "Rhode Island",
    code: "RI",
    hasTaxDeduction: true,
    planName: "CollegeBoundfund",
    planUrl: "https://www.collegeboundfund.com",
    deductionNote: "Up to $500/year single, $1,000/year married",
  },
  {
    state: "South Carolina",
    code: "SC",
    hasTaxDeduction: true,
    planName: "Future Scholar 529",
    planUrl: "https://www.futurescholar.com",
    deductionNote: "Full deduction — no dollar cap for SC residents",
  },
  {
    state: "South Dakota",
    code: "SD",
    hasTaxDeduction: false, // No state income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Tennessee",
    code: "TN",
    hasTaxDeduction: false, // No broad state income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Texas",
    code: "TX",
    hasTaxDeduction: false, // No state income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Utah",
    code: "UT",
    hasTaxDeduction: true,
    planName: "Utah my529",
    planUrl: "https://my529.org",
    deductionNote: "4.85% state tax credit on contributions (no dollar cap)",
  },
  {
    state: "Vermont",
    code: "VT",
    hasTaxDeduction: false, // No meaningful deduction
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Virginia",
    code: "VA",
    hasTaxDeduction: true,
    planName: "Invest529",
    planUrl: "https://www.virginia529.com",
    deductionNote: "Up to $4,000/year per account — unlimited carryforward of excess contributions",
  },
  {
    state: "Washington",
    code: "WA",
    hasTaxDeduction: false, // No state income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
  {
    state: "Washington DC",
    code: "DC",
    hasTaxDeduction: true,
    planName: "DC College Savings Plan",
    planUrl: "https://www.dcsavings.com",
    deductionNote: "Up to $4,000/year single, $8,000/year married",
  },
  {
    state: "West Virginia",
    code: "WV",
    hasTaxDeduction: true,
    planName: "SMART529 WV Direct",
    planUrl: "https://www.smart529.com",
    deductionNote: "Full deduction — no dollar cap for WV residents",
  },
  {
    state: "Wisconsin",
    code: "WI",
    hasTaxDeduction: true,
    planName: "Edvest 529",
    planUrl: "https://www.edvest.com",
    deductionNote: "Up to $3,860/year per beneficiary (2025, indexed for inflation)",
  },
  {
    state: "Wyoming",
    code: "WY",
    hasTaxDeduction: false, // No state income tax
    planName: "Utah my529",
    planUrl: "https://my529.org",
  },
];

// Lookup helper — returns the recommended plan for a given state code.
// Falls back to Utah my529 if the state code isn't found.
export function getPlanForState(stateCode: string): StatePlan {
  const plan = STATE_PLANS.find(
    (p) => p.code.toUpperCase() === stateCode.toUpperCase()
  );
  return plan ?? FALLBACK_PLAN;
}
