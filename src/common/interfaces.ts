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
  name: string;
  creationDate: Date;
  status: STATUS;
  type: TYPE;
  options?: string[];
}
