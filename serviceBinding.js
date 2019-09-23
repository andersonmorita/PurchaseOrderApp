function initModel() {
	var sUrl = "/sap/opu/odata/sap/SEPMRA_PO_APV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}