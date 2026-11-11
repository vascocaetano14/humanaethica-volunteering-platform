// volunteerprofile.js
describe('VolunteerProfile', () => {
  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createDemoEntities();
    cy.createDatabaseInfoForVolunteerProfile();
  });

  
  afterEach(() => {
    cy.deleteAllButArs();
  });
  

  it('create a volunteer profile with participations that have ratings and reviews', () => {
    const SHORT_BIO = 'This is a valid short bio';
    const ACTIVITY_NAME = 'A1';
    const ACTIVITY_NAME_2 = 'A2';
    const INSTITUTION = 'DEMO INSTITUTION';
    
    cy.demoVolunteerLogin();

    cy.intercept('POST', '/profile/volunteer').as('register');
    cy.intercept('GET', '/profile/volunteer/*').as('getVolunteer');
    cy.intercept('GET', '/participations/availableParticipations').as('availableParticipations');

    // go to create volunteer form
    cy.get('[data-cy="profiles"]').click();
    cy.get('[data-cy="volunteer-profile"]').click();
    cy.get('[data-cy="createVolunteerProfileButton"]').click();

    // fill form
    cy.get('[data-cy="volunteer profile bio"]').type(SHORT_BIO);
    
    // Wait for participations to load
    //cy.wait('@availableParticipations');
    
    // Verify we have at least 3 participations available (as created in the DB)
    cy.get('[data-cy="select volunteer participations"] tbody tr').should('have.length.at.least', 3);
    
    // Select the first two participations (which have ratings and reviews)
    cy.get('[data-cy="select volunteer participations"]')
      .find('.v-simple-checkbox')
      .first()
      .click();
    // Verify bio was correctly filled
    cy.get('[data-cy="volunteer profile bio"]').should('have.value', SHORT_BIO);

    // Save the profile
    cy.get('[data-cy="save volunteer profile"]').click();
    cy.wait('@register');

    // Check if the number of total participations is correct   
    cy.get('.stats-container').should('be.visible').within(() => {
      cy.contains('.project-name p', 'Total Participations')
        .parents('.items')
        .find('span')
        .should('contain', '3');
    });
    
    // Verify the participations in the profile
    cy.get('[data-cy="volunteerParticipationsTable"] tbody tr').should('have.length.at.least', 1);

    cy.intercept('GET', '/profile/volunteer').as('getVolunteers');

    
    cy.get('[data-cy="profiles"]').click();

    cy.get('[data-cy="view-profiles"]').click();
    cy.wait('@getVolunteers');

    cy.get('[data-cy="volunteerProfilesTable"] tbody tr')
    .should('have.length', 1);
    
    cy.logout();
  });
});
