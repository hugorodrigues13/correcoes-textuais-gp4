<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />

    <!-- Latest compiled and minified CSS -->
    <link
            rel="stylesheet"
            href="%PUBLIC_URL%/bootstrap.min.css"
    />
    <!--href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"-->

    <!-- Optional theme -->
    <link
            rel="stylesheet"
            href="%PUBLIC_URL%/bootstrap-theme.min.css"
    />
    <!--href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"-->

    <!-- Latest compiled and minified CSS -->
    %{--<link--}%
            %{--rel="stylesheet"--}%
            %{--href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"--}%
    %{--/>--}%

    %{--<!-- Optional theme -->--}%
    %{--<link--}%
            %{--rel="stylesheet"--}%
            %{--href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"--}%
    %{--/>--}%

    <!--
      Notice the use of %PUBLIC_URL% in the tag above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favico.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>GP4.0</title>
    <script type="text/javascript">
        // Single Page Apps for GitHub Pages
        // https://github.com/rafrex/spa-github-pages
        // Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
        // ----------------------------------------------------------------------
        // This script takes the current url and converts the path and query
        // string into just a query string, and then redirects the browser
        // to the new url with only a query string and hash fragment,
        // e.g. http://www.foo.tld/one/two?a=b&c=d#qwe, becomes
        // http://www.foo.tld/?p=/one/two&q=a=b~and~c=d#qwe
        // Note: this 404.html file must be at least 512 bytes for it to work
        // with Internet Explorer (it is currently > 512 bytes)
        // If you're creating a Project Pages site and NOT using a custom domain,
        // then set segmentCount to 1 (enterprise users may need to set it to > 1).
        // This way the code will only replace the route part of the path, and not
        // the real directory in which the app resides, for example:
        // https://username.github.io/repo-name/one/two?a=b&c=d#qwe becomes
        // https://username.github.io/repo-name/?p=/one/two&q=a=b~and~c=d#qwe
        // Otherwise, leave segmentCount as 0.
        var segmentCount = 1;
        var l = window.location;
        l.replace(
            l.protocol +
            "//" +
            l.hostname +
            (l.port ? ":" + l.port : "") +
            l.pathname
                .split("/")
                .slice(0, 1 + segmentCount)
                .join("/") +
            "/?p=/" +
            l.pathname
                .slice(1)
                .split("/")
                .slice(segmentCount)
                .join("/")
                .replace(/&/g, "~and~") +
            (l.search ? "&q=" + l.search.slice(1).replace(/&/g, "~and~") : "") +
            l.hash
        );
    </script>
</head>
<body></body>
</html>
