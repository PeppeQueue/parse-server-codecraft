$(document).ready(() => {
	$('.navbar-ul li').click(function (event) {
		event.preventDefault();
		$('.navbar-ul li').removeClass('active-list');
		$(this).addClass('active-list');
		$('.main').hide();
		const id = $(this).attr('id');
		const name = $(this).attr('name');
		const container = `${id}-container`;
		$(`#${container}`).show();
		const fn = window[name];
		fn.init();
	});

	$('.fa-search').click(() => {
		$('.search-panel').slideToggle('slow');
	});
});

function enableListItemClick() {
	$('.list-group-item').unbind('click');
	$('.list-group-item').on('click', function () {
		const checkbox = $(this).find('input');
		if (!checkbox.is(':checked')) {
			$(this).addClass('active animated fadeIn');
			$(this).siblings().removeClass('active animated fadeIn');
			checkbox.prop('checked', true);
		} else if (checkbox.is(':checked')) {
			$(this).removeClass('active animated fadeIn');
			$(this).parent().parent().find('.selectall')
				.prop('checked', false);
			$(this).parent().parent().find('.selectall')
				.parent()
				.children('i')
				.text('Select All');
			checkbox.prop('checked', false);
		}
	});


	$('.checkboxes').unbind('click');
	$('.checkboxes').click(function () {
		if (!$(this).is(':checked')) {
			$(this).parent().removeClass('active animated fadeIn');
			$(this).parent().siblings().find('.selectall')
				.prop('checked', false);
			$(this).parent().siblings().find('.selectall')
				.parent()
				.children('i')
				.text('Select All');
		} else if ($(this).is(':checked')) {
			$(this).parent().addClass('active animated fadeIn');
			$(this).siblings().removeClass('active animated fadeIn');
		}
	});
}

function selectMainTabById(id) {
	$('.navbar-ul li').removeClass('active-list');
	const container = `${id}-container`;
	$(`#${container}`).show();
	$(`#${id}`).addClass('active-list');
}
