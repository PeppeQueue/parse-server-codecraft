function Login(){
	
}

Login.init = function() {
	$("#signUpDiv").hide();
  $("#forgotPasswordDiv").hide();
	$("#newSignUp").click(function() {			
			console.log("clicked");
			$("#loginDiv").hide();
			$("#signUpDiv").show();
      $("#forgotPasswordDiv").hide();
      $('#signUpForm').validator('destroy');
      $('#signUpForm').validator();
	});
	$("#newLogin").click(function() {				
			$("#signUpDiv").hide();
			$("#loginDiv").show();
      $("#forgotPasswordDiv").hide();
      $('#signInForm').validator('destroy');
      $('#signInForm').validator();
	});

  $("#forgotPasswordLink").click(function() {       
      $("#signUpDiv").hide();
      $("#loginDiv").hide();
      $("#forgotPasswordDiv").show();
      $("#forgotPasswordMessage").text(""); 
      $('#forgotPasswordForm').validator('destroy');
      $('#forgotPasswordForm').validator();
  });

  $("#signInForgotPasswordForm").click(function() {       
      $("#signUpDiv").hide();
      $("#loginDiv").show();
       $("#forgotPasswordDiv").hide();
      $('#signInForm').validator('destroy');
      $('#signInForm').validator();
  });
  
  


	$('#signInButton').click(Login.clickSignInButton);
    $('#signUpButton').click(Login.clickSignUpButton);
  $('#forgotPasswordButton').click(Login.clickForgotPasswordButton);

	//initialize parse
	Parse.initialize(Config.PARSE_APP_ID);
  Parse.serverURL = Config.PARSE_SERVER_URL;

  //clear user local datastorage
  Parse.User.logOut();
	
	$('#signInForm').validator();
	$('#signUpForm').validator();
	
	$("#loader").css("display","none");
	$("#signUpLoader").css("display","none");
  $("#forgotPasswordLoader").css("display","none");
	
  $("#signUpMessage").css("color", "red");
  $("#signInMessage").css("color", "red");
  $('#signInButton').prop('disabled', false);

  $('#signInForm').on('valid.bs.validator', function(){      
      $('#signInButton').prop('disabled', false);
  });

  $('#signInForm').on('invalid.bs.validator', function(){      
      $('#signInButton').prop('disabled', true);
  });
	
}

Login.clickSignUpButton = function(){
	var email = $("#signUpEmail").val();
	var phone = $("#signUpPhone").val();
	var password = $("#signUpPassword").val();
  var name = $("#signUpName").val();
  var agreed = $("#signUpTerms").val();
  

    var user = new Parse.User();
    user.set("username", email);
    user.set("password", password);
    user.set("email", email);
    user.set("name",name);
    user.set("phone", phone);
    user.set("termsAgreed", agreed);

    var errors = $('#signUpForm').validator('validate').has('.has-error').length;
    if(errors === 0){
	    $("#signUpLoader").css("display","block");
      user.signUp(null, {
        success: function(user) {
    
        console.log("user successfully signed Up" + user.id); 
        $("#signUpMessage").css("color", "green");
		    $("#signUpMessage").text("Your account has been created. Please check your inbox and confirm the email address");
		    $("#signUpLoader").css("display","none");
       
       
       },
       error: function(user, error) {
       $("#signUpLoader").css("display","none");
        $("#signUpMessage").css("color", "red");
       console.log("Error: " + error.code + " " + error.message);
       $("#signUpMessage").text(error.message);
       
       }
    });
}

    
}


Login.clickSignInButton = function(){    
    var email = $("#signInEmail").val();
	var password = $("#signInPassword").val();  
  
  var errors = $('#signInForm').validator('validate').has('.has-error').length;
  if(errors === 0){
	$("#loader").css("display","block");
    Parse.User.logIn(email, password, {
      success: function(user) {
		 $("#loader").css("display","none");
         console.log(JSON.stringify(user))
         if(user.get("emailVerified") == true){
           window.location.href = "/dashboard";
         }else{
           $("#signInMessage").text("Please confirm your email before proceed.");
         }
         
		 
      },
      error: function(user, error) {
		$("#loader").css("display","none");
         console.log("Error: " + error.code + " " + error.message);
         if(error.code == 200){
            $("#signInMessage").text("Email is required.");  
         }else{
		$("#signInMessage").text(error.message);
         }
		           

      }
    });
  } 
	
	
}

Login.clickForgotPasswordButton = function(){    
  var email = $("#forgotPasswordEmail").val();
  $("#forgotPasswordLoader").css("display","block");
	Parse.User.requestPasswordReset(email, {
       success: function() {
        $("#forgotPasswordMessage").css("color", "green");
        $("#forgotPasswordMessage").text("Password reset link has been sent."); 
        $("#forgotPasswordLoader").css("display","none");
       },
        error: function(error) {
          $("#forgotPasswordMessage").css("color", "red");
          $("#forgotPasswordMessage").text(error.message); 
          $("#forgotPasswordLoader").css("display","none");
       }
   });
	
	
}


