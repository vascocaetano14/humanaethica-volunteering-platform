<template>
  <div class="container">
    <div v-if="!currentVolunteerProfile">
      <h1 class="mb-4">Volunteer Profile</h1>
      <p class="subtitle-1 mb-6">No volunteer profile found. Click the button below to create a new one!</p>
      <v-btn
        color="primary" dark @click="newVolunteerProfile()"
        data-cy="createVolunteerProfileButton"
      >CREATE VOLUNTEER PROFILE</v-btn>
    </div>
    <div v-else-if="currentVolunteerProfile && !createVolunteerProfileDialog" class="text-description">
      <h1>Volunteer: {{ currentVolunteerProfile.volunteer?.name || 'No name provided' }}</h1>
      <div class="text-description">
        <p><strong>Short Description: </strong> {{ currentVolunteerProfile?.shortBio }}</p>
      </div>
      <div class="stats-container">
        <div class="items"  data-cy="volunteerProfileNumTotalParticipations"> 
          <div ref="volunteerId" class="icon-wrapper"> 
            <span>{{ currentVolunteerProfile.numTotalParticipations }} </span>
          </div>
          <div class="project-name">
            <p>Total Participations</p>
          </div>
        </div>
        <div class="items">
          <div ref="volunteerId" class="icon-wrapper">
            <span>{{ currentVolunteerProfile.numTotalEnrollments }}</span>
          </div>
          <div class="project-name">
            <p>Total Enrollments</p>
          </div>
        </div>
        <div class="items">
          <div ref="volunteerId" class="icon-wrapper">
            <span>{{ currentVolunteerProfile.numTotalAssessments }}</span>
          </div>
          <div class="project-name">
            <p>Total Assessments</p>
          </div>
        </div>
        <div class="items">
          <div ref="volunteerId" class="icon-wrapper">
            <span>{{ currentVolunteerProfile.averageRating.toFixed(2) }}</span>
          </div>
          <div class="project-name">
            <p>Average Rating</p>
          </div>
        </div>
      </div>
      <div>
        <h2>Selected Participations</h2>
        <div>
          <v-card class="table">
            <v-data-table
              :headers="headers"
              :items="currentVolunteerProfile.selectedParticipations"
              :search="search"
              disable-pagination
              :hide-default-footer="true"
              :mobile-breakpoint="0"
              data-cy="volunteerParticipationsTable"
            >
              <template v-slot:[`item.institution`]="{ item }">
                {{ institutionName(item.activityId) }}
              </template>

              <template v-slot:[`item.activityName`]="{ item }">
                <span>
                  {{ activityName(item.activityId) }}
                </span>
              </template>

              <template v-slot:item.rating="{ item }">
                <div class="star-rating">
                  <v-rating
                    :value="item.memberRating"
                    readonly
                    dense
                    length="5"
                    size="18"
                    color="black"
                    background-color="grey lighten-1"
                    empty-icon="mdi-star-outline"
                    half-icon="mdi-star-half-full"
                    full-icon="mdi-star"
                  ></v-rating>
                  <div class="rating-text">{{ item.memberRating }}/5</div>
                </div>
              </template>

              <template v-slot:item.review="{ item }">
                {{ item.review || 'No review' }}
              </template>

              <template v-slot:top>
                <v-card-title>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    class="mx-2"
                  />
                  <v-spacer />
                </v-card-title>
              </template>
            </v-data-table>
          </v-card>
        </div>
      </div>
    </div>
    <volunteer-profile-dialog
      v-else
      v-model="createVolunteerProfileDialog"
      :volunteer-profile="currentVolunteerProfile"
      :participations="volunteerParticipations"
      :volunteer-activities="volunteerActivities"
      :volunteer-participations="volunteerParticipations"
      :combined-participations="combinedParticipations"
      v-on:profile-saved="onSaveVolunteerProfileDialog"
      v-on:profile-closed="onCloseVolunteerProfileDialog"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ISOtoString } from "../../services/ConvertDateService";
import RemoteServices from '@/services/RemoteServices';
import Participation from '@/models/participation/Participation';
import Activity from '@/models/activity/Activity';
import VolunteerProfile from '@/models/volunteerProfile/VolunteerProfile';
import Assessment from '@/models/assessment/Assessment';
import Enrollment from '@/models/enrollment/Enrollment';
import Volunteer from '@/models/volunteer/Volunteer';
import VolunteerProfileDialog from './VolunteerProfileDialog.vue';
import Institution from '@/models/institution/Institution';

@Component({
  methods: { ISOtoString },
  components: {
    'volunteer-profile-dialog': VolunteerProfileDialog,
  }
})
export default class VolunteerProfileView extends Vue {
  volunteerId: number = 0;
  currentVolunteerProfile: VolunteerProfile | null = null;
  createVolunteerProfileDialog: boolean = false;
  volunteerParticipations: Participation[] = [];
  voluteerAssessments: Assessment[] = [];
  volunteerEnrollments: Enrollment[] = [];
  volunteerActivities: Activity[] = [];
  combinedParticipations: any[] = [];

  search: string = '';
  headers: object = [
    { text: 'Activity Name', value: 'activityName', align: 'left', width: '30%' },
    { text: 'Institution', value: 'institution', align: 'left', width: '30%' },
    { text: 'Rating', value: 'rating', align: 'center', width: '15%' },
    { text: 'Review', value: 'memberReview', align: 'left', width: '30%' },
  ];

  async created() {
    this.currentVolunteerProfile = this.$store.getters.getVolunteerProfile;
    await this.$store.dispatch('loading');

    try {
      this.volunteerId = Number(this.$route.params.id);
      this.voluteerAssessments = await RemoteServices.getVolunteerAssessments();
      this.volunteerEnrollments = await RemoteServices.getVolunteerEnrollments();
      this.volunteerParticipations = await RemoteServices.getVolunteerParticipations();
      this.volunteerActivities = await RemoteServices.getActivities();
      this.combineParticipations();

      if (this.currentVolunteerProfile) {
        this.currentVolunteerProfile.averageRating = this.calculateAverageRating();
      }

    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }

  newVolunteerProfile() {
    this.currentVolunteerProfile = new VolunteerProfile(); 
    this.createVolunteerProfileDialog = true;
  }

  onCloseVolunteerProfileDialog() {
    this.currentVolunteerProfile = null;
    this.createVolunteerProfileDialog = false;
  }

  async onSaveVolunteerProfileDialog(volunteerProfile: VolunteerProfile) {
    await this.$store.dispatch('loading');
    try {
      this.currentVolunteerProfile = await RemoteServices.getVolunteerProfile(this.volunteerId);
      this.currentVolunteerProfile.averageRating = this.calculateAverageRating();
      this.$store.dispatch('setVolunteerProfile', this.currentVolunteerProfile);
    } catch (error) {
      await this.$store.dispatch('error', error);
    } finally {
      await this.$store.dispatch('clearLoading');
    }
    this.createVolunteerProfileDialog = false;
  }

  combineParticipations(): void {
    this.combinedParticipations = this.volunteerParticipations
      .filter((p): p is Participation & { id: number } => p.id !== null)
      .map(participation => {
        const activity = this.volunteerActivities.find(a => a.id === participation.activityId);
        return {
          id: participation.id,
          activityId: participation.activityId,
          activityName: activity?.name || 'Unknown Activity',
          institution: activity?.institution?.name || 'Unknown Institution',
          rating: participation.memberRating, 
          review: participation.memberReview || '',
          acceptanceDate: participation.acceptanceDate || '',
          memberRating: participation.memberRating, 
          memberReview: participation.memberReview   
        };
      });
  }

  activityName(id: number): string {
    const activity = this.volunteerActivities.find(a => a.id === id);
    return activity?.name || 'Unknown Activity';
  }

  institutionName(id: number): string {
    const activity = this.volunteerActivities.find(a => a.id === id);
    if (activity) {
      const institution = activity.institution;
      return institution?.name || 'Unknown Institution';
    }
    return 'Unknown Institution';
  }

  calculateAverageRating(): number {
    if (!this.currentVolunteerProfile?.selectedParticipations) return 0;
    
    const validParticipations = this.currentVolunteerProfile.selectedParticipations
      .filter(p => p.memberRating !== null && p.memberRating !== undefined);
    
    if (validParticipations.length === 0) return 0;

    const total = validParticipations.reduce((sum, p) => sum + p.memberRating, 0);
    return parseFloat((total / validParticipations.length).toFixed(2));
  }
}
</script>

<style lang="scss" scoped>
.stats-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  align-content: center;
  height: 100%;

  .items {
    background-color: rgba(255, 255, 255, 0.75);
    color: #696969;
    border-radius: 5px;
    flex-basis: 25%;
    margin: 20px;
    cursor: pointer;
    transition: all 0.6s;
  }
}

.icon-wrapper,
.project-name {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  font-size: 100px;
  transform: translateY(0px);
  transition: all 0.6s;
}

.icon-wrapper {
  align-self: end;
}

.project-name {
  align-self: start;
}

.project-name p {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  transform: translateY(0px);
  transition: all 0.5s;
}

.star-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rating-text {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
}

.items:hover {
  border: 3px solid black;

  & .project-name p {
    transform: translateY(-10px);
  }

  & .icon-wrapper i {
    transform: translateY(5px);
  }
}

.text-description {
  display: block;
  padding: 1em;
}

.table {
  margin-top: 20px;
}
</style>