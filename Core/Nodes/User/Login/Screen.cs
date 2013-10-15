using NODUS.Utilities;

namespace Core.User.Login {

	public class Screen : NODUS.Screen<User.Screen> {
		public Screen( ) {
			Name = "Login";
			Caption = "Login";

			IsInternal = true;
		}

		public static Screen Instance {
			get{ return Create.SingletonOf<Screen>(); }
		}
	}

}