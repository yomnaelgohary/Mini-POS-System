using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MiniPosSystemreports.Startup))]
namespace MiniPosSystemreports
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
