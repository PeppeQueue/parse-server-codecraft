function Dashboard(){
	
}

Dashboard.init = function() {
	Parse.initialize(Config.PARSE_APP_ID);
  Parse.serverURL = Config.PARSE_SERVER_URL;
	var currentUser = Parse.User.current();
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
    var text = "";
    $("#dashboardMessage").text(dashboardMessage);    
  }, function(error) {
    
  });
}