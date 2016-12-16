// addapted from: https://git.io/vodU0
var url = 'http://localhost:3000';
module.exports = {
   'Test load page': function( browser ) {
      browser
         .url( url )
         .waitForElementVisible( 'body' )
         .assert.title( 'Webshop' )
         .waitForElementVisible( '#articleTable' )
         .waitForElementVisible( '#cartButton' )
         .waitForElementVisible( '#addToCart' )
         .expect.element( '#addToCart.button' ).to.not.be.enabled;
   },

   'Test add to cart functionality': function( browser ) {
      browser
         .click( '#LaxarJStheMug' )
         .waitForElementVisible( '#detailsImg' )
         .waitForElementVisible( '#detailsName' )
         .waitForElementVisible( '#detailsDescription' )
         .assert.containsText( '#detailsName', 'Laxar' )
         .expect.element( '#addToCart.button' ).to.be.enabled;

      browser
         .click( '#addToCart' );

      browser
         .click( '#LaxarJSStickers' )
         .waitForElementVisible( '#detailsImg' )
         .waitForElementVisible( '#detailsName' )
         .waitForElementVisible( '#detailsDescription' )
         .assert.containsText( '#detailsName', 'Laxar' )
         .expect.element( '#addToCart.button' ).to.be.enabled;


      browser
         .click( '#addToCart' );
   },

   'Test order functionality': function( browser ) {
      browser
         .waitForElementVisible( '#orderbtn' )
         .expect.element( '#orderbtn' ).to.be.enabled;
      
      browser
         .click( '#orderbtn' );

      browser.waitForElementVisible( 'body' );
      browser.assert.urlEquals( url + '/thanks' );
      browser.assert.containsText(
         'body',
         'Thank you for your order. [{"article":"B009K2QULM","quantity":1},{"article":"B00H13X4A2","quantity":1}]'
      );

   },
   
   'End test': function( browser ) {
      browser.end();
   }
};
