using System;
using NODUS;
using NODUS.OptionLists;
using Core.User.Login;
namespace Web.Screens.User.Login.templates.main {

	public partial class code_behind : System.Web.UI.Page {
		protected internal ActionButton btn_login;
		
		protected void Page_Load( object sender, EventArgs e ) {
			btn_login = new ActionButton<AuthenticateUser> {
				Type = ButtonType.Submit,
				Caption = "Login", // override the AuthenticateUser.Caption
				ClassNames = "btn-primary btn-large btn-login",
				Display = ButtonDisplay.CaptionOnly,
				HtmlAttributes = "tabindex='3'"
			};
		}
	}

}