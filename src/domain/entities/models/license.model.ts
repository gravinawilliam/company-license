import { Company } from './company.model';

export type License = {
  id: string;
  licenseNumber: string;
  environmentalAgency: string;
  emissionDate: Date;
  expirationDate: Date;
  company: Pick<Company, 'id'>;
  deletedAt?: Date;
};
