namespace Core.User.Dashboard {

	public class Screen : NODUS.Screen<User.Screen> {
		public Screen() {
			Name = "Dashboard";
			Caption = "Dashboard";
			
			IsProtected = true;
		}
	}

}