<template>
  <v-dialog v-model="dialog" persistent width="1300">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{
            'New Activity Suggestion'
          }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="validForm">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="form.name"
                label="*Name"
                :rules="[v => !!v || 'Activity name is required']"
                required
                data-cy="nameInput"
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.institutionId"
                :items="institutions"
                item-text="name"
                item-value="id"
                label="Select Institution"
                :rules="[v => !!v || 'Instititution is required']"
                required
                data-cy="institutionSelect"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.description"
                label="Description"
                :rules="[v => !!v || 'Description is required']"
                required
                data-cy="descriptionInput"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.region"
                label="Region"
                :rules="[v => !!v || 'Region is required']"
                required
                data-cy="regionInput"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Number of Participants"
                :rules="[v => !!v || 'Number of participants is required']"
                required
                v-model="form.participantsNumberLimit"
                data-cy="participantsNumberInput"
              ></v-text-field>
            </v-col>
            <v-col>
              <VueCtkDateTimePicker
                id="applicationDeadlineInput"
                v-model="form.applicationDeadline"
                format="YYYY-MM-DDTHH:mm:ssZ"
                label="*Application Deadline"
              ></VueCtkDateTimePicker>
            </v-col>
            <v-col>
              <VueCtkDateTimePicker
                id="startingDateInput"
                v-model="form.startingDate"
                format="YYYY-MM-DDTHH:mm:ssZ"
                label="*Starting Date"
              ></VueCtkDateTimePicker>
            </v-col>
            <v-col>
              <VueCtkDateTimePicker
                id="endingDateInput"
                v-model="form.endingDate"
                format="YYYY-MM-DDTHH:mm:ssZ"
                label="*Ending Date"
              ></VueCtkDateTimePicker>
            </v-col>
          </v-row>
        </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="blue_darken-1" 
          variant ="text" 
          @click= "$emit('close-activity')"
        >
          Close
        </v-btn>
        <v-btn
          v-if="canSave" 
          color="blue_darken-1" 
          variant ="text"
          @click="saveActivity"
          data-cy="saveActivity"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator';
import { ISOtoString } from '@/services/ConvertDateService';
import InstitutionService from '@/models/institution/Institution';
import RemoteServices from '@/services/RemoteServices';
import ActivitySuggestion from '@/models/activitySuggestion/ActivitySuggestion';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';


Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
@Component({
  methods: { ISOtoString },
})
export default class ActivitySuggestionDialog extends Vue {
  @Model('dialog', Boolean) dialog!: boolean;
  @Prop({ type: ActivitySuggestion, required: true }) readonly activitySuggestion!: ActivitySuggestion;
  
  form: ActivitySuggestion = new ActivitySuggestion();
  cypressCondition: boolean = false;

  startDateMenu: boolean = false;
  endDateMenu: boolean = false;
  

  institutions: Array<{name: string; id: number }> = [];
  validForm: boolean = false;

  async mounted(){
    await this.getInstitutions();
  }
  async created() {
    this.form = new ActivitySuggestion(this.activitySuggestion);
  }
  async getInstitutions() {
  try {
    const institutions = await RemoteServices.getInstitutions();
    this.institutions = institutions
      .filter((institution: InstitutionService) => institution.id !== null) 
      .map((institution: InstitutionService) => ({
        name: institution.name,
        id: institution.id as number, 
      }));
  } catch (error) {
    console.error('Error getting institutions:', error);
    this.$emit('error', 'Failed to get institutions');
  }
}
getInstitutionNameById(institutionId: number): string {
  const institution = this.institutions.find((inst) => inst.id === institutionId);
  return institution ? institution.name : 'Unknown Institution';
}

  get canSave(): boolean {
    return (
      this.cypressCondition ||
      (!!this.form.name &&
        !!this.form.institutionId &&
        !!this.form.description &&
        !!this.form.region &&
        !!this.form.participantsNumberLimit &&
        !!this.form.applicationDeadline &&
        !!this.form.startingDate &&
        !!this.form.endingDate)
    );
  }

  async saveActivity() {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      try {
        const institution = this.institutions.find(
          (inst) => inst.id === this.form.institutionId
        );

        if (!institution) {
          throw new Error('Institution not found');
        }

        const result = await RemoteServices.createActivitySuggestion(this.form.institutionId,this.form);
        this.$emit('save-activity', result);
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }

}
</script>

<style scoped lang="scss"></style>


