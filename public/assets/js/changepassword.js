function ChangePassword(){
	
}

ChangePassword.init = function() {
	$('#changePasswordForm').validator();
  $("#changePasswordLoader").css("display","none");

  $("#currentPassword").unbind('change');
  $("#currentPassword").change(ChangePassword.onCompleteCurrentPassword);

  $('#changePasswordButton').click(ChangePassword.clickChangePasswordButton);
}

ChangePassword.onCompleteCurrentPassword = function(){
  var currentUser = Parse.User.current();
  var email = currentUser.get('email');
  var password = $("#currentPassword").val();
  $("#changePasswordLoader").css("display","block");
  Parse.User.logIn(email, password, {
      success: function(user) {
         $("#changePasswordLoader").css("display","none");
         console.log(JSON.stringify(user));
         $("#changePasswordMessage").text("");  

      },
      error: function(user, error) {
         $("#changePasswordLoader").css("display","none");
         console.log("Error: " + error.code + " " + error.message);
         if(error.code == 101){
            $("#changePasswordMessage").text("Your current password is not matched");  
         }
               

      }
    });
}

ChangePassword.clickChangePasswordButton = function(){
  var currentUser = Parse.User.current();
  var email = currentUser.get('email');
  var password = $("#currentPassword").val();
  $("#changePasswordLoader").css("display","block");
  Parse.User.logIn(email, password, {
      success: function(user) {
         $("#changePasswordLoader").css("display","none");
         console.log(JSON.stringify(user));
         $("#changePasswordMessage").text("");  

      },
      error: function(user, error) {
         $("#changePasswordLoader").css("display","none");
         console.log("Error: " + error.code + " " + error.message);
         if(error.code == 101){
            $("#changePasswordMessage").text("Your current password is not matched");  
         }
               

      }
    });
}


