using System;
using Login = Core.User.Login.Screen;

public partial class index_aspx : System.Web.UI.Page {
	protected Login login_screen;

	protected void Page_Load( object sender, EventArgs e ) {
		login_screen = Login.Instance;
	}

}