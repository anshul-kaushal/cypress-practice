describe('Basic game functionality', () => {
  it('should allow the player to select a single card', () => {
    cy.visit('http://127.0.0.1:8080/')
    const cardSelectedIndex = Math.floor(Math.random() * 24);
    cy.get('.card').eq(cardSelectedIndex).click();
    cy.get('.card').eq(cardSelectedIndex).invoke('attr', 'class').should('contain', 'is-selected');
  });

  it('should allow matching pairs to remain face-up', () => {
    cy.visit('http://127.0.0.1:8080/');

    cy.get('.card').eq(0).click();
    cy.get('.card').eq(2).click();

    cy.get('.card').eq(0).invoke('attr', 'class').should('contain', 'is-matched');
    cy.get('.card').eq(2).invoke('attr', 'class').should('contain', 'is-matched');
  });

  it('should flip non-matching pairs face-down', () => {
    cy.visit('http://127.0.0.1:8080/');
    cy.get('.card').eq(1).click();
    cy.get('.card').eq(3).click();

    cy.get('.card').eq(1).invoke('attr', 'class').should('not.contain', 'is-matched').should('not.contain', 'is-selected');
    cy.get('.card').eq(3).invoke('attr', 'class').should('not.contain', 'is-matched').should('not.contain', 'is-selected');
  });
});

describe('Countdown functionality', () => {
  it('should start the countdown when the user selects the first card', () => {
    cy.clock()
    cy.visit('http://127.0.0.1:8080/');
    cy.get('.card').first().click();
    cy.tick(0);
    cy.get('.timer').should('have.text', '3');
  });

  it('should flip the cards face-down when the countdown runs out', () => {
    cy.clock()
    cy.visit('http://127.0.0.1:8080/');
    cy.get('.card').first().click();
    cy.tick(3000);
    cy.get('.card').first().invoke('attr', 'class').should('not.contain', 'is-selected');
  });

  it('should reset the countdown when it runs out', () => {
    cy.clock()
    cy.visit('http://127.0.0.1:8080/');
    cy.get('.card').eq(4).click();
    cy.tick(3000);
    cy.get('.timer').should('have.text', '?')
  });

  it('should reset the countdown when the user selects a second card', () => {
    cy.clock()
    cy.visit('http://127.0.0.1:8080/');
    cy.get('.card').eq(4).click();
    cy.tick(1000);
    cy.get('.card').eq(5).click();
    cy.get('.timer').should('have.text', '?');
  });
});

describe('Endgame functionality', () => {
  it('should display a congratulatory message when the player successfully matches all of the cards', () => {
    cy.visit('http://127.0.0.1:8080/');
    const pairs = [
      [0,2],
      [1,4],
      [3,5],
      [6,8],
      [7,10],
      [9,11],
      [12,16],
      [13,14],
      [15,17],
      [18,19],
      [20,23],
      [21,22]
    ]
    pairs.forEach((pair)=>{
      const firstCardIndex = pair[0];
      const secondCardIndex = pair[1];

      cy.get('.card').eq(firstCardIndex).click();
      cy.get('.card').eq(secondCardIndex).click();
    })

    cy.get('.endgame').invoke('attr', 'class').should('contain', 'is-active')
  });
});
