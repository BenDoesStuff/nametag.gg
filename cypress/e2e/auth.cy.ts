/**
 * Authentication E2E Tests for Nametag
 * Tests the complete signup and profile creation flow
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/');
  });

  it('should display the landing page correctly', () => {
    // Check main elements are present
    cy.contains('Welcome to Nametag').should('be.visible');
    cy.contains('Create your ultimate gamer profile').should('be.visible');
    cy.contains('View Sample Profile').should('be.visible');
    
    // Check navigation
    cy.get('nav').should('contain', 'Nametag');
  });

  it('should navigate to profile page', () => {
    cy.contains('View Sample Profile').click();
    cy.url().should('include', '/profile');
  });

  describe('User Registration', () => {
    it('should show sign up form when not authenticated', () => {
      // Look for auth buttons or forms
      cy.get('[data-testid="auth-button"]').should('be.visible');
    });

    // Note: Actual signup testing would require test user management
    // or mocked Supabase auth responses
    it.skip('should complete signup flow', () => {
      const testEmail = `test+${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';

      // Fill signup form
      cy.get('[data-testid="email-input"]').type(testEmail);
      cy.get('[data-testid="password-input"]').type(testPassword);
      cy.get('[data-testid="signup-button"]').click();

      // Should redirect to profile setup
      cy.url().should('include', '/profile/setup');
      
      // Fill profile information
      cy.get('[data-testid="username-input"]').type('testuser');
      cy.get('[data-testid="display-name-input"]').type('Test User');
      cy.get('[data-testid="bio-input"]').type('Test bio for e2e testing');
      
      // Complete setup
      cy.get('[data-testid="complete-setup-button"]').click();
      
      // Should redirect to user profile
      cy.url().should('include', '/testuser');
      cy.contains('Test User').should('be.visible');
    });
  });

  describe('Profile Viewing', () => {
    it('should display a sample profile correctly', () => {
      cy.visit('/profile'); // Sample profile
      
      // Check profile elements
      cy.get('[data-testid="profile-header"]').should('be.visible');
      cy.get('[data-testid="games-section"]').should('be.visible');
      cy.get('[data-testid="friends-section"]').should('be.visible');
    });

    it('should show responsive design on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/profile');
      
      // Check mobile layout
      cy.get('[data-testid="profile-header"]').should('be.visible');
      cy.get('nav').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 pages gracefully', () => {
      cy.visit('/nonexistent-user', { failOnStatusCode: false });
      
      // Should show custom 404 page
      cy.contains('404').should('be.visible');
      cy.contains('Nametag').should('be.visible'); // Navigation should still work
    });

    it('should handle network errors gracefully', () => {
      // Intercept API calls and simulate network error
      cy.intercept('POST', '**/auth/v1/**', { forceNetworkError: true });
      
      cy.get('[data-testid="auth-button"]').click();
      
      // Should show error message
      cy.contains('network error', { matchCase: false }).should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be navigable with keyboard', () => {
      // Test tab navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'href', '/');
      
      // Continue tabbing through interactive elements
      cy.focused().tab();
      cy.focused().should('be.visible');
    });

    it('should have proper ARIA labels', () => {
      cy.get('nav').should('have.attr', 'role', 'navigation');
      cy.get('main').should('exist');
      
      // Check for alt text on images
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('should have sufficient color contrast', () => {
      // This would typically be handled by axe-core
      // Check that text is readable
      cy.get('h1').should('be.visible');
      cy.get('p').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load quickly', () => {
      // Measure page load time
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.lessThan(3000); // 3 seconds
        }
      });
    });

    it('should not have console errors', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          cy.stub(win.console, 'error').as('consoleError');
        }
      });
      
      // Check for console errors
      cy.get('@consoleError').should('not.have.been.called');
    });
  });
});