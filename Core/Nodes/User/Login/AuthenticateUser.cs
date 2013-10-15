using NODUS;
using NODUS.Serialization;
using NODUS.Utilities;
using SpecExpress;
using SpecExpress.Enums;

namespace Core.User.Login {

	public sealed class AuthenticateUser : ScreenAction<Login.Screen, Credentials>{
		public AuthenticateUser() {
			Caption = "Authenticate";
		}

		public override ActionResult Execute( Credentials credentials ) {
			var action_result = new ActionResult();
			var authenticated_user = credentials.Authenticate();
			
			if( authenticated_user != null ) {
				action_result.Success = true;
				action_result.SetResource( "authenticated_user", "user", authenticated_user );
				
			} else {
				var member_info = credentials.GetType().GetMember( "Username" )[0];
				var validation_result = new ValidationResult( member_info, "Wrong username or password.", ValidationLevelType.Error, credentials );

				action_result.Errors.Add( validation_result );
			}

			return action_result;
		}
		
		public static AuthenticateUser Instance {
			get { return Create.SingletonOf<AuthenticateUser>(); }
		}
	}

}