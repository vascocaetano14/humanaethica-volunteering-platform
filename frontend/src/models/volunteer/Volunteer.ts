import { ISOtoString } from '@/services/ConvertDateService';
import Document from '../management/Document';
import VolunteerProfile from '../volunteerProfile/VolunteerProfile';

export default class Volunteer {
  id: number | null = null;
  name!: string;
  email!: string;
  username!: boolean;
  creationDate!: string;
  doc!: Document;
  volunteerProfile!: VolunteerProfile;

  constructor(jsonObj?: Volunteer) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.name = jsonObj.name;
      this.email = jsonObj.email;
      this.username = jsonObj.username;
      this.creationDate = ISOtoString(jsonObj.creationDate);
      this.doc = jsonObj.doc;
      this.volunteerProfile = jsonObj.volunteerProfile;
    }
  }
}
