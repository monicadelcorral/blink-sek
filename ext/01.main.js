/**
* loadJSON Ejecuta una llamada asíncrona dependiendo del entorno para obtener el cursoJSON
* @param  	function 	callback 	Función de callback del ajax.
* @return 	boolean		False en caso de que no haya callback.
*/
function loadJSON(callback) {
  if (!callback && typeof callback === 'undefined') {
    return false;
  }

  var isBlink = (window.location.href.indexOf("blinklearning.com") > -1);

  if (isBlink) { //online
    blink.getCourse(window.idcurso).done(callback);
  } else { //local
    var url = window.location.href.replace("curso2", "curso_json");

    if (offline) {
      if (url.indexOf("curso_json") > -1) {
        url = removeParams(['idtema', 'idalumno'], url);
      }
    }

    $.ajax({
      url: url,
      dataType: 'json',
      beforeSend: function (xhr) {
        if (xhr.overrideMimeType) xhr.overrideMimeType("application/json");
      },
      success: callback
    });
  }
}


// ████░██▄░▄██░████░████░████▄░██▄░██░░▄███▄░░██░░
// ██▄░░░▀███▀░░░██░░██▄░░██░██░███▄██░██▀░▀██░██░░
// ██▀░░░▄███▄░░░██░░██▀░░████▀░██▀███░███████░██░░
// ████░██▀░▀██░░██░░████░██░██░██░░██░██░░░██░████


var sekApp = window.sekApp || {};
sekApp.courseData = '';
sekApp.tags = {
  home : 'home',
  unithead : 'unit_head'
}

sekApp.getCourseData = function() {

  loadJSON(function(json) {
    sekApp.courseData = json;
    sekApp.init();
  });

}

sekApp.getTocInfo = function() {

  var data = sekApp.courseData;

  $.each(data.units, function(i, unit) {
    var unitTitle = unit.title,
    unitDescription = unit.description,
    unitId = unit.id,
    unitTags = unit.tags,
    unitTagsArray = (typeof unitTags !== 'undefined') ? unitTags.split(" ") : [];

    var $currentListUnit = $('#list-units li[data-id="'+unitId+'"], .col-main [data-id="'+unitId+'"]');
    var $currentListUnitTOC = $('#list-units li[data-id="'+unitId+'"]');

    if (unitTagsArray.length) {
      if (unitTagsArray.indexOf(sekApp.tags.home) >= 0 ) {
        $currentUnit.addClass('sek-toc-home sek-toc-home-content');
        $currentListUnit.addClass('sek-toc-home');
      }

      if (unitTagsArray.indexOf(sekApp.tags.unithead) >= 0 ) {
        $currentListUnit.addClass('sek-toc-unithead');
        if ($currentListUnit.prevAll('li').first().hasClass('sek-toc-unithead')) {
          $currentListUnit.prevAll('li').first().addClass('sek-toc-unithead_empty');
        }
        if (!$currentListUnit.nextAll('li').length) {
          $currentListUnit.addClass('sek-toc-unithead_empty');
        }

        //Add button
        $currentListUnitTOC.append('<button class="sek-toc-unithead-button"></button>');
      }
    }
  });

  var $current = $('#list-units .litema.active');
  $current.addClass('sek-toc-active').nextUntil('.sek-toc-unithead', 'li').addClass('sek-toc-subunit-active');

  if (!$current.hasClass('sek-toc-unithead')){
    $current
      .addClass('sek-toc-subunit-active')
      .prevUntil('.sek-toc-unithead', 'li')
        .addClass('sek-toc-subunit-active')
        .end()
      .prevAll('.sek-toc-unithead')
        .first()
        .addClass('sek-toc-unithead-ancestor');
  } else {
    $current.addClass('sek-toc-unithead-ancestor');
  }

  if (!$('#list-units li.sek-toc-unithead').length) {
    $('#list-units li').addClass('sek-toc-subunit-active sek-toc-subunit-woparent');
  }

  if ($('#list-units li.sek-toc-unithead').first().prevAll('li:not(.sek-toc-home)').length) {
    $('#list-units li.sek-toc-unithead').first().prevAll('li:not(.sek-toc-home)').addClass('sek-toc-subunit-active sek-toc-subunit-woparent');
  }
}


// INIT

sekApp.init = function() {

  if ($('body').hasClass('edit')) return;

  sekApp.getTocInfo();

}

$(document).ready(function() {

  sekApp.getCourseData();

  $('body').on('click', '#list-units .sek-toc-unithead-button', function(e) {
    var $parent = $(this).parent('.js-indice-tema');
    var $sublevels = $parent.nextUntil('.sek-toc-unithead', 'li');

    if ($parent.hasClass('sek-toc-active') || $parent.hasClass('sek-toc-unithead-ancestor')) {
      $parent.removeClass('sek-toc-active sek-toc-unithead-ancestor');
      $sublevels.removeClass('sek-toc-subunit-active');
    } else {
      $parent.addClass('sek-toc-unithead-ancestor').siblings('li').removeClass('sek-toc-active sek-toc-unithead-ancestor sek-toc-subunit-active sek-toc-unithead-ancestor-active');
      $sublevels.addClass('sek-toc-subunit-active');
    }
    $parent
      .parent()
        .children('li.active:not(.sek-toc-unithead):not(.sek-toc-unithead-ancestor)')
          .prevAll('.sek-toc-unithead', 'li')
          .first()
            .addClass('sek-toc-unithead-ancestor-active');
    e.stopPropagation();
  });

  $('body').on('click', '#list-units .js-indice-tema', function() {
    if ($(this).hasClass('sek-toc-unithead') && !$(this).hasClass('sek-toc-unithead-ancestor')) {
      $(this)
        .siblings('li')
          .removeClass('sek-toc-subunit-active')
            .siblings('li.sek-toc-unithead')
            .removeClass('sek-toc-open sek-toc-unithead-ancestor sek-toc-unithead-ancestor-active');
    } else if ($(this).hasClass('sek-toc-unithead') && $(this).hasClass('sek-toc-unithead-ancestor')) {
      $(this)
        .siblings('li.sek-toc-unithead')
          .removeClass('sek-toc-unithead-ancestor-active');
    } else if (!$(this).hasClass('sek-toc-unithead')) {
      $(this)
        .prevAll('.sek-toc-unithead', 'li')
          .first()
          .addClass('sek-toc-unithead-ancestor-active')
        .end()
      .siblings('li')
        .removeClass('sek-toc-unithead-ancestor-active');
    }
  });

});
