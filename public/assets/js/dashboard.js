function Dashboard(){
	
}

Dashboard.init = function() {
	Parse.initialize(Config.PARSE_APP_ID);
  Parse.serverURL = Config.PARSE_SERVER_URL;
	var currentUser = Parse.User.current();
  $('.main').hide();
  $('#restaurant-container').show();

  if (currentUser) {
      console.log(JSON.stringify(currentUser))
      $("#usernameLabel").html(currentUser.get("name") + "<span class='caret'></span>");
  } else {
     window.location.href = "/";
  }
  $('#logoutLink').click(Dashboard.clickLogoutLink);
  Dashboard.initConfigurations();
}

Dashboard.clickLogoutLink = function(){
    Parse.User.logOut().then(() => {
       var currentUser = Parse.User.current();  // this will now be null
       console.log(currentUser);
       window.location.href = "/";
    });
}

Dashboard.initConfigurations = function(){
  Parse.Config.get().then(function(config) {
    var dashboardMessage = config.get("dashboardMessage");
    var defaultRestaurantImageUrl = config.get("defaultRestaurantImage").url();    
    localStorage.setItem("defaultRestaurantImageUrl", defaultRestaurantImageUrl);
    var defaultMenuItemImageUrl = config.get("defaultMenuItemImage").url();    
    localStorage.setItem("defaultMenuItemImageUrl", defaultMenuItemImageUrl);
    var text = "";
    $("#dashboardMessage").text(dashboardMessage);    
    var jsArray = config.get("fixedRestaurantMenuItemCats");
    console.log(jsArray.length);
    for(var i = 0;i<jsArray.length;i++){
      var obj = jsArray[i];
      console.log(obj.class);
    }
    
    
  }, function(error) {
    
  });
}