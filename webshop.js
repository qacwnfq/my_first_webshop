'use strict';

// variables which are needed more than once go to the top
const EUR = '\u20AC ';
// helps filling rows with cells
const NCELLS = [ 0, 1, 2 ];
const NCELLSCART = [ 0, 1, 2, 3, 4 ];
// memorizes which row is currently selected
let selectedRow = null;
// maximum quantity that is allowed to order
const MAXORDER = 99;
// multiple functions need access to the cart and subtotal
const cart = [];
let subtotal = 0;
let articles = [];

requestArticles();
createOuterDivs();
createSearchBar();
createCaptions();
createInnerDivs();
createAddToCartButton();
createCartTable();
createPreview();

function createOuterDivs() {
   const topDiv = document.createElement( 'div' );
   const mainDiv = document.createElement( 'div' );
   const leftDiv = document.createElement( 'div' );
   const middleDiv = document.createElement( 'div' );
   const rightDiv = document.createElement( 'div' );
   topDiv.setAttribute( 'id', 'top' );
   mainDiv.setAttribute( 'id', 'main' );
   leftDiv.setAttribute( 'id', 'left' );
   middleDiv.setAttribute( 'id', 'middle' );
   rightDiv.setAttribute( 'id', 'right' );
   topDiv.className = 'div top';
   mainDiv.className = 'div main';
   leftDiv.className = 'div parts';
   middleDiv.className = 'div parts';
   rightDiv.className = 'div parts';
   mainDiv.appendChild( leftDiv );
   mainDiv.appendChild( middleDiv );
   mainDiv.appendChild( rightDiv );
   document.body.appendChild( topDiv );
   document.body.appendChild( mainDiv );
}

function createSearchBar() {
   const defaultText = document.createTextNode( 'Search for articles' );
   defaultText.className = 'default-text';
   const searchForm = document.createElement( 'form' );
   searchForm.setAttribute( 'id', 'searchForm' );
   searchForm.className = 'search-form';
   const searchInput = document.createElement( 'input' );
   searchInput.setAttribute( 'type', 'text' );
   searchInput.setAttribute( 'name', 'search' );
   searchInput.setAttribute( 'id', 'searchInput');
   const searchButton = document.createElement( 'input' );
   searchButton.setAttribute( 'type', 'submit' );
   searchButton.setAttribute( 'value', 'Submit' );
   searchButton.setAttribute( 'id', 'searchButton' );

   searchInput.placeholder = defaultText.data;
   searchForm.appendChild( searchInput );
   searchForm.appendChild( searchButton );
   const topDiv = document.getElementById( 'top' );
   topDiv.appendChild( searchForm );
}

function createCartTable() {
   let table = document.createElement( 'table' );
   table.setAttribute( 'id', 'cartTable' );
   document.body.appendChild(table );
   table = document.getElementById( 'cartTable' );
   table.header = table.createTHead();
   table.body = table.createTBody();
   table.body.row = table.body.insertRow( 0 );
   table.header.row = table.header.insertRow( 0 );
   table.header.cells = [ table.header.row.insertCell( 0 ) ];
   table.header.row.cells[ 0 ].appendChild( document.createTextNode(
      'Please select articles to add them to the cart!' ) );
   table.header.row.className = 'empty-cart';
   const divCart = document.getElementById( 'cart' );
   divCart.appendChild( table );
   return table;
}

function resetCartTable() {
   const cartTable = document.getElementById( 'cartTable' );
   const divCart = document.getElementById( 'cart' );
   cartTable.body.innerHTML = '';
   cartTable.header.innerHTML = '';
   cartTable.header.row = cartTable.header.insertRow( 0 );
   cartTable.body.row = cartTable.body.insertRow( 0 );
   cartTable.header.cells = [ cartTable.header.row.insertCell( 0 ) ];
   cartTable.header.row.cells[ 0 ].appendChild(
      document.createTextNode( 'Please select articles to add them to the cart!' )
   );
   cartTable.header.row.className = 'empty-cart';
   cartTable.subtotal.parentNode.removeChild( cartTable.subtotal );
   divCart.appendChild( cartTable );
   // removes order button
   const divOrderButton = document.getElementById( 'orderButton' );
   divOrderButton.removeChild( document.getElementById( 'orderbtn' ) );
}


function createAddToCartButton() {
   const addToCart = document.createElement( 'BUTTON' );
   const addToCartText = document.createTextNode( 'Add to Cart' );
   const divCartButton = document.getElementById( 'cartButton' );
   addToCart.appendChild( addToCartText );
   addToCart.setAttribute( 'id', 'addToCart' );
   addToCart.className = 'button';
   addToCart.disabled = true;
   addToCart.onclick = function() {
      return console.log( 'You can\'t add undefined to cart.' );
   };
   divCartButton.appendChild( addToCart );
   return addToCart;
}

function createPreview() {
   // creates def list, but doesn't fill it yet
   const dl = document.createElement( 'dl' );
   let dt = document.createElement( 'dt' );
   let dd = null;
   dt.setAttribute( 'id', 'detailsName' );
   dt.className = 'bold detailsName';
   dl.appendChild( dt );

   dt = document.createElement( 'dt' );
   dt.setAttribute( 'id', 'detailsImg' );
   dt.className = 'bold left';
   dl.appendChild( dt );

   dt = document.createElement( 'dt' );
   dd = document.createElement( 'dd' );
   dt.appendChild(document.createTextNode( 'Art. ID' ));
   dt.className = 'bold left';
   dd.setAttribute( 'id', 'detailsArt. ID' );
   dl.appendChild( dt );
   dl.appendChild( dd );

   dt = document.createElement( 'dt' );
   dd = document.createElement( 'dd' );
   dt.setAttribute( 'id', 'detailsDescription1' );
   dt.className = 'bold left';
   dt.appendChild(document.createTextNode( 'Description' ));
   dd.setAttribute( 'id', 'detailsDescription' );
   dl.appendChild( dt );
   dl.appendChild( dd );

   dt = document.createElement( 'dt' );
   dd = document.createElement( 'dd' );
   dt.className = 'bold left';
   dt.appendChild(document.createTextNode( 'Price' ));
   dd.setAttribute( 'id', 'detailsPrice' );
   dl.appendChild( dt );
   dl.appendChild( dd );

   const divDetails = document.getElementById( 'details' );
   divDetails.appendChild( dl );
}


// handles click events on the table
function addRowHandlers() {
   // let table = document.getElementById( 'articleTable' );
   const rows = Array.prototype.slice.call( document.getElementById( 'articleTable' ).rows );
   let current = null;
   const currentArticles = getCurrentArticles();
   const addToCart = document.getElementById( 'addToCart' );
   const createClickHandler = function(row, index) {
      // skips table header
      if( index !== 0 ) {
         const create = function( row ) {
            return function() {
               if( current ) {
                  removeProductDetails();
                  current.className = 'article';
               }
               if( !current ) {
                  // changes state of cart button
                  addToCart.disabled = false;
                  addToCart.className = 'button add-to-cart active';
                  addToCart.onclick = addToCartHandler();
               }
               row.className = 'current-article';
               current = row;
               selectedRow = row.rowIndex - 1; //-1 because of header
               displayProductDetails( currentArticles[ selectedRow ] );
            };
         };
         row.onclick = create( row );
      }
   };
   rows.forEach( createClickHandler );
}

function createButtonPlus() {
   const buttonPlus = document.createElement( 'BUTTON' );
   buttonPlus.setAttribute( 'id', 'buttonPlus' );
   buttonPlus.className = 'quantityBtn';
   const buttonPlusText = document.createTextNode( '+' );
   buttonPlus.appendChild( buttonPlusText );
   return buttonPlus;
}

function createButtonMinus() {
   const buttonMinus = document.createElement( 'BUTTON' );
   buttonMinus.setAttribute( 'id', 'buttonPlus' );
   buttonMinus.className = 'quantityBtn';
   const buttonMinusText = document.createTextNode( '-' );
   buttonMinus.appendChild( buttonMinusText );
   return buttonMinus;
}

function updateQuantity( currentArticles ) {
   const cartTable = document.getElementById( 'cartTable' );
   const j = cart.map( function( e ) { return e.article; } ).indexOf( currentArticles[ selectedRow ].id );
   cart[j].quantity += 1;
   const quantity = Number( cartTable.body.rows[ j ].cells[ 3 ].firstChild.data );
   if( quantity >= MAXORDER ) {
      console.log( 'Out of Stock.' );
   }
   else {
      cartTable.body.rows[ j ].cells[ 3 ].removeChild( cartTable.body.rows[ j ].cells[ 3 ].firstChild );
      cartTable.body.rows[ j ].cells[ 3 ].insertBefore(
         document.createTextNode( Number( quantity + 1 ) ),
         cartTable.body.rows[ j ].cells[ 3 ].firstChild
      );
   }
}

function addNewArticleToCart( buttonPlus, buttonMinus, currentArticles ) {
   const cartTable = document.getElementById( 'cartTable' );
   cartTable.body.row = cartTable.insertRow( cart.length + 1 );
   cart.push( { article: currentArticles[ selectedRow ].id, quantity: 1 } );
   const CELLS = NCELLSCART.map( i => cartTable.body.row.insertCell( i ) );
   CELLS[ 0 ].appendChild( document.createTextNode( currentArticles[ selectedRow ].id ) );
   CELLS[ 1 ].appendChild( document.createTextNode( currentArticles[ selectedRow ].name ) );
   CELLS[ 2 ].appendChild( document.createTextNode( EUR ) );
   CELLS[ 2 ].appendChild( document.createTextNode( currentArticles[ selectedRow ].price ) );
   CELLS[ 3 ].appendChild( document.createTextNode( 1 ) );
   // adds + and - buttons
   CELLS[ 4 ].appendChild( buttonPlus );
   CELLS[ 4 ].appendChild( buttonMinus );

}

function updateSubtotal() {
   const cartTable = document.getElementById( 'cartTable' );
   cartTable.subtotal.cells[ 1 ].removeChild( cartTable.subtotal.cells[ 1 ].lastChild );
   cartTable.subtotal.cells[ 1 ].appendChild( document.createTextNode( subtotal.toFixed( 2 ) ) );
}

function addToCartHandler() {
   const currentArticles = getCurrentArticles();
   return function() {
      const buttonPlus = createButtonPlus();
      const buttonMinus = createButtonMinus();
      if( cart.length === 0 ) {
         initializeCart();
      }
      subtotal += currentArticles[ selectedRow ].price;
      updateSubtotal();

      if( cart.map( function( e ) { return e.article; } ).indexOf( currentArticles[ selectedRow ].id ) === -1 ) {
         addNewArticleToCart( buttonPlus, buttonMinus, currentArticles);
      }

      else {
         updateQuantity( currentArticles );
      }

      buttonPlus.onclick = buttonPlusFunction();
      buttonMinus.onclick = buttonMinusFunction();
   };
}

function buttonPlusFunction() {
   return function() {
      const CELL = this.parentElement.parentElement.cells[ 3 ];
      const PARENT = CELL.parentElement;
      const QUANTITY = Number( CELL.firstChild.data );
      if( QUANTITY >= MAXORDER ) {
         console.log( 'Out of Stock.' );
      }
      else {
         const index = cart.map( function( e ) { return e.article; } ).indexOf( PARENT.cells[ 0 ].lastChild.data );
         cart[ index ].quantity += 1;
         CELL.removeChild( CELL.firstChild );
         CELL.insertBefore( document.createTextNode( QUANTITY + 1 ), CELL.firstChild );
         subtotal += Number( CELL.parentElement.cells[ 2 ].lastChild.data );
         updateSubtotal();
      }
   };
}

function buttonMinusFunction() {
   return function() {
      const CELL = this.parentElement.parentElement.cells[ 3 ];
      const PARENT = CELL.parentElement;
      const QUANTITY = Number( CELL.firstChild.data );
      subtotal -= Number( CELL.parentElement.cells[ 2 ].lastChild.data );
      if( subtotal === -0 ) {
         subtotal = 0;
      }
      const index = cart.map( function( e ) { return e.article; } ).indexOf( PARENT.cells[ 0 ].lastChild.data );
      cart[ index ].quantity -= 1;
      updateSubtotal();
      if( QUANTITY <= 1 ) {
         // removes element from cart
         if( index > -1 ) {
            cart.splice( index, 1 );
         }
         while(PARENT.firstChild) {
            PARENT.removeChild( PARENT.firstChild );
         }
         if( cart.length === 0 ) {
            resetCartTable();
         }
      }
      else {
         CELL.removeChild( CELL.firstChild );
         CELL.insertBefore( document.createTextNode( QUANTITY - 1 ), CELL.firstChild );
      }
   };
}

function submitSearch() {
   const articleTable = document.getElementById( 'articleTable' );
   const addToCart = document.getElementById( 'addToCart' );
   return function() {
      // doesn't count header
      while( articleTable.rows.length - 1 ) {
         articleTable.deleteRow( 1 );
      }
      addToCart.disabled = true;
      addToCart.className = 'button';
      getCurrentArticles().forEach( fillArticleTable );
      if( selectedRow !== null ) {
         removeProductDetails();
         selectedRow = null;
      }
      addRowHandlers();
      return false;
   };
}

function getCurrentArticles() {
   const searchInput = document.getElementById( 'searchInput' );
   return articles.filter( function( el ) {
      return (
         el.name.toLowerCase().indexOf( searchInput.value.toLowerCase() ) !== -1
      ) || ( el.id.toLowerCase().indexOf( searchInput.value.toLowerCase() ) !== -1 );
   } );
}

function removeProductDetails() {
   document.getElementById( 'detailsName' ).removeChild( document.getElementById( 'detailsName' ).lastChild );
   document.getElementById( 'detailsArt. ID' ).removeChild( document.getElementById(
      'detailsArt. ID' ).lastChild );
   document.getElementById( 'detailsDescription' ).removeChild(
      document.getElementById( 'detailsDescription' ).lastChild );
   document.getElementById( 'detailsPrice' ).removeChild( document.getElementById(
      'detailsPrice' ).lastChild );
   document.getElementById( 'detailsImg' ).removeChild( document.getElementById( 'detailsImg' ).lastChild );
}

function displayProductDetails(article) {
   const img = document.createElement( 'img' );
   img.setAttribute( 'id', 'product-preview-image' );
   img.className = 'img';
   document.getElementById( 'detailsName' ).appendChild( document.createTextNode( article.name ) );
   const detailsImg = document.getElementById( 'detailsImg' );
   img.src = article.pictureUrl;
   detailsImg.appendChild( img );
   document.getElementById( 'detailsArt. ID' ).appendChild( document.createTextNode( article.id ) );
   document.getElementById( 'detailsDescription' ).appendChild( document.createTextNode(
      article.htmlDescription ) );
   document.getElementById( 'detailsPrice' ).appendChild( document.createTextNode( EUR + article.price ) );
}

function createCaptions() {
   const articleCaption = document.createElement( 'H2' );
   articleCaption.appendChild( document.createTextNode( 'Articles' ) );
   articleCaption.className = 'bold articlesCaption';
   const leftDiv = document.getElementById( 'left' );
   leftDiv.appendChild( articleCaption );
   const detailsCaption = document.createElement( 'H2' );
   detailsCaption.appendChild( document.createTextNode( 'Details' ) );
   detailsCaption.className = 'bold detailsCaption';
   const middleDiv = document.getElementById( 'middle' );
   middleDiv.appendChild( detailsCaption );
   const cartCaption = document.createElement( 'H2' );
   cartCaption.className = 'bold cartCaption';
   cartCaption.appendChild( document.createTextNode( 'Shopping Cart' ) );
   const rightDiv = document.getElementById( 'right' );
   rightDiv.appendChild( cartCaption );
}

function createInnerDivs() {
   let divArticles = document.createElement( 'div' );
   let divDetails = document.createElement( 'div' );
   let divCartButton = document.createElement( 'div' );
   let divCart = document.createElement( 'div' );
   let divOrderButton = document.createElement( 'div' );

   divArticles.setAttribute( 'id', 'articles' );
   divDetails.setAttribute( 'id', 'details' );
   divCartButton.setAttribute( 'id', 'cartButton' );
   divCart.setAttribute( 'id', 'cart' );
   divOrderButton.setAttribute( 'id', 'orderButton' );
   const leftDiv = document.getElementById( 'left' );
   leftDiv.appendChild( divArticles );
   const middleDiv = document.getElementById( 'middle' );
   middleDiv.appendChild( divDetails );
   middleDiv.appendChild( divCartButton );
   const rightDiv = document.getElementById( 'right' );
   rightDiv.appendChild( divCart );
   rightDiv.appendChild( divOrderButton );
   divArticles = document.getElementById( 'articles' );
   divDetails = document.getElementById( 'details' );
   divCartButton = document.getElementById( 'cartButton' );
   divCart = document.getElementById( 'cart' );
   divOrderButton = document.getElementById( 'orderButton' );
   divArticles.classcName = 'div parts box';
   divDetails.className = 'div parts box';
   divCart.className = 'div parts box';
   divCartButton.className = 'div buttons';
   divOrderButton.className = 'div buttons';
   divArticles.className += ' articles';
   divDetails.className += ' details';
   divCart.className += ' cart';
}

function initializeCart() {
   const cartTable = document.getElementById( 'cartTable' );
   const divCart = document.getElementById( 'cart' );
   // changes cart header
   cartTable.header.row.cells[ 0 ].removeChild( cartTable.header.row.cells[ 0 ].lastChild );
   cartTable.header.row.deleteCell( 0 );
   cartTable.header.row.className = 'table-header cart';
   const CELLS = NCELLSCART.map( i => cartTable.header.row.insertCell( i ) );
   CELLS[ 0 ].appendChild( document.createTextNode( 'Art. ID' ) );
   CELLS[ 1 ].appendChild( document.createTextNode( 'Article' ) );
   CELLS[ 2 ].appendChild( document.createTextNode( 'Price' ) );
   CELLS[ 3 ].appendChild( document.createTextNode( 'Quantity' ) );

   // adds subtotal line
   cartTable.subtotal = document.createElement( 'table' );
   cartTable.subtotal.setAttribute( 'id', 'subtotalTable' );
   divCart.appendChild( cartTable.subtotal );
   cartTable.subtotal = cartTable.subtotal.insertRow( 0 );
   cartTable.subtotal.className = 'subtotal';
   cartTable.subtotal.insertCell( 0 ).appendChild( document.createTextNode( 'Subtotal' ) );
   cartTable.subtotal.insertCell( 1 ).appendChild( document.createTextNode( EUR ) );
   cartTable.subtotal.cells[ 1 ].appendChild( document.createTextNode( '0' ) );

   // adds order button
   const order = document.createElement( 'BUTTON' );
   order.className = 'button order active';
   order.setAttribute( 'id', 'orderbtn' );
   const orderText = document.createTextNode( 'Order' );
   order.appendChild( orderText );
   order.onclick = function() {
      // request articles
      const xmlHttpOrder = new XMLHttpRequest();
      xmlHttpOrder.open( 'POST', 'http://localhost:3000/order', true );
      xmlHttpOrder.setRequestHeader( 'Content-type', 'order' );
      xmlHttpOrder.send( JSON.stringify( cart ) );
      xmlHttpOrder.addEventListener( 'readystatechange', processOrder, false);
   };
   const divOrderButton = document.getElementById( 'orderButton' );
   divOrderButton.appendChild( order );

}

function fillArticleTable( article, index, array ) {
   const articleTable = document.getElementById( 'articleTable' );
   const ROW = articleTable.insertRow( index + 1 );
   ROW.className = 'article';
   ROW.id = array[ index ].name.replace(/\s/g, '');
   const CELLS = NCELLS.map( index => ROW.insertCell( index ) );
   CELLS[ 0 ].appendChild( document.createTextNode( array[ index ].id ) );
   CELLS[ 1 ].appendChild( document.createTextNode( array[ index ].name ) );
   CELLS[ 2 ].appendChild( document.createTextNode( EUR + parseFloat( array[ index ].price ).toFixed( 2 ) ) );
}


function createArticleTable() {
   // creates article table and its header
   const divArticles = document.getElementById( 'articles' );
   let articleTable = document.createElement( 'table' );
   articleTable.setAttribute( 'id', 'articleTable' );
   articleTable.header = articleTable.createTHead();
   articleTable.header.row = articleTable.header.insertRow( 0 );
   articleTable.header.row.className = 'table-header articles';
   const CELLS = NCELLS.map( i => articleTable.header.row.insertCell( i ) );
   CELLS[ 0 ].appendChild( document.createTextNode( 'Art. ID' ) );
   CELLS[ 1 ].appendChild( document.createTextNode( 'Article' ) );
   CELLS[ 2 ].appendChild( document.createTextNode( 'Price' ) );
   divArticles.appendChild( articleTable );

   // fills article table body
   articleTable = document.getElementById( 'articleTable' );
   articles.forEach( fillArticleTable );
   divArticles.appendChild( articleTable );

   addRowHandlers();
}

function processOrder() {
   const xmlHttpOrder = this;
   if( xmlHttpOrder.readyState === 4 && xmlHttpOrder.status === 200 ) {
      const response = xmlHttpOrder.responseText;
      console.log( response );
      location.href = 'http://localhost:3000/thanks';
   }
}
function requestArticles() {
   // requests articles
   const xmlHttpObject = new XMLHttpRequest();
   xmlHttpObject.open( 'GET', 'http://localhost:3000/articles', true );
   xmlHttpObject.send();
   xmlHttpObject.addEventListener( 'readystatechange', processRequest, false);
}

function processRequest() {
   const xmlHttpObject = this;
   if( xmlHttpObject.readyState === 4 && xmlHttpObject.status === 200 ) {
      const response = xmlHttpObject.responseText;
      articles = JSON.parse( response );
      createArticleTable();
      const searchForm = document.getElementById( 'searchForm' );
      searchForm.onsubmit = submitSearch();
   }
}
