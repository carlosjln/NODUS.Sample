<%@ Page Language="C#" CodeBehind="main.aspx.cs" Inherits="Web.Screens.User.Dashboard.templates.main.code_behind" %>

<div class="header-bar">
	<div class="container">
		<a href="#" class="brand">
			DxC
		</a>
		
		<ul class="vertical action-bar clearfix">
			<li>
				<a>
					<i class="icon-user"></i> <span class="username" style="display: none">{{title}} {{first_name}}</span>
				</a>				
			</li>
			<li>
				<a>
					<i class="icon-signout"></i>
				</a>				
			</li>
		</ul>
	</div>
</div>

<div class="left-sidebar">
	<ul class="action-bar clearfix">
		<li>
			<a tab-name="padron" class="screen-action" data-screen="<%=padron_screen_id%>">
				<i class="icon-search"></i> Search
			</a>				
		</li>
		<li>
			<a tab-name="miembros" class="screen-action" data-screen="<%=miembro_screen_id%>">
				<i class="icon-book"></i> Books
			</a>				
		</li>
	</ul>
</div>

<div class="main-container">
<%--	<div class="container stretch">--%>
<%--		<div id="tabs-content"></div>--%>
<%--	</div>--%>
</div>