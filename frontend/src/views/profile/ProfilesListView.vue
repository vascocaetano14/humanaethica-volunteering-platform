<template>
  <div>
    <!-- Volunteer Profiles Table -->
    <v-card class="table">
      <v-card-title>
        <h2>Volunteer Profiles</h2>
      </v-card-title>
      <v-data-table
        :headers="headersVolunteerProfile"
        :items="volunteerProfiles"
        :search="search"
        disable-pagination
        :hide-default-footer="true"
        :mobile-breakpoint="0"
        data-cy="volunteerProfilesTable"
      >
        <template v-slot:item.volunteer.creationDate="{ item }">
          {{ ISOtoString(item.volunteer.creationDate) }}
        </template>
        <template v-slot:item.volunteer.lastAccess="{ item }">
          {{ ISOtoString(item.volunteer.lastAccess) }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="viewVolunteer(item)"
                data-cy="viewVolunteerButton"
              >
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View Details</span>
          </v-tooltip>
        </template>
        <template v-slot:top>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              class="mx-2"
              clearable
            />
          </v-card-title>
        </template>
      </v-data-table>
    </v-card>

    <!-- Institution Profiles Table -->
    <v-card class="table" style="margin-top: 20px;">
      <v-card-title>
        <h2>Institution Profiles</h2>
      </v-card-title>
      <v-data-table
        :headers="headersInstitutionProfile"
        :items="institutionProfiles"
        :search="search"
        disable-pagination
        :hide-default-footer="true"
        :mobile-breakpoint="0"
        data-cy="institutionProfilesTable"
      >
        <template v-slot:item.institution.creationDate="{ item }">
          {{ ISOtoString(item.institution.creationDate) }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                color="primary"
                v-bind="attrs"
                v-on="on"
                @click="viewInstitution(item)"
              >
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View Details</span>
          </v-tooltip>
        </template>
        <template v-slot:top>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              class="mx-2"
              clearable
            />
          </v-card-title>
        </template>
        <template v-slot:[`item.action`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              class="mr-2 action-button"
              @click="openProfile(item)"
              v-on="on"
              data-cy="openProfile"
              >fas fa-address-card
            </v-icon>
          </template>
          <span>View Profile</span>
        </v-tooltip>
      </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ISOtoString } from "../../services/ConvertDateService";
import RemoteServices from '@/services/RemoteServices';
import InstitutionProfile from '@/models/profile/InstitutionProfile';
import VolunteerProfile from '@/models/volunteerProfile/VolunteerProfile';
@Component({
  methods: { ISOtoString }
})
export default class ProfilesListView extends Vue {
  volunteerProfiles: VolunteerProfile[] = []; // TODO: this is the object that will be used to fill in the table
  institutionProfiles: InstitutionProfile[] = []; // TODO: this is the object that will be used to fill in the table

  search: string = '';

  headersVolunteerProfile: object = [
    { text: 'Name', value: 'volunteer.name', align: 'left', width: '10%' },
    {
      text: 'Short Bio',
      value: 'shortBio',
      align: 'left',
      width: '40%',
    },
    {
      text: 'Registration Date',
      value: 'volunteer.creationDate',
      align: 'left',
      width: '10%',
    },
    {
      text: 'Last Access',
      value: 'volunteer.lastAccess',
      align: 'left',
      width: '10%',
    },
    {
      text: 'Actions',
      value: 'action',
      align: 'center',
      sortable: false,
      width: '5%',
    },
  ];

  headersInstitutionProfile: object = [
    { text: 'Name', value: 'institution.name', align: 'left', width: '10%' },
    {
      text: 'Short Description',
      value: 'shortDescription',
      align: 'left',
      width: '40%',
    },
    {
      text: 'Registration Date',
      value: 'institution.creationDate',
      align: 'left',
      width: '10%',
    },
    {
      text: 'Active',
      value: 'institution.active',
      align: 'left',
      width: '10%',
    },
    {
      text: 'Actions',
      value: 'action',
      align: 'center',
      sortable: false,
      width: '5%',
    },
  ];

  async created() {
    await this.$store.dispatch('loading');
    try {
      this.institutionProfiles = await RemoteServices.getAllInstitutionProfiles();
      this.volunteerProfiles = await RemoteServices.getAllVolunteerProfiles();
    } catch (error) {
      await this.$store.dispatch('error', error);
    }
    await this.$store.dispatch('clearLoading');
  }
  async openProfile(institutionProfile : InstitutionProfile){
    await this.$store.dispatch('setInstitutionProfile', institutionProfile);
    await this.$router.push({ path: `/profiles/institution/${institutionProfile.institution.id}` });
  }
  async viewVolunteer(volunteerProfile: VolunteerProfile) {
    await this.$store.dispatch('setVolunteerProfile', volunteerProfile);
    await this.$router.push({ path: `/profiles/volunteer/${volunteerProfile.volunteer.id}`});
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-bottom: 20px;
}

.v-data-table {
  margin: 10px;
}

.v-btn {
  margin: 0 2px;
}
</style>