// TODO: Fit format of google ad
export default function genAdHTML(clickTag, usage, sdk) {
return `<!doctype html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!--> <html lang="en"> <!--<![endif]-->
<html>
<head>
  <meta charset="utf8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title></title>
  <meta name="title" content="">
  <meta name="description" content="">
  <script type="text/javascript">
    var clickTag = "${clickTag}";
  </script>
</head>
<body style="margin: 0;">
  <a href="javascript:window.open(window.clickTag)" style="display: inline-block">
    ${usage}
  </a>
  ${sdk}
</body>
</html>
`;
}
