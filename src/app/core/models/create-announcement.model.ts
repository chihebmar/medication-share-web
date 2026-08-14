export interface CreateAnnouncement {
  medicationName: string;
  typeCode: string;
  governorateCode: string;
  phoneNumber: string;
  description: string | null;
  imageUrl: string | null;
}