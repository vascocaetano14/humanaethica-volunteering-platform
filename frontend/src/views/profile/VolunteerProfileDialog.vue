<template>
  <v-dialog v-model="dialog" max-width="900px" persistent>
    <v-card>
      <v-card-title>New Volunteer Profile</v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-textarea
            v-model="createVolunteerProfile.shortBio"
            label="Short Bio"
            outlined
            rows="2"
            :rules="[v => !!v || 'Bio is required']"
            required
            data-cy="volunteer profile bio"
          ></v-textarea>
  
          <v-divider class="my-4"></v-divider>
  
          <h3>Selected Participations</h3>
          <div class="search-bar">
            <v-text-field
              v-model="search"
              label="Search"
              outlined
              dense
            ></v-text-field>
            <v-btn icon><v-icon>mdi-filter</v-icon></v-btn>
            <v-btn icon><v-icon>mdi-magnify</v-icon></v-btn>
          </div>
  
          <v-data-table
            :headers="tableHeaders"
            :items="filteredParticipations"
            :search="search"
            hide-default-footer
            show-select
            v-model="createVolunteerProfile.selectedParticipations"
            data-cy="select volunteer participations"
          >
            <template v-slot:item.rating="{ item }">
              <div class="rating-container">
                <v-rating
                  v-if="item.rating !== null"
                  :value="item.rating"
                  readonly
                  dense
                  length="5"
                  size="15"
                  color="black"
                  background-color="grey lighten-1"
                  empty-icon="mdi-star-outline"
                  half-icon="mdi-star-half-full"
                  full-icon="mdi-star"
                ></v-rating>
                <span v-if="item.rating !== null" class="rating-text">{{ item.rating.toFixed(1) }}/5</span>
                <v-icon v-else>mdi-sleep</v-icon>
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon
                v-if="item.rating === null || item.rating === undefined"
                color="error"
                title="Only participations with rating can be selected"
              >
                mdi-alert-circle
              </v-icon>
            </template>
            
          </v-data-table>
      </v-form>
      </v-card-text>
    
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$emit('profile-closed')"
          data-cy="cancel volunteer profile"
          >Cancel</v-btn> 

          <v-btn v-if ="canSave"
              color="blue-darken-1"
              variant="text"
              @click="saveProfile()"
              data-cy="save volunteer profile"
              >
              Save
          </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator';
import RemoteServices from '@/services/RemoteServices';
import Participation from '@/models/participation/Participation';
import VolunteerProfile from '@/models/volunteerProfile/VolunteerProfile';
import Activity from '@/models/activity/Activity';

interface TableParticipation {
  id: number;
  activityName: string;
  institution: string;
  rating: number | null;
  review: string;
  acceptanceDate: string;
  disabled?: boolean;
}

@Component
export default class VolunteerProfileDialog extends Vue {
  @Prop({ required: true }) value!: boolean; 
  @Prop({ type: VolunteerProfile, required: true }) readonly volunteerProfile!: VolunteerProfile;
  @Prop({ type: Array, required: true }) readonly participations!: Participation[];
  @Prop({ type: Array, required: true }) readonly volunteerActivities!: Activity[];
  @Prop({ type: Array, required: true}) readonly volunteerParticipations!: Participation[];
  @Prop({ type: Array, required: true}) combinedParticipations!: any[];
  
  saving: boolean = false;
  search: string = '';
  selectedParticipations: Participation[] = [];

  createVolunteerProfile: VolunteerProfile = new VolunteerProfile();

  cypressCondition: boolean = false;

  tableHeaders = [
    { text: 'Select', value: 'data-table-select' },
    { text: 'Activity Name', value: 'activityName' },
    { text: 'Institution', value: 'institution' },
    { text: 'Rating', value: 'rating' },
    { text: 'Review', value: 'review' },
    { text: 'Acceptance Date', value: 'acceptanceDate' }
  ];

  get filteredParticipations(): TableParticipation[] {
    return this.combinedParticipations.map(p => ({
        id: p.id,
        activityName: p.activityName,
        institution: p.institution,
        rating: p.memberRating ?? p.rating, // Mostra memberRating ou volunteerRating
        review: p.memberReview || p.review,
        acceptanceDate: p.acceptanceDate,
        disabled: p.memberRating === null || p.memberRating === undefined
    }));
  }

  get hasUnratedSelected(): boolean {
    return this.selectedParticipations.some(p => p.memberReview === null || p.memberReview === undefined); 
  }

  get isFormValid(): boolean {
    return !!this.volunteerProfile && 
          !!this.volunteerProfile.shortBio?.trim() &&
          this.selectedParticipations.length > 0 &&
          !this.hasUnratedSelected;
  }


  get dialog(): boolean {
      return this.value;
  }

  set dialog(value: boolean) {
      this.$emit('input', value);
  }

  closeDialog(): void {
    this.$emit('input', false);
  }

  async created() {
    this.createVolunteerProfile = new VolunteerProfile(this.volunteerProfile);
  }

  get canSave(): boolean {
    // Verifica se há bio e pelo menos uma participação válida selecionada
    const hasValidBio = !!this.createVolunteerProfile.shortBio?.trim();
    const hasValidParticipations = this.createVolunteerProfile.selectedParticipations?.length > 0;
    
    return hasValidBio && hasValidParticipations;
  }

  
  async saveProfile(){
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try{

        const result = await RemoteServices.createVolunteerProfile(this.createVolunteerProfile);
        this.$emit('profile-saved', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }
}

</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.rating-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rating-text {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>