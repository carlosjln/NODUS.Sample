<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="index_aspx" %>

<!DOCTYPE HTML>

<html lang="en">
	<head>
		<meta charset="utf-8">

		<title>NODUS.Sample</title>
		<link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Language" content="en-us" />

		 <!--LIBRARIES-->
		<link href="resources/plugin/hint/hint.min.css" rel="stylesheet" type="text/css" />
		<link href="resources/plugin/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
		
		<!--[if lt IE 9]>
			<script src="~/resources/plugin/html5/flashcanvas.js" type="text/javascript"></script>
		<![endif]-->

		<!--[if IE 7]>
			<link href="~/resources/plugin/font-awesome/css/font-awesome-ie7.min.css" rel="stylesheet" />
		<![endif]-->

		<link href="resources/css/index.css" rel="stylesheet" type="text/css"/>
	</head>

	<body>
		<script src="resources/plugin/jquery/jquery-1.7.1.min.js" type="text/javascript"></script>
		<script src="resources/plugin/handlebars/handlebars.min.js" type="text/javascript"></script>

		<script src="resources/plugin/g.raphael/raphael.min.js" type="text/javascript"></script>
		<script src="resources/plugin/g.raphael/g.raphael.min.js" type="text/javascript"></script>
		<script src="resources/plugin/g.raphael/g.pie-fixed.min.js" type="text/javascript"></script>
		
		<script src="Resources/js/nodus.js" type="text/javascript"></script>
		<script src="Resources/js/nodus.prototypes.min.js" type="text/javascript"></script>
		<script src="resources/js/nodus.application.settings.js" type="text/javascript"></script>
		<script src="resources/js/nodus.application.jquery.js" type="text/javascript"></script>
		
		<script src="Resources/js/SHA256.min.js" type="text/javascript"></script>
		<script src="Resources/js/BASE64.min.js" type="text/javascript"></script>

		<script type="text/javascript">
			NODUS.load_screen( '<%=login_screen.Id%>' );
		</script>
	</body>
</html>