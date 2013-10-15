using System.Linq;
using MongoDB.Bson;
using NODUS.Interfaces;
using NODUS.Utilities;
using Dummy.Extensions;

namespace Core.User.Login {

	public class Credentials : IActionArgument {
		public string Username { get; set; }
		public string Password { get; set; }

		public Entities.User Authenticate( ) {
			// TODO: implement the authentication mechanism of your choice
			// further examples will include MongoDB, MS SQL and Active Directory authentication

			if( Username.is_empty() || Password.is_empty() ) return null;

			var user = new Entities.User {
				Modules = get_all_avaliable_modules( )
			};

			return user;
		}

		static BsonArray get_all_avaliable_modules() {
			var node_collection = Create.SingletonOf<INodeCollection>();
			var screens = node_collection.GetNodesByPath();

			var bson_array = new BsonArray();
			var ordered_screens = screens.OrderBy( x => x.Value.Index );
		
			foreach( var item in ordered_screens ) {
				var node = item.Value;
				
				if( node.IsInternal ) continue;
			
				bson_array.Add( node.Path );
			}
		
			return bson_array;
		}
	}
}