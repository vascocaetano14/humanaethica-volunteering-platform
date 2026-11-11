import { ISOtoString } from '@/services/ConvertDateService';

export default class ActivitySuggestion {
  id: number | null = null;
  name!: string;
  description!: string;
  region!: string;
  creationDate!: string;
  applicationDeadline!: string;
  formattedApplicationDeadline!: string;
  startingDate!: string;
  formattedStartingDate!: string;
  endingDate!: string;
  formattedEndingDate!: string;
  participantsNumberLimit!: number;
  state!: string;
  institutionId!: number;
  volunteerId!: number;
  endDate: any;



  constructor(jsonObj?: ActivitySuggestion) {
    if (jsonObj) {
      this.id = jsonObj.id;
      this.name = jsonObj.name;
      this.region = jsonObj.region;
      this.participantsNumberLimit = jsonObj.participantsNumberLimit;
      this.state = jsonObj.state;
      this.creationDate = ISOtoString(jsonObj.creationDate);
      this.description = jsonObj.description;
      this.startingDate = jsonObj.startingDate;
      this.institutionId = jsonObj.institutionId;
      this.volunteerId = jsonObj.volunteerId;
      if (jsonObj.startingDate)
        this.formattedStartingDate = ISOtoString(jsonObj.startingDate);
      this.endingDate = jsonObj.endingDate;
      if (jsonObj.endingDate)
        this.formattedEndingDate = ISOtoString(jsonObj.endingDate);
      this.applicationDeadline = jsonObj.applicationDeadline;
      if (jsonObj.applicationDeadline)
        this.formattedApplicationDeadline = ISOtoString(
          jsonObj.applicationDeadline,
        );
    }
  }
}
