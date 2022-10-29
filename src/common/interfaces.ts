/**
 * Custom interface definitions
 */

export enum STATUS {
  CREATED = "Created",
  ACTIVE = "Active",
  CLOSED = "Closed",
}

export interface Vote {
  name: string;
  creationDate: Date;
  status: STATUS;
}
