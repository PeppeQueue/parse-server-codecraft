function Menu() {

}
Menu.menuItems = [];

Menu.init = function () {
    Parse.initialize(Config.PARSE_APP_ID);
    Parse.serverURL = Config.PARSE_SERVER_URL;
    var currentUser = Parse.User.current();
   
    Menu.registerInputEvents();


    $('#newMenuItemGroupEnterDiv').hide();


    //$('#fixedMenuItemCategoryDiv').html(Menu.getFixedMenuItemCatHtml());


    //menu item group related functions
    $('#addNewMenuItemGroup').click(Menu.clickAddNewMenuItemGroup);
    Menu.registerMenuItemGroupInputEvents();
    $('#createNewMenuItemGroupButton').click(Menu.clickAddNewMenuItemGroupButton);
    Menu.loadMenuItemGroups();


    //menu items attributes
    Menu.createMenuItemAttributes();


    //menu categories
    Menu.loadMenuCategories(1, "RestaurantMenuItemCatStart");
    Menu.hideSubMenuCategoriesFromLevel(2);

    //menu item add button click
    $('#createMenuItemButton').click(Menu.clickCreateMenuItemButton);
    Menu.loadMenuItems();

    
}

Menu.loadMenuItems = function(){
    var items = '';
    for (var i = 0; i < Menu.menuItems.length; i++) {
        var object = Menu.menuItems[i];
        var id = object.id;        
        var name = object.name;
        var description = object.description; 
        var note = object.note;         

        items += '<li class="list-group-item"  data-description="' + description +'"'
            + ' data-id=' + id + ' data-note="' + note + '"'
            + ' data-name="' + name                    
            + '"><input type="checkbox" class="checkboxes">' + name
            + '</li>';
    }
    $('#menuItemList').empty();
    $('#menuItemList').append(items);
    
}

Menu.clickCreateMenuItemButton = function(event){
    event.preventDefault();
    var menuItem={};
    var menuItemName = $('#menuItemName').val();
    var menuItemDes = $('#menuItemDes').val();
    var menuItemNote = $('#menuItemNote').val();
    if(menuItemName=="" || menuItemDes=="" || menuItemNote==""){
        $('.create-menuItemNote,.create-menuItemName,.create-menuItemDes ').blur();
    }else{
        menuItem.id = Math.floor(Math.random() * 100);
        menuItem.name = menuItemName;
        menuItem.description = menuItemDes;
        menuItem.note = menuItemNote;

        var menuItemGroupValue = $('#menuItemGroup').val();
        var menuItemGroupName = $("#menuItemGroup option:selected").attr("data-group");
        var group = {};
        group.name = menuItemGroupName;
        group.value = menuItemGroupValue;

        menuItem.group = group;
        
        

        var dynamicCats = [];
        
        if($('#menuItemCategoryDiv1').is(':visible')){
            var menuItemCategory1Value = $('#menuItemCategory1').val();
            var menuItemCategory1Name = $("#menuItemCategory1 option:selected").attr("data-currentcatname");
            var cat = {name : menuItemCategory1Name,value:menuItemCategory1Value};
            dynamicCats.push(cat);

        }
        if($('#menuItemCategoryDiv2').is(':visible')){
            var menuItemCategory2Value = $('#menuItemCategory2').val();
            var menuItemCategory2Name = $("#menuItemCategory2 option:selected").attr("data-currentcatname");
            var cat = {name : menuItemCategory2Name,value:menuItemCategory2Value};
            dynamicCats.push(cat);
        }
        if($('#menuItemCategoryDiv3').is(':visible')){
            var menuItemCategory3Value = $('#menuItemCategory3').val();
            var menuItemCategory3Name = $("#menuItemCategory3 option:selected").attr("data-currentcatname");
            var cat = {name : menuItemCategory3Name,value:menuItemCategory3Value};
            dynamicCats.push(cat);
        }
        if($('#menuItemCategoryDiv4').is(':visible')){
            var menuItemCategory4Value = $('#menuItemCategory4').val();
            var menuItemCategory4Name = $("#menuItemCategory4 option:selected").attr("data-currentcatname");
            var cat = {name : menuItemCategory4Name,value:menuItemCategory4Value};
            dynamicCats.push(cat);
        }
        menuItem.dynamicCats = dynamicCats;
        

        var attributeList = $('select[name^=fixed-]');
        var fixedCats = [];
        $(attributeList).each(function(index,element){
            var elementId = element.id;
            var selectedValue = $('#'+elementId).val();   
            var fixedCat = {name : elementId,value:selectedValue}; 
            fixedCats.push(fixedCat) ;      
        });
        menuItem.fixedCats = fixedCats;
        console.log(menuItem);

        Menu.menuItems.push(menuItem);
        Menu.loadMenuItems();
        $('#menuItemList .list-group-item').click(Menu.selectMenuItem);
    }

}

Menu.selectMenuItem = function(){
    var checkbox = $(this).find('input');
	if (!checkbox.is(':checked')) {

		// check user selected item and apply style
		$(this).addClass('active animated fadeIn').siblings().removeClass(
				'active animated fadeIn');
		$("#menuItemList .checkboxes").prop('checked', false);
		checkbox.prop('checked', true);
		

	} else if (checkbox.is(':checked')) {
		$(this).removeClass('active animated fadeIn');
		checkbox.prop('checked', false);
	}
}

Menu.hideSubMenuCategoriesFromLevel = function (index) {
    for (var i = index; i <= 4; i++) {
        $('#menuItemCategoryDiv' + i).hide();
    }

}

Menu.showSubMenuCategoryLevel = function (level) {
    $('#menuItemCategoryDiv' + level).show();
}

Menu.loadMenuCategories = function (index, categoryClassName) {
    console.log(index);

    var catClassName = Parse.Object.extend(categoryClassName);
    var query = new Parse.Query(catClassName);
    query.ascending('code');
    NProgress.start();
    query.find().then(
        function (results) {
            var items = '';
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var id = object.id;
                var name = object.get("display");
                var nextCatName = object.get("nextCatName");
                
                items += '<option  value=' + id + ' data-name="' + name + '" data-currentcatname="' + categoryClassName + '" data-level="' + index + '"data-nextcatname=' + nextCatName + '>' + name + '</option>';

            }
            if (results.length > 0) {
                $('#menuItemCategoryDiv' + index).show();
                Menu.hideSubMenuCategoriesFromLevel(index + 1);
                $('#menuItemCategory' + index).empty();
                $('#menuItemCategory' + index).append(items);
                $('#menuItemCategory' + index).change(Menu.onChangeCategory);
            }

            setTimeout(function () { NProgress.done(); }, 100);
        },
        function (error) {

        }
    );
}

Menu.onChangeCategory = function () {
    var element = $(this).find('option:selected');
    var nextCategoryName = element.attr("data-nextcatname");
    var level = element.attr("data-level");

    if (nextCategoryName != "undefined") {
        Menu.loadMenuCategories(parseInt(level) + 1, nextCategoryName);
    }

}




Menu.createMenuItemAttributes = function () {

    var restaurantMenuItemFixedCats = Parse.Object.extend("RestaurantMenuItemFixedCats");
    var query = new Parse.Query(restaurantMenuItemFixedCats);
    query.find().then(
        function (results) {

            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var name = object.get("class");
                var menuItemPointerName = object.get("menuItemPointerName");
                var selection = object.get("selection");
                Menu.createMenuItemAttribute(name, menuItemPointerName, selection);

            }


        },
        function (error) {
            console.log("Error Loading Fixed Cats");
        }
    );

}

Menu.createMenuItemAttribute = function (name, menuItemPointerName, selection) {
    var attribue = Parse.Object.extend(name);
    var query = new Parse.Query(attribue);
    query.ascending('code');
    query.find().then(
        function (results) {
            var label = "";
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var name = object.get("display");
                var code = object.get("code");
                //console.log(code);  
                if (code == 99) { //Move to config
                    label = name;
                    console.log("label : " + label);
                    results.splice(i, 1);
                }

            }

            if (selection == "Multi") {
                var html = Menu.getFixedMenuItemCatHtmlMultipleSelect(label, menuItemPointerName, results);
                $('#fixedMenuItemCategoryDiv').append(html);
                $('#' + menuItemPointerName + '').multiSelect();
                //$('#people').multiSelect();
            } else {
                var html = Menu.getFixedMenuItemCatHtmlSingleSelect(label, menuItemPointerName, results);
                $('#fixedMenuItemCategoryDiv').append(html);
            }
            //console.log(html);
            // return html ;

        },
        function (error) {
            console.log("Error Loading Fixed Cats");
        }
    );
}

Menu.getFixedMenuItemCatHtmlSingleSelect = function (label, menuItemPointerName, entries) {

    return '<div class="col-12 col-sm-12" style="background:#465f75;min-height: 60px;">' +
        '<div class="row">' +
        '<div class="col-6 col-sm-4">' +
        '<form>' +
        '<div class="form-group">' +
        '<label for="name" class="menu-item-lbl">' + label + '</label>' +
        '<span class="error"></span>' +
        '</div>' +
        '</form>' +
        '</div>' +
        '<div class="col-4 col-sm-4">' +
        '<form>' +
        '<div class="form-group">' +
        '<label for="name"></label>' +
        '<select class="form-control" id="' + menuItemPointerName + '" name="' + "fixed-"+menuItemPointerName + '">' +
        Menu.populatePulldownItems(entries) +
        '</select>'
    '</div>' +
        '</form>' +
        '</div>' +
        '<div class="col-2 col-sm-4">' +
        '</div>' +

        '</div>' +
        '</div>'
}

Menu.getFixedMenuItemCatHtmlMultipleSelect = function (label, menuItemPointerName, entries) {

    return '<div class="col-12 col-sm-12" style="background:#465f75;min-height: 60px;">' +
        '<div class="row">' +
        '<div class="col-6 col-sm-4">' +
        '<form>' +
        '<div class="form-group">' +
        '<label for="name" class="menu-item-lbl">' + label + '</label>' +
        '<span class="error"></span>' +
        '</div>' +
        '</form>' +
        '</div>' +
        '<div class="col-4 col-sm-4">' +

        '<div class="form-group">' +
        '<label for="name"></label>' +
        '<select  id="' + menuItemPointerName + '" name="' +"fixed-"+ menuItemPointerName + '" multiple>' +
        Menu.populatePulldownItems(entries) +
        '</select>'
    '</div>' +

        '</div>' +
        '<div class="col-2 col-sm-4">' +
        '</div>' +

        '</div>' +
        '</div>'
}




Menu.loadMenuItemGroups = function () {
    var restaurantMenuItemGroup = Parse.Object.extend("RestaurantMenuItemGroup");
    var query = new Parse.Query(restaurantMenuItemGroup);
    query.descending('code');
    NProgress.start();

    query.find().then(
        function (results) {
            var items = '';
            items = Menu.populatePulldownItems(results,"ownGroup");
            var restaurantMenuItemGroupSupplied = Parse.Object.extend("RestaurantMenuItemGroupSupplied");
            var innerquery = new Parse.Query(restaurantMenuItemGroupSupplied);
            innerquery.find().then(
                function (results) {
                    items = items + Menu.populatePulldownItems(results,"suppliedGroup");
                    $('#menuItemGroup').empty();
                    $('#menuItemGroup').append(items);
                },
                function (error) {
                    console.log("error");
                }
            );

            setTimeout(function () { NProgress.done(); }, 100);
        },
        function (error) {
            console.log("error");
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

Menu.populatePulldownItems = function (results,group) {
    var items = "";
    for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var id = object.id;

        var name = object.get("name");
        var display = object.get("display");

        items += '<option  value=' + id + ' data-name="' + name + '" data-group="' + group
            + '">' + display + '</option>';

    }
    return items;
}

Menu.clickAddNewMenuItemGroup = function (event) {
    event.preventDefault();
    if ($('#newMenuItemGroupEnterDiv').is(':visible')) {
        $('#newMenuItemGroupEnterDiv').hide();
    } else {
        $('#newMenuItemGroupEnterDiv').show();
    }

}

Menu.clickAddNewMenuItemGroupButton = function (event) {

    event.preventDefault();
    var newMenuItemGroupNameText = $("#newMenuItemGroupName").val();
    if (newMenuItemGroupNameText == "") {
        $('#newMenuItemGroupName').blur();
    } else {

        var RestaurantMenuItemGroup = Parse.Object.extend("RestaurantMenuItemGroup");
        var restaurantMenuItemGroup = new RestaurantMenuItemGroup();
        restaurantMenuItemGroup.set("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
        restaurantMenuItemGroup.set("name", newMenuItemGroupNameText);
        restaurantMenuItemGroup.set("description", newMenuItemGroupNameText);
        restaurantMenuItemGroup.set("display", newMenuItemGroupNameText);
        restaurantMenuItemGroup.set("note", newMenuItemGroupNameText);
        NProgress.start();

        restaurantMenuItemGroup.save(null).then(
            function (res) {
                console.log("saved");
                setTimeout(function () { NProgress.done(); }, 100);
                $("#newMenuItemGroupName").val("");
                $('#newMenuItemGroupEnterDiv').hide();
                Menu.loadMenuItemGroups();
            },
            function (error) {
                console.log("error");
                setTimeout(function () { NProgress.done(); }, 100);

            }
        );
    }
}

Menu.registerMenuItemGroupInputEvents = function () {
    $('#newMenuItemGroupName').blur(function () {
        if ($(this).val().length == '') {
            $(this).siblings('span.error').text('Please type group name').fadeIn().parent('.form-group').addClass('hasError');

        } else {
            $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');

        }
    });
}

Menu.registerInputEvents = function () {
    $('input').blur(function () {

        if ($(this).hasClass('create-menuName')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type menu name').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');

            }
        }

        if ($(this).hasClass('create-menuDes')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type description').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');

            }
        }

        if ($(this).hasClass('create-menuNote')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type note').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');

            }
        }

        if ($(this).hasClass('create-menuItemName')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type name').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');

            }
        }

        if ($(this).hasClass('create-menuItemDes')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type des').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');

            }
        }

        if ($(this).hasClass('create-menuItemNote')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type note').fadeIn().parent('.form-group').addClass('hasError');

            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');

            }
        }

    });
}



