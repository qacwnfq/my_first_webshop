const my_http = require( 'http' );
const express = require( 'express' );
const path = require( 'path' );
const fs = require( 'fs' );

const PICTUREURL = 'http://laxarjs.github.io/shop-demo/includes/widgets/shop-demo/dummy-articles-activity/images/';

const app = express();
app.set( 'view engine', 'jade' );
     
app.get( '/', function( request, response ) {
   response.sendFile(path.join( __dirname + '/index.html') );
   console.log( 'loading page');
} );

app.get( '/articles', function( request, response ) {
   console.log( 'loading articles' );
   response.setHeader( 'Access-Control-Allow-Origin', '*' );
   const articles = require( './articles.json' );
   articles.map( function( article ) {
      article.pictureUrl = ( PICTUREURL + article.picture );
      return article;
   } );
   response.write( JSON.stringify( articles ) );
   response.end();
} );

app.get( '/thanks', function( request, response ) {
   response.sendFile(path.join( __dirname + '/thanks.html') );
} );

app.post( '/order', function( request, response ) {
   console.log( 'thank you for your order' );
   var body = '';
   request.on( 'data', function( data ) {
      body += data;
   } );
   request.on( 'end', function() {
      var post = JSON.parse( body );
      console.log( post );
      fs.writeFile( __dirname + '/order.json', JSON.stringify( post ), function ( err ) {
         console.log( 'order.json' );
      });
   } );
   response.write( 'THANKS' );
   response.end();
} );

app.get( '/yourOrder', function( request, response ) {
   console.log( 'loading order' );
   fs.readFile( './order.json', 'utf8', function ( err, data ) {
      console.log( data );
      response.end( data );
   });
} );

app.use(express.static( __dirname ) );

app.listen(3000);

console.log( 'Running at port 3000' );
