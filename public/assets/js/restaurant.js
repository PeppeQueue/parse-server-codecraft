function Restaurant() {
    

}

Restaurant.init = function () {
    var nameError = true,contactNameError =true,cityError =true,zipCodeError = true,
        descriptionError = true,
        countryError = true,
        stateError = true,
        addressLine1Error = true; 


    $('.form-peice').hide();
    Parse.initialize(Config.PARSE_APP_ID);
    Parse.serverURL = Config.PARSE_SERVER_URL;
    var currentUser = Parse.User.current();
    $('#editRestaurantButton').hide();
    Restaurant.loadRestaurants();
    Restaurant.loadCuisine();

    $('#addRestaurantIcon').click(Restaurant.clickAddRestaurantIcon);
    $('#deleteRestaurantButton').click(Restaurant.clickDeleteRestaurantIcon);
    
    populateCountries("country", "state");


    $('input').focus(function () {

        $(this).siblings('label').addClass('active');
    });

    $('input').blur(function () {


        // Restaurant Name
        if ($(this).hasClass('create-name')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your restaurant name').fadeIn().parent('.form-group').addClass('hasError');
                nameError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                nameError = false;
            }
        }

        // Restaurant Description
        if ($(this).hasClass('create-description')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your restaurant description').fadeIn().parent('.form-group').addClass('hasError');
                descriptionError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                descriptionError = false;
            }
        }

       


        // Restaurant Contact
        if ($(this).hasClass('create-addressline1')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your restaurant address').fadeIn().parent('.form-group').addClass('hasError');
                addressLine1Error = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                addressLine1Error = false;
            }
        }

        if ($(this).hasClass('create-city')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type city of the restaurant').fadeIn().parent('.form-group').addClass('hasError');
                cityError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                cityError = false;
            }
        }

        if ($(this).hasClass('create-zipcode')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type zipcode of the restaurant').fadeIn().parent('.form-group').addClass('hasError');
                zipCodeError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                zipCodeError = false;
            }
        }

        if ($(this).hasClass('create-contactName')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type contact persons name').fadeIn().parent('.form-group').addClass('hasError');
                contactNameError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                contactNameError = false;
            }
        }


        // label effect
        if ($(this).val().length > 0) {

            $(this).siblings('label').addClass('active');
        } else {
            $(this).siblings('label').removeClass('active');
        }
    });



    $('select').blur(function () {


        // Restaurant Location - Country
        if ($(this).hasClass('create-country')) {
            if ($(this).val() == -1) {
                $(this).siblings('span.error').text('Please select the country').fadeIn().parent('.form-group').addClass('hasError');
                countryError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                countryError = false;
            }
        }

        // Restaurant Location - State
        if ($(this).hasClass('create-state')) {
            if ($(this).val() == -1) {
                $(this).siblings('span.error').text('Please select the state').fadeIn().parent('.form-group').addClass('hasError');
                stateError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                stateError = false;
            }
        }





    });


    $('form.basic-form').submit(function (event) {

        event.preventDefault();



        if (nameError == true || descriptionError == true || addressLine1Error == true || countryError == true || stateError == true
        || contactNameError == true|| cityError == true || zipCodeError == true) {
            $('.create-name, .create-description, .create-contact, .create-country,.create-state,.create-addressline1,.label-icon,.create-zipcode,.create-city,.create-contactName').blur();
        } else {
            console.log("RestaurantBiz created");
            var RestaurantBiz = Parse.Object.extend("RestaurantBiz");
            var restaurant = new RestaurantBiz();

            var name = $("#name").val();
            var description = $("#description").val();
            var note = $("#note").val();
            var cuisine = $("#cuisine").val();
            var restaurantActive = $("#restaurantActive").is(':checked');
            
            restaurant.set('name', name);
            restaurant.set('description', description);
            restaurant.set('note', note);
            restaurant.set("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
             
            //restaurant.set("owner",);
            

            
            var RestaurantBizContact = Parse.Object.extend("RestaurantBizContact");
            var restaurantBizContact = new RestaurantBizContact();
            var contactName = $("#contactName").val();
            var contactPhone = $("#contactPhone").val();
            var contactEmail = $("#contactEmail").val();

            
            restaurantBizContact.set("name",contactName);
            restaurantBizContact.set("phone",contactPhone);
            restaurantBizContact.set("email",contactEmail);
            // var relation = restaurantBizContact.relation("restaurantBiz")
            // relation.add(restaurant);

            var id = $("#id").val();
            
            if(id){
                restaurant.set('id', id);
            }
            
            var RestaurantBizAddress = Parse.Object.extend("RestaurantBizAddress");
            var restaurantBizAddress = new RestaurantBizAddress();
            
            var country = $("#country").val();
            var state = $("#state").val();
            var city = $("#city").val();
            var zipcode = $("#zipcode").val();
            var addressline1 = $("#addressline1").val();
            var addressline2 = $("#addressline2").val();
            
            restaurantBizAddress.set('country', country);
            restaurantBizAddress.set('state', state);
            restaurantBizAddress.set('zipCode', zipcode);
            restaurantBizAddress.set('city', city);
            restaurantBizAddress.set('addressLine1', addressline1);
            restaurantBizAddress.set('addressLine2', addressline2);

            
            restaurant.set("contact",restaurantBizContact);
            restaurant.set("address",restaurantBizAddress);



            NProgress.start();
            restaurant.save(null).then(
                function (res) {
                    console.log("saved");                    
                    $('.empty').show();
                    $('.form-peice').hide();
                    setTimeout(function(){NProgress.done();},100);
                    Restaurant.loadRestaurants();
                    
                    
                },
                function (error) {
                    console.log("error");                    
                    $('.empty').show();
                    $('.form-peice').hide();
                    Restaurant.loadRestaurants();
                    setTimeout(function(){NProgress.done();},100);

                }
            );
        }




    });


}


Restaurant.loadRestaurants = function () {
    
    var restaurantBiz = Parse.Object.extend("RestaurantBiz");
    var query = new Parse.Query(restaurantBiz);
    query.equalTo("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
    query.include("contact");
    query.include("address");
    NProgress.start();

    
    query.find().then(
        function (results) {
            console.log("retrieved" + results.length);
            var items = '';
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var id = object.id;
                console.log(id);
                var name = object.get("name");
                var description = object.get("description");
                var note = object.get("note");
                
               
                var country = object.get("address").get("country");
                var state = object.get("address").get("state");   
                var zipcode = object.get("address").get("zipCode");  
                var city = object.get("address").get("city");
                var addressline1 = object.get("address").get("addressLine1");
                var addressline2 = object.get("address").get("addressLine2");

                var contactName = object.get("contact").get("name");
                var phone = object.get("contact").get("phone");
                var email = object.get("contact").get("email");

                console.log(name);
                items += '<li class="list-group-item"  data-description="' + description +'"'
                    + ' data-id=' + id + ' data-note="' + note + '"'
                    + ' data-zipcode="' + zipcode +'"'
                    + ' data-country="' + country + '"' + ' data-state="' + state + '"'
                    + ' data-city="' + city + '"' + ' data-contactName="' + contactName + '"'
                    + ' data-phone="' + phone + '"' + ' data-email="' + email + '"'
                    + ' data-addressline1="' + addressline1 +'"' + ' data-addressline2="' + addressline2 + '"'
                    + ' data-name="' + name
                    + '"><input type="checkbox" class="checkboxes">' + name
                    + '</li>';
            }
            $('#restaurantList').empty();
            $('#restaurantList').append(items);
            //enableListItemClick();
            console.log("retrieved" + results.length);
            $('#restaurants .list-group-item').click(Restaurant.selectRestaurant);
            setTimeout(function(){NProgress.done();},100); 

            
        },
        function (error) {
            console.log("error"); 
            setTimeout(function(){NProgress.done();},100);          

        }
    );

}

Restaurant.loadCuisine = function(){
    var cuisine = Parse.Object.extend("Cuisine");
    var query = new Parse.Query(cuisine);
    
    NProgress.start();

    
    query.find().then(
        function (results) {
            console.log("retrieved cuisine" + results.length);
            var items = '';
            items += '<option  value=-1 >Select</option>'; 
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var id = object.id;
                console.log(id);
                var name = object.get("name");
                var display = object.get("display");
                	
                items += '<option  value=' + id + ' data-name=' + name 
                    + '>' + display +  '</option>';  
                    console.log(items);             
               
            }
            $('#cuisine').empty();
            $('#cuisine').append(items);
            
            setTimeout(function(){NProgress.done();},100); 

            
        },
        function (error) {
            console.log("error"); 
            setTimeout(function(){NProgress.done();},100);          

        }
    );
}

Restaurant.clickAddRestaurantIcon = function () {
    $("#name,#description,#note,#zipcode,#city,#addressline1,#addressline2,#contactName,#contactPhone,#contactEmail").siblings('label').removeClass('active');
    $("#name,#description,#note,#zipcode,#city,#addressline1,#addressline2,#contactName,#contactPhone,#contactEmail").val("");
    $("#country").val(-1);
    $("#state").val(-1);
    $("#cuisine").val(-1);    
    $('.empty').hide();
    $('.form-peice').show();
    $('#createRestaurantButton').show();
    $('#editRestaurantButton').hide();
    

}

Restaurant.selectRestaurant = function(e){
    var checkbox = $(this).find('input');
	if (!checkbox.is(':checked')) {

		// check user selected item and apply style
		$(this).addClass('active animated fadeIn').siblings().removeClass(
				'active animated fadeIn');
		$("#restaurantList .checkboxes").prop('checked', false);
		checkbox.prop('checked', true);

		$(".form-peice").show();
		$(".empty").hide();
        
        $('#createRestaurantButton').hide();
        $('#editRestaurantButton').show();

        // Fill item details
         $("#id").val($(this).attr("data-id"));
         $("#name").focus();
         $("#name").val($(this).attr("data-name"));
         $("#description").focus();
         $("#description").val($(this).attr("data-description"));
         $("#note").focus();
         $("#note").val($(this).attr("data-note"));


         
        
         $("#country").focus();
         $("#country").val($(this).attr("data-country"));
         $("#country").change();
         $("#state").focus();
         $("#state").val($(this).attr("data-state"));
         $("#zipcode").focus();
         $("#zipcode").val($(this).attr("data-zipcode"));
         $("#city").focus();
         $("#city").val($(this).attr("data-city"));         
         $("#addressline1").focus();
         $("#addressline1").val($(this).attr("data-addressline1"));
         $("#addressline2").focus();
         $("#addressline2").val($(this).attr("data-addressline2"));
		
         $("#contactName").focus();
         $("#contactName").val($(this).attr("data-contactName"));
         $("#contactPhone").focus();
         $("#contactPhone").val($(this).attr("data-phone"));

         $("#contactEmail").focus();
         $("#contactEmail").val($(this).attr("data-email"));
		
		

		
		//Customers.getCustomerBalance();

		

	} else if (checkbox.is(':checked')) {
		$(this).removeClass('active animated fadeIn');
		checkbox.prop('checked', false);
	}
}

Restaurant.clickDeleteRestaurantIcon = function(){
    var selectedId = Restaurant.getSelectedItem();
    console.log(selectedId);

	if (selectedId != null) {
		Restaurant.deleteSelectedItem();
	} else {
		//sweetAlert("", "Select item to delete", "error");
	}
}
Restaurant.deleteSelectedItem = function(){
    var Restaurant1 = Parse.Object.extend("Restaurant");
    var restaurant = new Restaurant1();
    restaurant.set('id', Restaurant.getSelectedItem());
    restaurant.destroy(null).then(
        function (res) {
            console.log("saved");                    
            $('.empty').show();
            $('.form-peice').hide();
            setTimeout(function(){NProgress.done();},100);
            Restaurant.loadRestaurants();
            
            
        },
        function (error) {
            console.log("error");                    
            $('.empty').show();
            $('.form-peice').hide();
            Restaurant.loadRestaurants();
            setTimeout(function(){NProgress.done();},100);

        }
    );
}

Restaurant.getSelectedItem = function() {
	var restaurantId = null;
	$('#restaurantList .list-group-item').each(function() {
		var checkbox = $(this).find('input');
		var checked = checkbox.is(':checked');
		if (checked) {
			restaurantId = checkbox.parent().attr("data-id");
		}
	});
	return restaurantId;
}