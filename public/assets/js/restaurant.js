function Restaurant() {
    

}

Restaurant.init = function () {
    var nameError = true,
        descriptionError = true,
        contactError = true,
        countryError = true,
        stateError = true,
        addressLine1Error = true; 


    $('.form-peice').hide();
    Parse.initialize(Config.PARSE_APP_ID);
    Parse.serverURL = Config.PARSE_SERVER_URL;
    var currentUser = Parse.User.current();
    $('#editRestaurantButton').hide();
    Restaurant.loadRestaurants();

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
        if ($(this).hasClass('create-contact')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your restaurant contact number').fadeIn().parent('.form-group').addClass('hasError');
                contactError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                contactError = false;
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
        console.log("clicked");


        if (nameError == true || descriptionError == true || contactError == true || addressLine1Error == true || countryError == true || stateError == true) {
            $('.create-name, .create-description, .create-contact, .create-country,.create-state,.create-addressline1,.label-icon').blur();
        } else {
            var Restaurant1 = Parse.Object.extend("Restaurant");
            var restaurant = new Restaurant1();

            var name = $("#name").val();
            var description = $("#description").val();
            var note = $("#note").val();
            var contact = $("#contact").val();
            var country = $("#country").val();
            var state = $("#state").val();
            var zipcode = $("#zipcode").val();
            var addressline1 = $("#addressline1").val();
            var addressline2 = $("#addressline2").val();
            var id = $("#id").val();
            
            if(id){
                restaurant.set('id', id);
            }
            

            restaurant.set('name', name);
            restaurant.set('description', description);
            restaurant.set('note', note);
            restaurant.set('contact', contact);
            restaurant.set('country', country);
            restaurant.set('state', state);
            restaurant.set('zipcode', zipcode);
            restaurant.set('addressline1', addressline1);
            restaurant.set('addressline2', addressline2);


            restaurant.set("user", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
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
    
    var Restaurant1 = Parse.Object.extend("Restaurant");
    var query = new Parse.Query(Restaurant1);
    query.equalTo("user", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
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
                var contact = object.get("contact");
                var country = object.get("country");
                var state = object.get("state");
                var zipcode = object.get("zipcode");
                var addressline1 = object.get("addressline1");
                var addressline2 = object.get("addressline2");

                console.log(name);
                items += '<li class="list-group-item"  data-description="' + description +'"'
                    + ' data-id=' + id + ' data-note="' + note + '"'
                    + ' data-zipcode="' + zipcode +'"'+ ' data-contact=' + contact
                    + ' data-country="' + country + '"' + ' data-state="' + state + '"'
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

Restaurant.clickAddRestaurantIcon = function () {
    $("#name,#description,#note,#contact,#zipcode,#addressline1,#addressline2").siblings('label').removeClass('active');
    $("#name,#description,#note,#contact,#zipcode,#addressline1,#addressline2").val("");
    $("#country").val(-1);
    $("#state").val(-1)
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
         $("#contact").focus();
         $("#contact").val($(this).attr("data-contact"));
         $("#country").focus();
         $("#country").val($(this).attr("data-country"));
         $("#country").change();
         $("#state").focus();
         $("#state").val($(this).attr("data-state"));
         $("#zipcode").focus();
         $("#zipcode").val($(this).attr("data-zipcode"));
         $("#addressline1").focus();
         $("#addressline1").val($(this).attr("data-addressline1"));
         $("#addressline2").focus();
         $("#addressline2").val($(this).attr("data-addressline2"));
		

		
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