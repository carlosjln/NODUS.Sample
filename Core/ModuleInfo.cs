using NODUS.Interfaces;

namespace Core {

	public class ModuleInfo : IModuleInfo {
		 public string ModuleName {
			get { return "Core"; }
		}
		
		/// <summary>
		/// Holds a singleton instance of the current class
		/// </summary>
		static readonly ModuleInfo instance = new ModuleInfo();
		public static ModuleInfo Instance {
			get { return instance; }
		}
	}

}