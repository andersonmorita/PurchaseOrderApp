/*sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	*/
/* global Msal */
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/model/json/JSONModel"],
	function (Controller, MessageToast, JSONModel) {
		
	return Controller.extend("com.sap.teched18.msgraph.PurchaseOrderApp.controller.MainView", {
/*		onInit: function () {

		}*/

	
config: {
	msalConfig: {
		auth: {
			clientId: "97ff99fd-b75a-41f2-8983-cd5150d98ce7"
		},
		cache: {
			cacheLocation: 'localStorage',
			storeAuthStateInCookie: true
		}
	},
	graphBaseEndpoint: "https://graph.microsoft.com/v1.0/",
	userInfoSuffix: "me/",
	queryMessagesSuffix: "me/messages?$search=\"$1\"&$top=150",
	scopeConfig: {
		scopes: ['User.Read', 'Mail.Read']
	}
},

	onInit: function () {
		this.oMsalClient = new Msal.UserAgentApplication(this.config.msalConfig);
		//check if the user is already signed in
		if (!this.oMsalClient.getAccount()) {
			this.oMsalClient.loginPopup(this.config.scopeConfig).then(this.fetchUserInfo.bind(this));
		} else {
			this.fetchUserInfo();
		}
	},

// INSERT CODE IN SUB-STEP 3 HERE		
// INSERT IN STEP 2 OF THE NEXT TUTORIAL
onClickPO: function (oEvent) {
  var oApp = this.getView().getContent()[0].getApp();
  var sBindingPath = oEvent.getSource().getBindingContext().getPath();
  var oDetailsPage = oApp.getPages()[1].bindElement(sBindingPath);
  oApp.to(oDetailsPage.getId());
},
// INSERT CODE IN SUB-STEP 6.2 HERE		
onNavButtonPress: function (oEvent) {
  var oApp = this.getView().getContent()[0].getApp();
  var oStartPage = oApp.getPages()[0];
  oApp.back(oStartPage.getId());
},
// INSERT IN STEP 5 OF THE NEXT TUTORIAL
//************* MSAL functions *****************//
onLogout: function (oEvent) {
  var oSessionModel = oEvent.getSource().getModel('session');
  var bIsLoggedIn = oSessionModel.getProperty('/userPrincipalName');
  if (bIsLoggedIn) {
    this.oMsalClient.logout();
    return;
  }
  this.fetchUserInfo();
},
// INSERT CODE IN SUB-STEP 2 HERE
fetchUserInfo: function () {
  this.callGraphApi(this.config.graphBaseEndpoint + this.config.userInfoSuffix, function (response) {
    this.getView().getModel('session').setData(response);
  }.bind(this));
},
// INSERT CODE IN SUB-STEP 3 HERE
callGraphApi: function (sEndpoint, fnCb) {
  this.oMsalClient.acquireTokenSilent(this.config.scopeConfig)
    .then(function (token) {
      $.ajax({
          url: sEndpoint,
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token.accessToken);
          }
        })
        .then(fnCb)
        .fail(function (error) {
          MessageToast.show("Error, please check the log for details");
          $.sap.log.error(JSON.stringify(error.responseJSON.error));
        });
    }.bind(this));
},
// INSERT CODE IN STEP 9 HERE
onPressLink: function (oEvent) {
	var sLinkText = oEvent.getSource().getText();
	var oApp = this.getView().getContent()[0].getApp();
	this.callGraphApi(this.config.graphBaseEndpoint + this.config.queryMessagesSuffix.replace("$1", sLinkText), function (results) {
		results.value = results.value.map(function (o) {
			o.bodyPreview = o.bodyPreview.replace(sLinkText, '<strong>' + sLinkText + '</strong>');
			return o;
		});
		var oResultsPage = oApp.getPages()[2].setModel(new JSONModel(results), 'msData');
		oApp.to(oResultsPage.getId());
	});
},
onOpenEmail: function (oEvent) {
  var sEmail = oEvent.getSource().getBindingContext('msData').getProperty('webLink');
  window.open(sEmail, '_blank');
},
// INSERT CODE IN STEP 11 HERE
	});
});