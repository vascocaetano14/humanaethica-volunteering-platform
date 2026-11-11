<template>
  <v-card class="table">
    <v-data-table
      :headers="headers"
      :items="activitySuggestions"
      :search="search"
      disable-pagination
      :hide-default-footer="true"
      :mobile-breakpoint="0"
      data-cy="memberactivitySuggestionTable"
    >
      <template v-slot:item.institutionName="{ item }">
        {{ institutionName() }}
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
      <template v-slot:item.actions=" {item} ">
        <div>
        <v-icon
          v-if= "item.state === 'IN_REVIEW' || item.state === 'REJECTED' "
          color="green"
          small
          @click = "approveActivitySuggestion(item)"
          data-cy="approveButton"
          >
        mdi-thumb-up
      </v-icon>
    
        <v-icon
          v-if= "item.state === 'IN_REVIEW' || item.state === 'APPROVED' "
          color="red"
          small
          @click = "rejectActivitySuggestion(item)"
          data-cy="rejectButton"
          >
          mdi-thumb-down
        </v-icon>  
        </v-btn>
      </div>
      </template>
  
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Institution from '@/models/institution/Institution';
import ActivitySuggestion from '@/models/activitySuggestion/ActivitySuggestion';
import RemoteServices from '@/services/RemoteServices';
import { ISOtoString } from '@/services/ConvertDateService';
import User from '@/models/user/User';

@Component({
  components: {
  },
})
export default class VolunteerActivitySuggestionsView extends Vue {
  activitySuggestions: ActivitySuggestion[] = []; // TODO: this is the object that will be used to fill in the table
  institution: Institution = new Institution();
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
    {
      text: 'Actions',
      value: 'actions',
      align: 'left',
      width: '10%',
      sortable: false,
    }
  ];
  async approveActivitySuggestion(item: ActivitySuggestion) {
    let activitySuggestionId = item.id;
    if (activitySuggestionId !== null) {
      try {
        const approvedSuggestion= await RemoteServices.approveActivitySuggestion(
          activitySuggestionId)
        const index = this.activitySuggestions.findIndex(
          (suggestion) => suggestion.id === activitySuggestionId);
        if (index !== -1) {
          this.$set(this.activitySuggestions, index, approvedSuggestion);
      }
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }
  async rejectActivitySuggestion(item: ActivitySuggestion) {
    let activitySuggestionId = item.id;
    if (activitySuggestionId !== null) {
      try {
        const rejectedSuggestion = await RemoteServices.rejectActivitySuggestion(
          activitySuggestionId)
        const index = this.activitySuggestions.findIndex(
          (suggestion) => suggestion.id === activitySuggestionId);
        if (index !== -1) {
          this.$set(this.activitySuggestions, index, rejectedSuggestion);
        }
      } catch (error) {
        await this.$store.dispatch('error', error);
      }
    }
  }






  async created() {
    await this.$store.dispatch('loading');
    try {
      let userId = this.$store.getters.getUser.id;
      this.institution = await RemoteServices.getInstitution(userId);
      if (this.institution.id !== null) {
        this.activitySuggestions = await RemoteServices.getActivitySuggestions(
          this.institution.id
        );
      } else {
        this.activitySuggestions = [];
      }
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }

  institutionName() {
    return this.institution.name;
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