describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

describe('login / logout flow specification', () => {

  it('cannot navigate to /products without being logged in', () => {
    cy.visit("/products")
    .url().should('include', "/login");
  });

  it('cannot access shopping cart without being logged in', () => {
    cy.visit("/cart")
    .url().should('include', "/login");
  });

  it('rejects a login attempt by an invalid user: !!!', () => {
    cy.visit("/login")
    .get('input[name="username"]').type("!!!").type("{enter}")
    .get('input[name="password"]').type("!!!").type("{enter}")
    .url().should('include', "/login");
  });

  it('accepts a login attempt by a valid user: Blessing', () => {
    cy.visit("/login")
    .get('input[name="username"]').type("Blessing").type("{enter}")
    .get('input[name="password"]').type("web422").type("{enter}")
    .url().should('include', "/");
  });

  it('successfully logs out after authenticating', () => {
    cy.visit("/login")
    .get('input[name="username"]').type("Blessing").type("{enter}")
    .get('input[name="password"]').type("web422").type("{enter}")
   // Confirm the login was successful (use a unique element that appears on login)
   cy.url().should('not.include', '/login'); // Ensure we are not on the login page

   // Wait for the Logout button to be visible and click it
   cy.get('[data-cy="logout-button"]', { timeout: 10000 }).should('be.visible').click()

   // Confirm the user is redirected to the login page
   cy.url().should('include', '/login');
  });

});

describe('Shopping Cart', () => {
  const mockProductData = [
    {
      id: 2,
      title: "Mens Casual Premium Slim Fit T-Shirts",
      description: "Description for Product 2",
      price: 22.3,
      rating: { rate: 4.1 },
      image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
    }
  ];
  


  it('Login and navigate to products page', () => {
    cy.visit("/login")
    .get('input[name="username"]').type("Blessing").type("{enter}")
    .get('input[name="password"]').type("web422").type("{enter}")
    cy.visit("/products")
    .url().should('include', "/products");
  });

  it('Logged in user can access their shopping cart', () => {
    cy.visit("/login")
    .get('input[name="username"]').type("Blessing").type("{enter}")
    .get('input[name="password"]').type("web422").type("{enter}")
    cy.visit("/cart")
    .url().should('include', "/cart");
    cy.get('[data-cy="logout-button"]', { timeout: 10000 }).should('be.visible').click()
  });

  
  it('Add product to shopping cart', () => {
    cy.visit("/login")
    .get('input[name="username"]').type("Blessing")
    .get('input[name="password"]').type("web422").type("{enter}")
    .get('button[type="submit"]').click();
    // Alias the network request for products
    cy.intercept('GET', 'https://fakestoreapi.com/products', {
      statusCode: 200,
      body: mockProductData,
    }).as('getMockedProducts');
    cy.visit("/products")
    .url().should('include', "/products");
    cy.url().should('not.include', '/login');
    cy.url().should('include', '/products');
    cy.wait('@getMockedProducts').then((interception) => {
      // You can log the interception if needed
      console.log(interception);
    });
    cy.get('table tbody').should('exist');
    cy.wait(5000);
    cy.get('button').contains('Logout').should('exist');
    cy.intercept('GET', '**/login').as('loginRedirect');
    //cy.wait('@loginRedirect').then((interception) => {
     // console.log('Redirect to login detected:', interception);
   // });
    cy.visit("/products")
    cy.url().should('include', '/products');
    // Click "Add to Cart" on the first product
    cy.get('table tbody tr').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
        cy.visit('/cart');

      // Verify that the cart has at least one item
      cy.get('ul > li').should('have.length.greaterThan', 0);
  });

});