'use strict';

angular.module( 'webshop', [] )
   .controller( 'ArticlesCtrl', articleController );


function articleController( $scope, $http ) {
   $scope.currentRow = null;
   $scope.search = '';
   $scope.preview = { id: '', name: '', description: '', price: '' };
   $scope.selectRow = function( index ) {
      $scope.currentRow = index;
      $scope.preview.id = $scope.articles[ index ].id;
      $scope.preview.name = $scope.articles[ index ].name;
      $scope.preview.price = $scope.articles[ index ].price;
      $scope.preview.description = $scope.articles[ index ].htmlDescription;
      $scope.preview.pictureUrl = $scope.articles[ index ].pictureUrl;
   };
   $scope.search = function( ) {
      $scope.search = $scope.presearch;
   };
   $http.get( 'articles' ).then( function( articlesResponse ) {
      $scope.articles = articlesResponse.data;
   } );
}
