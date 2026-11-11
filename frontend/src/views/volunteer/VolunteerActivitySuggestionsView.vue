<template>
  <v-card class="table">
    <v-data-table
      :headers="headers"
      :items="activitySuggestions"
      :search="search"
      disable-pagination
      :hide-default-footer="true"
      :mobile-breakpoint="0"
      data-cy="activitySuggestionTable"
    >
      <template v-slot:item.institutionName="{ item }">
        {{ institutions.find(institution => institution.id === item.institutionId)?.name }}
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
          <v-btn 
            color="blue" 
            class = "mx-2"
            @click= "onNewActivitySuggestion"
            data-cy="newActivitySuggestionButton"
          >
            New Activity Suggestion
          </v-btn>
        </v-card-title>
      </template>
    </v-data-table>
      <activity-suggestion-dialog
        v-if="currentActivitySuggestion && dialog"
        v-model="dialog"
        :activitySuggestion="currentActivitySuggestion"
        v-on:save-activity="onSaveActivitySuggestion"
        v-on:close-activity="onCloseActivitySuggestion"
      />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ActivitySuggestionDialog from '@/views/volunteer/ActivitySuggestionDialog.vue';
import ActivitySuggestion  from '@/models/activitySuggestion/ActivitySuggestion';
import RemoteServices from '@/services/RemoteServices';
import Institution from '@/models/institution/Institution';


@Component({
  components: {
    'activity-suggestion-dialog': ActivitySuggestionDialog,
  },
})
export default class VolunteerActivitySuggestionsView extends Vue {
  activitySuggestions: ActivitySuggestion[] = [];
  currentActivitySuggestion: ActivitySuggestion | null = null;
  dialog: boolean = false;
  institutions: Institution[] = [];
  
  search: string = '';
  headers: object = [
    {
      text: 'Name',
      value: 'name',
      align: 'left',
      width: '10%',
    },
   
    {
      text: 'Institution',
      value: 'institutionName',
      align: 'left',
      width: '10%',
    },
    {
      text: 'Description',
      value: 'description',
      align: 'left',
      width: '30%',
    },
    {
      text: 'Region',
      value: 'region',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Participants Limit',
      value: 'participantsNumberLimit',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Start Date',
      value: 'formattedStartingDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'End Date',
      value: 'formattedEndingDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Application Deadline',
      value: 'formattedApplicationDeadline',
      align: 'left',
      width: '5%',
    },
    {
      text: 'Creation Date',
      value: 'creationDate',
      align: 'left',
      width: '5%',
    },
    {
      text: 'State',
      value: 'state',
      align: 'left',
      width: '5%',
    },
  ];

  async created() {
    await this.$store.dispatch('loading');
    try {
      let userId = this.$store.getters.getUser.id;
      this.institutions = await RemoteServices.getInstitutions();
      if (userId !== null) {
        this.activitySuggestions = await RemoteServices.getActivitySuggestionsByVolunteer(userId);
      } else {
        this.activitySuggestions = [];
      }
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }

  onNewActivitySuggestion() {
    this.currentActivitySuggestion = new ActivitySuggestion();
    this.dialog = true;
  }
  institutionName(institutionId: number): string {
  const institution = this.activitySuggestions.find(
    (suggestion) => suggestion.institutionId === institutionId
  );
  return institution ? institution.name : 'Unknown Institution';
}
  

  onCloseActivitySuggestion() {
    this.currentActivitySuggestion = null;
    this.dialog = false;
  }

  onSaveActivitySuggestion(activitySuggestion: ActivitySuggestion) {
    this.activitySuggestions = this.activitySuggestions.filter(
      (suggestion) => suggestion.id !== activitySuggestion.id
    );
    this.activitySuggestions.unshift(activitySuggestion);
    this.dialog = false;
    this.currentActivitySuggestion = null;
  }
}
</script>

<style lang="scss" scoped>
.date-fields-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date-fields-row {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
</style>