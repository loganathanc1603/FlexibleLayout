sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/message/Message",
	"sap/ui/Device"
], function(Controller, History, Message, Device) {
	"use strict";

	return Controller.extend("com.sap.fcl.EmployeeManagement.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},

		setMessageManager: function(mParam) {
			var oMessage = new Message({
				message: mParam.messageText,
				type: mParam.messageType,
				target: "/Dummy",
				processor: this.getView().getModel()
			});
			sap.ui.getCore().getMessageManager().addMessages(oMessage);
		},

		onClearPress: function() {
			// does not remove the manually set ValueStateText we set in onValueStatePress():
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		getFragment: function(sFrgNam, obj) {
			var oDialog = obj[sFrgNam];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sFrgNam, this);
				obj[sFrgNam] = oDialog;
				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},

		onMessagePopoverPress: function(oEvent) {
			var oD = this.getFragment("com.sap.fcl.EmployeeManagement.fragments.MessagePopover", this._mDialogs);
			this.getView().addDependent(oD);
			oD.openBy(oEvent.getSource());
		}

	});

});