using System;
using MongoDB.Bson;

namespace Core.Entities {

	public sealed class User {
		public string Username { get; set; }
		public string Password { get; set; }

		public string Title { get; set; }

		public string FirstName { get; set; }
		public string MiddleName { get; set; }
		public string LastName { get; set; }
		
		public string Email { get; set; }

		public BsonArray Modules = new BsonArray();
		public string Icon { get; set; }

		public bool Active { get; set; }
		public DateTime? LastLogin { get; set; }
	}

}