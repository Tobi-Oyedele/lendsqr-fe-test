import type { ApiUser, User } from "../types/users";
import { createUserDetails } from "./userDetailsFactory";

function makeUsername(fullName: string) {
  return fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");
}

export function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    organization: u.organization,
    fullName: u.fullName,
    username: makeUsername(u.fullName),
    email: u.email,
    phone: u.phone,
    dateJoined: u.dateJoined,
    status: u.status,
    accountNumber: String(u.accountNumber),
    accountBalance: Number(u.accountBalance),
    gender: u.profile?.gender,
    address: u.profile?.address,
    city: u.profile?.city,
    country: u.profile?.country,
    details: createUserDetails(u.id, u.fullName),
  };
}
