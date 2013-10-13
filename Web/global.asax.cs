using System;

namespace Web {
	public class global_asax : System.Web.HttpApplication {
		protected void Application_Start( object sender, EventArgs e ) {
			NODUS.Initializer.Run( );
		}

		private void Application_End( object sender, EventArgs e ) {}

		private void Application_Error( object sender, EventArgs e ) {}

		private void Application_BeginRequest( object sender, EventArgs e ) {}

		private void Application_EndRequest( object sender, EventArgs e ) {}

		private void Session_Start( object sender, EventArgs e ) {}

		private void Session_End( object sender, EventArgs e ) {}
	}
}