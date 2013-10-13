<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="main.aspx.cs" Inherits="Web.Screens.User.Login.templates.main.code_behind" %>

<div id="login" style="display: none">
	<img class="app-logo" src="resources/img/app-logo-01.png" />

	<form action="#" method="post">
		<fieldset>
			<div class="field clearfix">
				<div class="input">
					<input type="text" id="username" name="username" title="Username" autocomplete="off" tabindex="1" placeholder="Username">
				</div>
			</div>

			<div class="field clearfix">
				<div class="input">
					<input type="password" id="password" name="password" title="Password" data-encrypt="SHA256" tabindex="2" placeholder="Password">
				</div>
			</div>
			
			<div id="action-buttons">
				<%= btn_login %>
				<span class="request-status">Validating credentials. . .</span>
			</div>			
		</fieldset>
	</form>
    
	<div id="alerts"></div>
</div>