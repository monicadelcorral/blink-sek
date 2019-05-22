(function (blink) {
	'use strict';

	var ColegiosSEKStyle = function () {
			blink.theme.styles.basic.apply(this, arguments);
		},
		page = blink.currentPage;

	ColegiosSEKStyle.prototype = {
		//BK-15873 añadimos el estilo basic como parent para la herencia de los estilos del CKEditor
		parent: blink.theme.styles.basic.prototype,
		bodyClassName: 'content_type_clase_colegios_sek',
		extraPlugins: ['image2'],
		ckEditorStyles: {
			name: 'colegios_sek',
			styles: [

				{ name: 'Título 1', element: 'h4', attributes: { 'class': 'bck-title1'} },
				{ name: 'Énfasis', element: 'span', attributes: { 'class': 'bck-enfasis' } },

				{ name: 'Lista desordenada1', element: 'ul', attributes: { 'class': 'bck-ul1' } },

				{ name: 'Caja 1', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-1' } },

				{ name: 'Celda 1', element: ["th", "td"], attributes: { 'class': 'bck-td1'} }
			]
		},

		init: function () {
			//BK-15873 Utilizamos this.parent declarada al inicio de la clase
			this.parent.init.call(this);
			this.addActivityTitle();
		},

		removeFinalSlide: function () {
			//BK-15873 Utilizamos this.parent declarada al inicio de la clase
			this.parent.removeFinalSlide.call(this, true);
		},

		addActivityTitle: function () {
			if (!blink.courseInfo || !blink.courseInfo.unit) return;
			$('.libro-left').find('.title').html(function () {
				return $(this).html() + ' > ' + blink.courseInfo.unit;
			})
		},

		//BK-15873 Quitamos la funcion getEditorStyles para que herede de parent
	};

	ColegiosSEKStyle.prototype = _.extend({}, new blink.theme.styles.basic(), ColegiosSEKStyle.prototype);

	blink.theme.styles.colegios_sek = ColegiosSEKStyle;

})( blink );

$(document).ready(function () {


    $('.item').find('.header').find('.title')
		.filter(function () {
			return $(this).find('.empty').length;
		}).hideBlink();

    $('.item').find('.header').find('.title')
		.filter(function () {
			return !$(this).find('.empty').length;
		})
		.each(function () {
			var $header = $(this).find('h3');
			$header.length && $header.html($header.html().replace(' ', ''));
		});
});
