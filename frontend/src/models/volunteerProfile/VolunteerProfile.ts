import Assessment from "../assessment/Assessment";
import Enrollment from "../enrollment/Enrollment";
import Participation from "../participation/Participation";
import Volunteer from "../volunteer/Volunteer";

export default class VolunteerProfile {
  id!: number;
  shortBio!: string;
  numTotalEnrollments!:number;
  numTotalParticipations!: number;
  numTotalAssessments!: number;
  averageRating!: number;
  selectedParticipations: Participation[] = [];
  volunteer!: Volunteer;

  constructor(jsonObj?: VolunteerProfile) {
    if (jsonObj) {
      this.shortBio = jsonObj.shortBio;
      this.numTotalEnrollments = jsonObj.numTotalEnrollments;
      this.numTotalParticipations = jsonObj.numTotalParticipations;
      this.numTotalAssessments = jsonObj.numTotalAssessments;
      this.averageRating = jsonObj.averageRating;
      this.selectedParticipations = jsonObj.selectedParticipations.map((participation: Participation) => {
        return new Participation(participation);
      });
      this.volunteer = new Volunteer(jsonObj.volunteer);
      this.id = jsonObj.id;
    }
  }
}