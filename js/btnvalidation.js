var chatApp = angular.module('chatApp',['ngRoute']);


function logval()  
{  
  var uemail = document.getElementById("email").value;
  var passid = document.getElementById("password").value;

  var atpos = uemail.indexOf("@");
    var dotpos = uemail.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=uemail.length) {
        alert("Not a valid e-mail address");
        return false;
    }
  
}

function regval(){
  var uemail = document.getElementById("emailreg").value;
  var passid = document.getElementById("passwordreg").value;
  var uname = document.getElementById("userName").value;

  var atpos = uemail.indexOf("@");
    var dotpos = uemail.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=uemail.length) {
        alert("Not a valid e-mail address");
        return false;
    }
}



chatApp.controller('AppCtrl',['$scope','$http',function($scope,$http){
  console.log("Hello World from controller");

  var refresh = function(){
    $scope.lgn="";
    $scope.reg="";
    $http.get('/PixelHouseStudio').success(function(response){
    console.log("I got the data I requested");
  });
  };

  $scope.login = function(email,password){
    var check = logval();
    console.log($scope.lgn);
    if(check !== false)
    {
      email = $scope.lgn.email
      password = $scope.lgn.password
      console.log(email)
     $http.get('/PixelHouseStudio/'+ email + '/' + password).success(function(response){

      if(response[0] == null)
      {
        alert("ID doesn't found");
      }
      else{
      alert("Welcome "+response[0].name);
      refresh();  
      }
      
    }); 
    }
    
  };

  $scope.register = function(email,name){
    var check = regval();
    console.log($scope.reg);
    email = $scope.reg.email
    name = $scope.reg.name
    if(check !== false)
    {
     $http.post('/PixelHouseStudio',$scope.reg).success(function(response){
      console.log(response);
      alert("Welcome " + name + ",You success registered, Your Email : " + email);
      refresh();
    }); 
    }
    
  };

}]);

