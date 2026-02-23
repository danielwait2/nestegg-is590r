// Last verified: February 2026
export type IssuerInstructions = {
  issuer: string;
  steps: string[];
  ssnRequired: boolean;
  note?: string;
};

export const ISSUER_INSTRUCTIONS: IssuerInstructions[] = [
  {
    issuer: "Chase",
    ssnRequired: false,
    steps: [
      "Log in to your Chase account at chase.com.",
      "Go to Account Services → Add an Authorized User.",
      "Enter your child's first and last name and date of birth.",
      "Chase will mail a card to your address — you don't have to give it to your child.",
    ],
    note: "Chase does not require your child's SSN to add them as an authorized user.",
  },
  {
    issuer: "American Express",
    ssnRequired: false,
    steps: [
      "Log in to your Amex account at americanexpress.com.",
      "Select the card you want to add them to, then go to Account Services → Add Someone to Your Account.",
      "Enter your child's name and date of birth.",
      "A card will be mailed — you can cut it up if you don't want your child to have it.",
    ],
    note: "Amex lets you add authorized users with just a name and date of birth. No SSN required.",
  },
  {
    issuer: "Citi",
    ssnRequired: false,
    steps: [
      "Log in to Citi at citi.com.",
      "Navigate to Services → Add Authorized User.",
      "Enter your child's name and date of birth.",
      "A card will arrive at your billing address.",
    ],
    note: "Citi does not require a Social Security number for authorized users.",
  },
  {
    issuer: "Capital One",
    ssnRequired: false,
    steps: [
      "Log in to your Capital One account at capitalone.com.",
      "Select your card, then click Add Authorized User.",
      "Enter your child's full name and date of birth.",
      "A card will be mailed to your address.",
    ],
    note: "Capital One does not require an SSN to add an authorized user.",
  },
  {
    issuer: "Discover",
    ssnRequired: true,
    steps: [
      "Log in to your Discover account at discover.com.",
      "Go to Account Services → Manage Authorized Users → Add Authorized User.",
      "Enter your child's name, date of birth, and Social Security number.",
      "A card will be mailed to your address.",
    ],
    note: "Discover requires a Social Security number for authorized users. If your child doesn't have one yet, you can do this after obtaining their SSN.",
  },
  {
    issuer: "Other",
    ssnRequired: false,
    steps: [
      "Log in to your credit card account online or call the number on the back of your card.",
      "Look for 'Add Authorized User' or 'Manage Account Users' in your account settings.",
      "You'll typically need your child's full legal name and date of birth.",
      "A card will be mailed to your address — you don't have to give it to your child.",
    ],
    note: "Most major issuers let you add authorized users with just a name and date of birth. Call the number on the back of your card if you can't find the option online.",
  },
];

export function getIssuerInstructions(issuer: string): IssuerInstructions | null {
  return ISSUER_INSTRUCTIONS.find(i => i.issuer === issuer) ?? null;
}
