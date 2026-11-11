describe('InstitutionProfile', () => {
  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createDemoEntities();
    cy.createDatabaseInfoForAssessments();
    cy.createDatabaseInfoForInstitutionProfile();
  });

  afterEach(() => {
    cy.deleteAllButArs();
  });

  it('create institution profile', () => {
    const SHORT_DESCRIPTION = 'Designed to help the elderly';

    cy.demoMemberLogin()


    cy.intercept('POST', '/profile/institution').as('register');
    cy.intercept('GET', '/institutions/1/assessments').as('getAssessments');

    cy.get('[data-cy="profiles"]').click();

    cy.get('[data-cy="member-profile"]').click();

    cy.get('[data-cy="createInstitutionProfileButton"]').click();
    cy.wait('@getAssessments');
    // fill form
    cy.get('[data-cy="shortDescriptionInput"]').type(SHORT_DESCRIPTION);
    cy.get('[data-cy="institutionProfileCreationAssessmentsTable"]')
    .find('.v-simple-checkbox')
    .first()
    .click();
    //save form
    cy.get('[data-cy="save institution profile"]').click();
    // check request was done
    cy.wait('@register');
    // check results
    cy.get('.stats-container').should('be.visible').within(() => {
      cy.contains('.project-name p', 'Total Assessments')
        .parents('.items')
        .find('span')
        .should('contain', '1');
    });
    cy.get('[data-cy="institutionAssessmentsTable"] tbody tr')
    .should('have.length', 1);
    cy.get('[data-cy="institutionAssessmentsTable"] tbody tr')
    .eq(0)
    .children()
    .should('contain', "DEMO-VOLUNTEER-7");
    cy.logout();
    // check if the profile is visible for an un-authenticated user

    cy.intercept('GET', '/profile/institution').as('getInstitutions');

    
    cy.get('[data-cy="profiles"]').click();

    cy.get('[data-cy="view-profiles"]').click();
    cy.wait('@getInstitutions');

    cy.get('[data-cy="institutionProfilesTable"] tbody tr')
    .should('have.length', 1);
  });
});