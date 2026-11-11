<template>
    <v-dialog v-model="dialog" persistent width="1300">
        <v-card>
            <v-card-title>
                <span class="headline">{{  'New Institution Profile' }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-text-field
                            label="*Short Description"
                            :rules="[(v) => !!v || 'Short description is required']"
                            required
                            v-model="createInstitutionProfile.shortDescription"
                            data-cy="shortDescriptionInput"
                        ></v-text-field>
                    </v-row>
                    <v-row>
                        <h2 class="text-center mb-4">Selected Assessments</h2> 
                        <v-card class="table">
                            <v-data-table
                            :headers="headers"
                            :items="assessments"
                            :search="search"
                            show-select
                            v-model="createInstitutionProfile.selectedAssessments"
                            disable-pagination
                            :hide-default-footer="true"
                            :mobile-breakpoint="0"
                            data-cy="institutionProfileCreationAssessmentsTable"
                            >
                                <template v-slot:item.reviewDate="{ item }">
                                    {{ ISOtoString(item.reviewDate) }}
                              </template>
                                <template v-slot:top>
                                    <v-card-title>
                                        <v-text-field
                                            v-model="search"
                                            append-icon="search"
                                            label="Search"
                                            class="mx-2"
                                        />
                                    </v-card-title>
                                </template>   
                            </v-data-table>
                        </v-card>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="blue-darken-1"
                variant="text"
                @click="$emit('close-institution-profile-dialog')"
                >
                Close
                </v-btn>
                <v-btn v-if ="canSave"
                color="blue-darken-1"
                variant="text"
                @click="newInstitutionProfile()"
                data-cy="save institution profile"
                >
                Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator';
import InstitutionProfile from '@/models/profile/InstitutionProfile';
import Assessment from '@/models/assessment/Assessment';
import RemoteServices from '@/services/RemoteServices';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import { ISOtoString } from '@/services/ConvertDateService';

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
@Component({
  methods: { ISOtoString },
})
export default class InstitutionProfileDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: InstitutionProfile, required: true }) readonly institutionProfile!: InstitutionProfile;
  @Prop({ type: Array, required: true }) readonly assessments!: Assessment[];

  createInstitutionProfile: InstitutionProfile = new InstitutionProfile();
  selectedAssessments: Assessment[] = [];


  cypressCondition: boolean = false;
  search: string = '';

  headers: object = [
    {
      text: 'Volunteer Name',
      value: 'volunteerName',
      align: 'left',
      width: '30%',
    },
    {
      text: 'Review',
      value: 'review',
      align: 'left',
      width: '30%',
    },
    {
      text: 'Review Date',
      value: 'reviewDate',
      align: 'left',
      width: '40%',
    }
    
  ];

  async created() {
    this.createInstitutionProfile = new InstitutionProfile(this.institutionProfile);
  }

  get canSave(): boolean {
  return (
    this.cypressCondition || 
    !!this.createInstitutionProfile.shortDescription?.trim()
  );
}

  async newInstitutionProfile() {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try {
        const result = await RemoteServices.createInstitutionProfile(
          this.createInstitutionProfile
        );
        this.$emit('save-institution-profile', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>