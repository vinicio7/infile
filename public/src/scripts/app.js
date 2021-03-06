;(function() {
	"use strict";

	angular.module("app", [
		/* Angular modules */
		"ngRoute",
		"ngAnimate",
		"ngSanitize",
		"ngAria",
		"ngMaterial",

		/* 3rd party modules */
		"oc.lazyLoad",
		"ui.bootstrap",
		"angular-loading-bar",
		"FBAngular",
	
		/* custom modules */
		"app.ctrls",
		"app.directives",
		"app.ui.ctrls",
		"app.ui.directives",
		"app.form.ctrls",
		"app.table.ctrls",
		"app.email.ctrls",
		"app.todo"
		
	])


	// disable spinner in loading-bar
	.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
	    cfpLoadingBarProvider.includeSpinner = false;
	     cfpLoadingBarProvider.latencyThreshold = 500;
	}])

	// lazy loading scripts refernces of angular modules only
	.config(["$ocLazyLoadProvider", function($oc) {
		$oc.config({
			debug: true,
			event: false,
			modules: [{
				name: "angularBootstrapNavTree",
				files: ["scripts/lazyload/abn_tree_directive.js", "styles/lazyload/abn_tree.css"]
			},
			{
				name: "ui.calendar",
				serie: true,	// load files in series
				files: [
					"scripts/lazyload/moment.min.js", 
					"scripts/lazyload/fullcalendar.min.js",  
					"styles/lazyload/fullcalendar.css",  
					"scripts/lazyload/calendar.js"
				]
			},
			{
				name: "ui.select",
				files: ["scripts/lazyload/select.min.js", "styles/lazyload/select.css"]
			},
			{
				name: "ngTagsInput",
				files: ["scripts/lazyload/ng-tags-input.min.js", "styles/lazyload/ng-tags-input.css"]
			},
			{
				name: "colorpicker.module",
				files: ["scripts/lazyload/bootstrap-colorpicker-module.min.js", "styles/lazyload/colorpicker.css"]
			},
			{
				name: "ui.slider",
				serie: true,
				files: ["scripts/lazyload/bootstrap-slider.min.js", "scripts/lazyload/directives/bootstrap-slider.directive.js", "styles/lazyload/bootstrap-slider.css"]
			},
			{
				name: "textAngular",
				serie: true,
				files: ["scripts/lazyload/textAngular-rangy.min.js",  "scripts/lazyload/textAngular.min.js", "scripts/lazyload/textAngularSetup.js", "styles/lazyload/textAngular.css"]
			},
			{
				name: "flow",
				files: ["scripts/lazyload/ng-flow-standalone.min.js"]
			},
			{
				name: "ngImgCrop",
				files: ["scripts/lazyload/ng-img-crop.js", "styles/lazyload/ng-img-crop.css"]
			},
			{
				name: "ngMask",
				files: ["scripts/lazyload/ngMask.min.js"]
			},
			{
				name: "angular-c3",
				files: ["scripts/lazyload/directives/c3.directive.js"]
			},
			{
				name: "easypiechart",
				files: ["scripts/lazyload/angular.easypiechart.min.js"]
			},
			{
				name: "ngMap",
				files: ["scripts/lazyload/ng-map.min.js"]
			},
			{
                    name: "app.service.usuarios",
                    files: ["scripts/lazyload/services/usuarios.js"]
			},
			]
		})
	}])
	

	// jquery/javascript and css for plugins via lazy load
	.constant("JQ_LOAD", {
		fullcalendar: [],
		moment: ["scripts/lazyload/moment.min.js"],
		sparkline: ["scripts/lazyload/jquery.sparkline.min.js"],
		c3: ["scripts/lazyload/d3.min.js", "scripts/lazyload/c3.min.js", "styles/lazyload/c3.css"],
		gmaps: ["https://maps.google.com/maps/api/js"]
	})

	// route provider
	.config(["$routeProvider", "$locationProvider", "JQ_LOAD", function($routeProvider, $locationProvider, jqload) {

		

		var routes = [
			"ui/buttons", "ui/typography", "ui/grids", "ui/panels", "ui/tabs", "ui/modals", "ui/progress-bars", "ui/extras",
			"icons/font-awesome", "icons/ionicons", 
			"forms/wizard", 
			"tables/tables",
			"pages/signin", "pages/signup", "pages/404", "pages/forget-pass", "pages/lock-screen", "pages/invoice", "pages/search", "pages/timeline"
		];

		function setRoutes(route) {
			var url = '/' + route,
				config = {
					templateUrl: "views/" + route + ".html"
				};

			$routeProvider.when(url, config);
			return $routeProvider;
		}

		routes.forEach(function(route) {
			setRoutes(route);
		});

		$routeProvider
			.when("/", {redirectTo: "/dashboard"})
			.when("/404", {templateUrl: "views/pages/404.html"})
			.otherwise({redirectTo: "/404"});

		$routeProvider.when("/usuarios", {
			templateUrl: "views/usuarios/usuarios.html",
			controller: "UsuariosController",
			resolve: {
				 deps: ["$ocLazyLoad", function(a) {
                    return a.load({
						name: 'app.usuarios',
						files: ['scripts/lazyload/controllers/usuarios.js']
                    })
                }]
			}
		});

	}])


}())


