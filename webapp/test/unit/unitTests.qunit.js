/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sap/teched18/msgraph/PurchaseOrderApp/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});