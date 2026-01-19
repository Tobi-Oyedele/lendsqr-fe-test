export type UserStatus = "Active" | "Inactive" | "Pending" | "Blacklisted";

export type ApiUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: UserStatus;
  accountNumber: number | string;
  accountBalance: number;
  organization: string;
  dateJoined: string;
  profile?: {
    gender?: "male" | "female";
    address?: string;
    city?: string;
    country?: string;
  };
};

export type Guarantor = {
  fullName: string;
  phone: string;
  email: string;
  relationship: string;
};

export type Employment = {
  levelOfEducation: string;
  employmentStatus: string;
  sector: string;
  duration: string;
  officeEmail: string;
  monthlyIncome: string;
  loanRepayment: string;
};

export type Socials = {
  twitter: string;
  facebook: string;
  instagram: string;
};

export type UserDetails = {
  bvn: string;
  maritalStatus: string;
  children: string;
  residenceType: string;
  employment: Employment;
  socials: Socials;
  guarantors: Guarantor[];
};

export type User = {
  id: string;
  organization: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  dateJoined: string;
  status: UserStatus;
  accountNumber: string;
  accountBalance: number;

  gender?: string;
  address?: string;
  city?: string;
  country?: string;

  details: UserDetails;
};
