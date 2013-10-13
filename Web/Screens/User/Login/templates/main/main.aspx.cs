using System;
using Cerberus.User.Login.actions;
using NODUS;
using NODUS.OptionLists;

namespace Web.Screens.User.Login.templates.main {

	public partial class code_behind : System.Web.UI.Page {
		protected internal ActionButton btn_login;
		
		protected void Page_Load( object sender, EventArgs e ) {
			btn_login = new ActionButton<authenticate_user> {
				Type = ButtonType.Submit,
				
				ClassNames = "btn-primary btn-large btn-login",
				Display = ButtonDisplay.CaptionOnly,
				HtmlAttributes = "tabindex='3'"
			};
		}
	}

}