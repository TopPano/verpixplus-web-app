// TODO: Fit format of google ad
export default function genAdHTML(mediaId, width, height, sdk) {
  const dataWidth = width ? `data-width="${width}"` : '';
  const dataHeight = height ? `data-height="${height}"` : '';
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
</head>
  <div class="verpix-livephoto" data-id="${mediaId}" ${dataWidth} ${dataHeight}></div>
  ${sdk}
<body>
</body>
</html>
`;
}
