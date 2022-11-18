/**
 * Custom interface definitions
 */

export enum STATUS {
  CREATED = "Created",
  ACTIVE = "Active",
  CLOSED = "Closed",
}

export enum TYPE {
  SINGLE = "Single select",
  MULTI = "Multi select",
}

export interface Vote {
  id?: string;
  name: string;
  creationDate: Date;
  status: STATUS;
  type: TYPE;
  options?: string[];
  members?: string[];
  selected?: boolean;
  totalNrOfVotes?: number;
}

export interface Option {
  id?: string;
  label: string;
  nrOfVotes?: number;
}

export interface Member {
  id?: string;
  firstName: string;
  lastName: string;
  votedFor?: string[];
  selected?: boolean;
}
