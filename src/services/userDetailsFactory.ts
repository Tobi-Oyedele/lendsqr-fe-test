import type { UserDetails } from "../types/users";
import { seededNumber, pick } from "../utils/seed";

export function createUserDetails(seed: string, fullName: string): UserDetails {
  const rand = seededNumber(seed);
  const username = fullName.toLowerCase().replace(/\s+/g, "_");

  const maritalStatus = pick(rand, ["Single", "Married", "Divorced"]);
  const children = pick(rand, ["None", "1", "2", "3+"]);
  const residenceType = pick(rand, [
    "Parent’s Apartment",
    "Rented Apartment",
    "Owned Apartment",
  ]);

  const sectors = ["FinTech", "Logistics", "Healthcare", "Education", "Retail"];
  const sector = pick(rand, sectors);

  const incomes = [
    "₦100,000.00 - ₦200,000.00",
    "₦200,000.00 - ₦400,000.00",
    "₦400,000.00 - ₦800,000.00",
  ];

  const bvn = String(Math.floor(10000000000 + rand() * 90000000000));

  return {
    bvn,
    maritalStatus,
    children,
    residenceType,

    employment: {
      levelOfEducation: pick(rand, ["B.Sc", "HND", "M.Sc", "SSCE"]),
      employmentStatus: pick(rand, ["Employed", "Unemployed", "Self-employed"]),
      sector,
      duration: pick(rand, [
        "6 months",
        "1 year",
        "2 years",
        "3 years",
        "5 years",
      ]),
      officeEmail: `${username}@lendsqr.com`,
      monthlyIncome: pick(rand, incomes),
      loanRepayment: `₦${Math.floor(20000 + rand() * 100000).toLocaleString()}`,
    },

    socials: {
      twitter: `@${username}`,
      facebook: fullName,
      instagram: `@${username}`,
    },

    guarantors: [
      {
        fullName: pick(rand, [
          "Debby Ogana",
          "Chris Ade",
          "Ifeoma N.",
          "Seyi A.",
        ]),
        phone: pick(rand, ["0706780922", "08023456789", "08160000000"]),
        email: pick(rand, [
          "debby@gmail.com",
          "guarantor@mail.com",
          "support@mail.com",
        ]),
        relationship: pick(rand, ["Sister", "Brother", "Friend", "Colleague"]),
      },
      {
        fullName: pick(rand, [
          "Debby Ogana",
          "Chris Ade",
          "Ifeoma N.",
          "Seyi A.",
        ]),
        phone: pick(rand, ["0706780922", "08023456789", "08160000000"]),
        email: pick(rand, [
          "debby@gmail.com",
          "guarantor@mail.com",
          "support@mail.com",
        ]),
        relationship: pick(rand, ["Sister", "Brother", "Friend", "Colleague"]),
      },
    ],
  };
}
