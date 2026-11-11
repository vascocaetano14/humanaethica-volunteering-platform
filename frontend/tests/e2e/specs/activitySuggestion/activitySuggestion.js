describe("Activity Suggestion", () => {
  beforeEach(() => {
    cy.deleteAllButArs();
    cy.createDemoEntities();
    cy.createDatabaseInfoForActivitySuggestion();
  });
  afterEach(() => {
    cy.deleteAllButArs();
  });

  
  it('get activity suggestions,2', () => {
      cy.demoVolunteerLogin();
      cy.intercept('GET', '/activitySuggestions/volunteer/*').as('getActivitySuggestions');
      cy.get('[data-cy="volunteerActivitySuggestions"]')
      .click();
      cy.wait('@getActivitySuggestions');
      cy.get('[data-cy="activitySuggestionTable"] tbody tr')
      .should('have.length', 2);
    });
    
    it('create activity suggestion', () => {
        const NAME = 'Elderly Assistance';
        const INSTITUTION = 'DEMO INSTITUTION';
        const REGION = 'Lisbon';
        const NUMBER = '3';
        const DESCRIPTION = 'Play card games with elderly over 80';
        
        cy.demoVolunteerLogin();
        
        cy.get('[data-cy="volunteerActivitySuggestions"]')
        .click();
        
        cy.get('[data-cy="newActivitySuggestionButton"]').click();
        
        // fill form
        cy.get('[data-cy="nameInput"]').type(NAME);
        cy.get('[data-cy="institutionSelect"]').click();
        cy.get('.v-list-item__title').contains(INSTITUTION).click();
        cy.get('[data-cy="regionInput"]').type(REGION);
        cy.get('[data-cy="participantsNumberInput"]').type(NUMBER);
        cy.get('[data-cy="descriptionInput"]').type(DESCRIPTION);
        cy.get('#applicationDeadlineInput-input').click();
        cy.get('#applicationDeadlineInput-wrapper.date-time-picker')
        .find('.datepicker-day-text')
        .eq(15)
        .click({force: true});
        cy.get('#startingDateInput-input').click();
        cy.get('#startingDateInput-wrapper.date-time-picker')
        .find('.datepicker-day-text')
        .eq(16)
        .click({force: true});
        cy.get('#endingDateInput-input').click();
        cy.get('#endingDateInput-wrapper.date-time-picker')
        .find('.datepicker-day-text')
        .eq(29)
        .click({force: true});
        // save form
        cy.get('[data-cy="saveActivity"]').click();
        
        
        // check if the activity suggestion was created
        cy.get('[data-cy="volunteerActivitySuggestions"]')
        .click();
        cy.get('[data-cy="activitySuggestionTable"] tbody tr')
        .should('have.length', 3);
        
        cy.get('[data-cy="activitySuggestionTable"] tbody tr')
        .eq(0).children().eq(0).should('contain', NAME)
        cy.get('[data-cy="activitySuggestionTable"] tbody tr')
        .eq(0).children().eq(1).should('contain', INSTITUTION)
        cy.get('[data-cy="activitySuggestionTable"] tbody tr')
        .eq(0).children().eq(4).should('contain', NUMBER)
        cy.logout();
    });
        
        //change state as member
        it('change state as member', ()=> {
          cy.demoMemberLogin();
          cy.intercept('GET', '/activitySuggestions/institution/*').as('getActivitySuggestions');
          
          //intercept requests
        //ir ate tabela, verificar se esta em review
        cy.get('[data-cy="institution"]').click();
        cy.get('[data-cy="activitysuggestions"]').click();
        cy.wait('@getActivitySuggestions');
          
        /*>>....CHECK IF MEMBER HAS ACTIVITY SUGGESTION IN REVIEW.... */
        cy.get('[data-cy="memberactivitySuggestionTable"] tbody tr')
          .eq(0)
          .children()
          .eq(9)
          .should('contain', "IN_REVIEW")
        
          /*>>...MEMBER APROVES ACTIVITY SUGGESTION.... */      
          cy.get('[data-cy="approveButton"]').first().click();
        
          /*>>....CHECK IF MEMBER HAS ACTIVITY SUGGESTION APPROVED.... */
          cy.get('[data-cy="memberactivitySuggestionTable"] tbody tr')
            .eq(0)
            .children()
            .eq(9)
            .should('contain', "APPROVED");
        
          cy.logout(); 
           /*>>....CHECK IF volunteer HAS ACTIVITY SUGGESTION APPROVED.... */
          cy.demoVolunteerLogin();
        
          cy.intercept('GET', '/activitySuggestions/volunteer/*').as('getActivitySuggestionsVolunteer');
        
          // CHECK IF STATE CHANGES TO APPROVED
          cy.get('[data-cy="volunteerActivitySuggestions"]').click();
          cy.wait('@getActivitySuggestionsVolunteer');
        
          cy.get('[data-cy="activitySuggestionTable"] tbody tr')
            .eq(1)
            .children()
            .eq(9)
            .should('contain', "APPROVED");
        
          cy.logout()
          /*>>...MEMBER REJECTS ACTIVITY SUGGESTION.... */ 
          cy.demoMemberLogin();
          cy.intercept('GET', '/activitySuggestions/institution/').as('getActivitySuggestions');
          cy.get('[data-cy= "institution"]').click();
          cy.get('[data-cy="activitysuggestions"]').click();
          cy.wait('@getActivitySuggestions');
        
        
          /*>>...MEMBER REJECTS ACTIVITY SUGGESTION.... */      
          cy.get('[data-cy="rejectButton"]').first().click();
        
        
          /*>>....CHECK IF MEMBER HAS ACTIVITY SUGGESTION REJECTED.... */
         cy.get('[data-cy="memberactivitySuggestionTable"] tbody tr')
          .eq(0)
          .children()
          .eq(9)
            .should('contain', "REJECTED");
         
         cy.logout();
        
          /*>>....CHECK IF volunteer HAS ACTIVITY SUGGESTION APPROVED.... */
        
         cy.demoVolunteerLogin();
        
          cy.intercept('GET', '/activitySuggestions/volunteer/*').as('getActivitySuggestionsVolunteer');
          cy.get('[data-cy="volunteerActivitySuggestions"]').click();
          cy.wait('@getActivitySuggestionsVolunteer');
        
          cy.get('[data-cy="activitySuggestionTable"] tbody tr')
          .eq(1)
          .children()
          .eq(9)
            .should('contain', "REJECTED");
        
        cy.logout();
    });
});



