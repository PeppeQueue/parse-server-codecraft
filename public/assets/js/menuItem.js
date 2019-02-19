function MenuItem() {


}

MenuItem.restaurant;
MenuItem.menu;
MenuItem.menuItems = [];

MenuItem.init = function (restaurant, menu) {
    MenuItem.restaurant = restaurant;
    MenuItem.menu = menu;
    MenuItem.menuItems = [];

    $("#menuItemsRestaurant").html(restaurant.get("name"));
    $("#menuItemsRestaurantMenu").html(menu.get("name"));

    $("#menuView").hide();
    $("#menuItemView").show();

    $("#addMenuItemIcon").unbind('click');
    $('#addMenuItemIcon').click(MenuItem.clickAddMenuItemButton);
    MenuItem.registerInputEvents();

    //menu item group related functions
    $("#addNewMenuItemGroup").unbind('click');
    $('#addNewMenuItemGroup').click(MenuItem.clickAddNewMenuItemGroup);
    MenuItem.registerMenuItemGroupInputEvents();
    $("#createNewMenuItemGroupButton").unbind('click');
    $('#createNewMenuItemGroupButton').click(MenuItem.clickAddNewMenuItemGroupButton);
    MenuItem.loadMenuItemGroups();

    //menu items attributes
    MenuItem.createMenuItemAttributes();

    //menu categories
    MenuItem.loadMenuCategories(1, "RestaurantMenuItemCatStart");
    MenuItem.hideSubMenuCategoriesFromLevel(2);

    //menu item add button click
    $("#createMenuItemButton").unbind('click');
    $('#createMenuItemButton').click(MenuItem.clickCreateMenuItemButton);
    $('#menuItemList').empty();
    $('#fixedMenuItemCategoryDiv').empty();
    MenuItem.loadMenuItems(menu);

    $(".menuItemBackButton").unbind('click');
    $('.menuItemBackButton').click(MenuItem.goBackToMenuView);
    $("#menuItemViewBackButton").unbind('click');
    $('#menuItemViewBackButton').click(MenuItem.goBackToMenuItemView);
    

}

MenuItem.goBackToMenuItemView = function(event){
    event.preventDefault();
    $("#menuItemCreateView").hide();
    $("#menuItemView").show();
}

MenuItem.goBackToMenuView = function(event){
    event.preventDefault();
    $("#menuItemView").hide();
    $("#menuView").show();
}

MenuItem.clickAddMenuItemButton = function (event) {
    event.preventDefault();
    $("#menuItemView").hide();
    $("#menuItemCreateView").show();
}

MenuItem.registerInputEvents = function () {
    $('input').blur(function () {

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

MenuItem.registerMenuItemGroupInputEvents = function () {
    $('#newMenuItemGroupName').blur(function () {
        if ($(this).val().length == '') {
            $(this).siblings('span.error').text('Please type group name').fadeIn().parent('.form-group').addClass('hasError');

        } else {
            $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');

        }
    });
}

MenuItem.clickAddNewMenuItemGroup = function (event) {
    event.preventDefault();
    if ($('#newMenuItemGroupEnterDiv').is(':visible')) {
        $('#newMenuItemGroupEnterDiv').hide();
    } else {
        $('#newMenuItemGroupEnterDiv').show();
    }

}

MenuItem.clickAddNewMenuItemGroupButton = function (event) {

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
                MenuItem.loadMenuItemGroups();
            },
            function (error) {
                console.log("error");
                setTimeout(function () { NProgress.done(); }, 100);

            }
        );
    }
}


MenuItem.loadMenuItemGroups = function () {
    var restaurantMenuItemGroup = Parse.Object.extend("RestaurantMenuItemGroup");
    var query = new Parse.Query(restaurantMenuItemGroup);
    query.descending('code');
    NProgress.start();

    query.find().then(
        function (results) {
            var items = '';
            items = MenuItem.populatePulldownItems(results, "ownGroup");
            var restaurantMenuItemGroupSupplied = Parse.Object.extend("RestaurantMenuItemGroupSupplied");
            var innerquery = new Parse.Query(restaurantMenuItemGroupSupplied);
            innerquery.find().then(
                function (results) {
                    items = items + MenuItem.populatePulldownItems(results, "suppliedGroup");
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

MenuItem.populatePulldownItems = function (results, group) {
    var items = "";
    for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var id = object.id;

        var name = object.get("name");
        var display = object.get("display");

        items += '<option  value=' + id + ' data-name="' + display + '" data-group="' + group
            + '">' + display + '</option>';

    }
    return items;
}

MenuItem.createMenuItemAttributes = function () {

    var restaurantMenuItemFixedCats = Parse.Object.extend("RestaurantMenuItemFixedCats");
    var query = new Parse.Query(restaurantMenuItemFixedCats);
    query.find().then(
        function (results) {

            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var name = object.get("class");
                var menuItemPointerName = object.get("menuItemPointerName");
                var selection = object.get("selection");
                MenuItem.createMenuItemAttribute(name, menuItemPointerName, selection);

            }


        },
        function (error) {
            console.log("Error Loading Fixed Cats");
        }
    );

}



MenuItem.createMenuItemAttribute = function (name, menuItemPointerName, selection) {
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
                    results.splice(i, 1);
                }

            }

            if (selection == "Multi") {
                var html = MenuItem.getFixedMenuItemCatHtmlMultipleSelect(label, menuItemPointerName, results);
                $('#fixedMenuItemCategoryDiv').append(html);
                $('#' + menuItemPointerName + '').multiSelect();
            } else {
                var html = MenuItem.getFixedMenuItemCatHtmlSingleSelect(label, menuItemPointerName, results);
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



MenuItem.getFixedMenuItemCatHtmlSingleSelect = function (label, menuItemPointerName, entries) {

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
        '<select class="form-control" id="' + menuItemPointerName + '" name="' + "fixed-" + menuItemPointerName + '">' +
        MenuItem.populatePulldownItems(entries) +
        '</select>'
    '</div>' +
        '</form>' +
        '</div>' +
        '<div class="col-2 col-sm-4">' +
        '</div>' +

        '</div>' +
        '</div>'
}

MenuItem.getFixedMenuItemCatHtmlMultipleSelect = function (label, menuItemPointerName, entries) {

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
        '<select  id="' + menuItemPointerName + '" name="' + "fixed-" + menuItemPointerName + '" multiple>' +
        MenuItem.populatePulldownItems(entries) +
        '</select>'
    '</div>' +

        '</div>' +
        '<div class="col-2 col-sm-4">' +
        '</div>' +

        '</div>' +
        '</div>'
}

MenuItem.loadMenuCategories = function (index, categoryClassName, selectedItemCats) {

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
                MenuItem.hideSubMenuCategoriesFromLevel(index + 1);
                $('#menuItemCategory' + index).empty();
                $('#menuItemCategory' + index).append(items);
                if (selectedItemCats) {
                    var item = MenuItem.selectDynamicCatByName(selectedItemCats, categoryClassName);
                    $('#menuItemCategory' + index).val(item.value);
                    var nextCategoryName = $("#menuItemCategory" + index + " option:selected").attr("data-nextcatname");
                    MenuItem.selectMenuItemCategory(index + 1, selectedItemCats, nextCategoryName);
                }
                $('#menuItemCategory' + index).change(MenuItem.onChangeCategory);
            }

            setTimeout(function () { NProgress.done(); }, 100);
        },
        function (error) {

        }
    );
}

MenuItem.onChangeCategory = function () {
    var element = $(this).find('option:selected');
    var nextCategoryName = element.attr("data-nextcatname");
    var level = element.attr("data-level");

    if (nextCategoryName != "undefined") {
        MenuItem.loadMenuCategories(parseInt(level) + 1, nextCategoryName);
    }

}

MenuItem.hideSubMenuCategoriesFromLevel = function (index) {
    for (var i = index; i <= 4; i++) {
        $('#menuItemCategoryDiv' + i).hide();
    }

}

MenuItem.selectDynamicCatByName = function (selectedItemCats, itemName) {
    for (var i = 0; i < selectedItemCats.length; i++) {
        var item = selectedItemCats[i];
        if (item.name == itemName) {
            return item;
        }
    }
}

MenuItem.selectMenuItemCategory = function (level, selectedItemCats, itemName) {
    MenuItem.loadMenuCategories(level, itemName, selectedItemCats);
}

MenuItem.clickCreateMenuItemButton = function (event) {
    event.preventDefault();
    var menuItem = {};
    var menuItemName = $('#menuItemName').val();
    var menuItemDes = $('#menuItemDes').val();
    var menuItemNote = $('#menuItemNote').val();
    if (menuItemName == "" || menuItemDes == "" || menuItemNote == "") {
        $('.create-menuItemNote,.create-menuItemName,.create-menuItemDes ').blur();
    } else {

        menuItem.name = menuItemName;
        menuItem.description = menuItemDes;
        menuItem.note = menuItemNote;
        menuItem.active = true;

        var menuItemGroupValue = $('#menuItemGroup').val();
        var menuItemGroupName = $("#menuItemGroup option:selected").attr("data-group");
        var menuItemGroupDisplayName = $("#menuItemGroup option:selected").attr("data-name");
        var group = {};
        group.name = menuItemGroupName;
        group.value = menuItemGroupValue;
        group.display = menuItemGroupDisplayName;

        menuItem.group = group;


        var dynamicCats = [];

        if ($('#menuItemCategoryDiv1').is(':visible')) {
            var menuItemCategory1Value = $('#menuItemCategory1').val();
            var menuItemCategory1Name = $("#menuItemCategory1 option:selected").attr("data-currentcatname");
            var cat = { name: menuItemCategory1Name, value: menuItemCategory1Value };
            dynamicCats.push(cat);

        }
        if ($('#menuItemCategoryDiv2').is(':visible')) {
            var menuItemCategory2Value = $('#menuItemCategory2').val();
            var menuItemCategory2Name = $("#menuItemCategory2 option:selected").attr("data-currentcatname");
            var cat = { name: menuItemCategory2Name, value: menuItemCategory2Value };
            dynamicCats.push(cat);
        }
        if ($('#menuItemCategoryDiv3').is(':visible')) {
            var menuItemCategory3Value = $('#menuItemCategory3').val();
            var menuItemCategory3Name = $("#menuItemCategory3 option:selected").attr("data-currentcatname");
            var cat = { name: menuItemCategory3Name, value: menuItemCategory3Value };
            dynamicCats.push(cat);
        }
        if ($('#menuItemCategoryDiv4').is(':visible')) {
            var menuItemCategory4Value = $('#menuItemCategory4').val();
            var menuItemCategory4Name = $("#menuItemCategory4 option:selected").attr("data-currentcatname");
            var cat = { name: menuItemCategory4Name, value: menuItemCategory4Value };
            dynamicCats.push(cat);
        }
        menuItem.dynamicCats = dynamicCats;


        var attributeList = $('select[name^=fixed-]');
        var fixedCats = [];
        $(attributeList).each(function (index, element) {
            var elementId = element.id;
            var selectedValue = $('#' + elementId).val();
            var fixedCat = { name: elementId, value: selectedValue };
            fixedCats.push(fixedCat);
        });
        menuItem.fixedCats = fixedCats;
        console.log(menuItem);


        var RestaurantMenuItem = Parse.Object.extend("RestaurantMenuItem");
        var restaurantMenuItem = new RestaurantMenuItem();

        restaurantMenuItem.set("name", menuItem.name);
        restaurantMenuItem.set("display", menuItem.name);
        restaurantMenuItem.set("description", menuItem.description);
        restaurantMenuItem.set("note", menuItem.note);
        restaurantMenuItem.set("active", menuItem.active);

        var group = menuItem.group;
        if (group.name == "ownGroup") {
            restaurantMenuItem.set("ownGroup", { "__type": "Pointer", "className": "RestaurantMenuItemGroup", "objectId": group.value });
        }

        if (group.name == "suppliedGroup") {
            restaurantMenuItem.set("suppliedGroup", { "__type": "Pointer", "className": "RestaurantMenuItemGroupSupplied", "objectId": group.value });
        }

        restaurantMenuItem.set("menu", { "__type": "Pointer", "className": "RestaurantMenu", "objectId": MenuItem.menu.id });
        restaurantMenuItem.set("restaurant", { "__type": "Pointer", "className": "RestaurantBiz", "objectId": MenuItem.restaurant.id });
        restaurantMenuItem.set("owner", { "__type": "Pointer", "className": "_User", "objectId": Parse.User.current().id });
        



        NProgress.start();
        restaurantMenuItem.save(null).then(
            function (menuItem) {
                $("#menuItemCreateView").hide();
                $("#menuItemView").show();

                var menuItemFileUpload = $("#menuItemImage")[0];
                if (menuItemFileUpload.files.length > 0) {
                    var file = menuItemFileUpload.files[0];
                    var name = "photo.jpg";
                    var imageFile = new Parse.File(name, file);
                    imageFile.save().then(function () {
                        menuItem.set("image", imageFile);
                        menuItem.save();
                MenuItem.loadMenuItems(MenuItem.menu);
                setTimeout(function () { NProgress.done(); }, 100);
                    }, function (error) {
                        console.log(error);
                        // The file either could not be read, or could not be saved to Parse.
                        MenuItem.loadMenuItems(MenuItem.menu);
                        setTimeout(function () { NProgress.done(); }, 100);
                    });
                }else{
                    MenuItem.loadMenuItems(MenuItem.menu);
                    setTimeout(function () { NProgress.done(); }, 100);
                }
                

                
            },
            function (error) {
                setTimeout(function () { NProgress.done(); }, 100);
            }
        );
       
        //MenuItem.menuItems.push(menuItem);
       // MenuItem.displayMenuItems();
       


        //$('#menuItemList .list-group-item').click(MenuItem.selectMenuItem);
    }

}


MenuItem.loadMenuItems = function (menu) {
    MenuItem.menuItems = [];
    var restaurantMenuItem = Parse.Object.extend("RestaurantMenuItem");
    var query = new Parse.Query(restaurantMenuItem);
    query.equalTo("menu", { "__type": "Pointer", "className": "RestaurantMenu", "objectId": menu.id });
    query.descending("createdAt");
    query.include("suppliedGroup");
    query.include("ownGroup");
    NProgress.start();


    query.find().then(
        function (results) {
            var items = '';
            for (var i = 0; i < results.length; i++) {
                var menuItem = {};
                var object = results[i];

                menuItem.id = object.id;
                menuItem.name = object.get("name");
                menuItem.description = object.get("description");
                menuItem.note = object.get("note");

                menuItem.active = object.get("active");
                if(object.get("image") !== undefined){
                    menuItem.image = object.get("image").url();
                    console.log(object.get("image").url());
                }
                
                console.log(object.get("suppliedGroup"));
                console.log(object.get("ownGroup"));
                if (object.get("suppliedGroup")) {
                    var group = {};
                    group.name = "suppliedGroup";
                    group.value = object.get("suppliedGroup").id;
                    group.display = object.get("suppliedGroup").get("display");
                    menuItem.group = group;
                }

                if (object.get("ownGroup") != null) {
                    var group = {};
                    group.name = "ownGroup";
                    group.value = object.get("ownGroup").id;
                    group.display = object.get("ownGroup").get("display");
                    menuItem.group = group;
                }
                console.log(menuItem);
                MenuItem.menuItems.push(menuItem);


            }
            console.log(MenuItem.menuItems);
            MenuItem.displayMenuItems();

            setTimeout(function () { NProgress.done(); }, 100);


        },
        function (error) {
            console.log("error");
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );





}

MenuItem.displayMenuItems = function () {

    var items = '';

    const grouped = Util.groupBy(MenuItem.menuItems, item => item.group.display);

    var mapIter = grouped.keys();

    while (true) {
        let result = mapIter.next();
        if (result.done) {
            break;
        } else {
            var key = result.value;
            var menuItems = grouped.get(key);
            items += '<br/><div class="menuName">' + key + '</div>';
            for (var i = 0; i < menuItems.length; i++) {
                var object = menuItems[i];
                var id = object.id;
                var name = object.name;
                var description = object.description;
                var note = object.note;
                var imgUrl  = object.image;
                if(imgUrl == undefined){
                    imgUrl = localStorage.getItem("defaultMenuItemImageUrl");
                }

                var checked = "";
                if(object.active == true){
                    checked ="checked";
                }

                items += '<li class="list-group-item"'
                    + '"> <label class="switch pull-right"><input type="checkbox" class="menuitem-active" data-id=' + id + ' ' + checked + '>  <span class="slider round"></span> </label>'
                    +'<div class="switch pull-left"><img src="' + imgUrl + '" width="50px" height="50px"+/></div>'
                    + '<div class="menuName">' + name + '</div>'
                    + '<div>' + note + '</div>'

                    + '<div> <p>' + " " + '</p></div>'

                    + '<div class="action-items-menuitem">'
                    + '</a><a href="" rel="tooltip" title="Edit" data-id=' + id + '>'
                    + '<i class="fas fa-edit fa-lg" ></i>'
                    + '</a> <a href=""  rel="tooltip" title="Delete" data-id=' + id + '>'
                    + '<i class="fa fa-trash fa-lg" ></i></a>'
                    + '</div>'
                    + '</li>';
            }
            $('#menuItemList').empty();
            $('#menuItemList').append(items);
            $('.menuitem-active').change(MenuItem.onChangeCheckBox); 
            $('#menuitems .action-items-menuitem a').click(MenuItem.selectOption);
        }

    }
}

MenuItem.selectOption = function(event){    
    event.preventDefault();

    var title = $(this).attr('title');
    var id = $(this).attr('data-id');
    console.log(title);
    console.log(id);
    if (title == "Edit") {
        //MenuItem.selectMenuItem(id);
    }
    if(title == "Delete"){
        swal({
            title: "Are you sure?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                MenuItem.deleteSelectedItem(id);
            } else {
              
            }
          });
        
    }
}

MenuItem.deleteSelectedItem = function(id){
    var RestaurantMenuItem = Parse.Object.extend("RestaurantMenuItem");
    var restaurantMenuItem = new RestaurantMenuItem();
    restaurantMenuItem.set('id', id);
    restaurantMenuItem.destroy(null).then(
        function (res) {
            console.log("saved");        
            
            MenuItem.loadMenuItems(MenuItem.menu);
            setTimeout(function () { NProgress.done(); }, 100);


        },
        function (error) {
            console.log("error");           
            MenuItem.loadMenuItems(MenuItem.menu);
            setTimeout(function () { NProgress.done(); }, 100);

        }
    );
}

MenuItem.onChangeCheckBox = function(){
    var id = $(this).attr("data-id");
    if (!$(this).is(':checked')) {
        MenuItem.updateMenuItemState(id, false);
    }else{
        MenuItem.updateMenuItemState(id, true);
    }
}

MenuItem.updateMenuItemState = function(menuItemId, active){
    var RestaurantMenuItem = Parse.Object.extend("RestaurantMenuItem");
    var restaurantMenuItem = new RestaurantMenuItem();
    restaurantMenuItem.id = menuItemId;
    restaurantMenuItem.set("active",active);
    restaurantMenuItem.save(null);
}