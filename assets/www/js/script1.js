function isCompatible(ua) {
    if (ua === undefined) {
        ua = navigator.userAgent;
    }
    return !((ua.indexOf('MSIE') !== -1 && parseFloat(ua.split('MSIE')[1]) < 6) || (ua.indexOf('Firefox/') !== -1 && parseFloat(ua.split('Firefox/')[1]) < 3) || ua.match(/BlackBerry[^\/]*\/[1-5]\./) || ua.match(/webOS\/1\.[0-4]/) || ua.match(/PlayStation/i) || ua.match(/SymbianOS|Series60/) || ua.match(/NetFront/) || ua.match(/Opera Mini/) || ua.match(/S40OviBrowser/));
}
var startUp = function () {
    mw.config = new mw.Map(true);
    mw.loader.addSource({
        "local": {
            "loadScript": "http://hurraki.de/w/load.php",
            "apiScript": "http://hurraki.de/w/api.php"
        }
    });
    mw.loader.register([["startup", "1400334867", [], "startup"], ["mediawiki.language.data", "1400328732", ["mediawiki.language.init"]], ["jquery", "1400328732"], ["jquery.byteLength", "1400328732"], ["jquery.checkboxShiftClick", "1400328732"], ["jquery.client", "1400328732"], ["jquery.cookie", "1400328732"], ["jquery.getAttrs", "1400328732"], ["jquery.hidpi", "1400328732"], ["jquery.json", "1400328732"], ["jquery.makeCollapsible", "1400328739"], ["jquery.mw-jump", "1400328732"], [
"jquery.mwExtension", "1400328732"], ["jquery.placeholder", "1400328732"], ["jquery.qunit", "1400328732"], ["jquery.qunit.completenessTest", "1400328732", ["jquery.qunit"]], ["mediawiki", "1400328732"], ["mediawiki.inspect", "1400328732", ["jquery.byteLength", "jquery.json"]], ["mediawiki.hidpi", "1400328732", ["jquery.hidpi"]], ["mediawiki.notify", "1400328732"], ["mediawiki.util", "1400328739", ["jquery.client", "jquery.cookie", "jquery.mwExtension", "mediawiki.notify"]], ["mediawiki.language", "1400328732", ["mediawiki.language.data", "mediawiki.cldr"]], ["mediawiki.cldr", "1400328732", ["mediawiki.libs.pluralruleparser"]], ["mediawiki.libs.pluralruleparser", "1400328732"], ["mediawiki.language.init", "1400328732"], ["mediawiki.jqueryMsg", "1400328732", ["mediawiki.util", "mediawiki.language"]], ["mediawiki.page.ready", "1400328732", ["jquery.checkboxShiftClick", "jquery.makeCollapsible", "jquery.placeholder", "jquery.mw-jump", "mediawiki.util"]], ["mediawiki.page.startup", "1400328732", ["jquery.client", "mediawiki.util"]], [
"mediawiki.special.javaScriptTest", "1400328732", ["jquery.qunit"]], ["mediawiki.tests.qunit.testrunner", "1400328732", ["jquery.getAttrs", "jquery.qunit", "jquery.qunit.completenessTest", "mediawiki.page.startup", "mediawiki.page.ready"]], ["mobile.templates", "1400328732"], ["mobile.loggingSchemas", "1400328732", ["mobile.startup"]], ["mobile.file.scripts", "1400328732", ["mobile.startup"]], ["mobile.styles.page", "1400328732", ["mobile.startup"]], ["mobile.pagelist.styles", "1400328732"], ["mobile.styles", "1400328732"], ["mobile.styles.beta", "1400328732"], ["mobile.head", "1400328732"], ["mobile.startup", "1400328732", ["mobile.head", "mobile.templates"]], ["mobile.editor", "1400328732", ["mobile.stable", "mobile.templates", "jquery.cookie"]], ["mobile.uploads", "1400328732", ["mobile.stable", "mobile.templates"]], ["mobile.beta.common", "1400328732", ["mobile.stable.common", "mobile.loggingSchemas", "mobile.templates"]], ["mobile.keepgoing", "1400328732", ["mobile.beta", "mobile.templates"]], ["mobile.geonotahack", "1400328732", [
"mobile.startup", "mobile.loggingSchemas"]], ["mobile.beta", "1400328732", ["mobile.stable", "mobile.beta.common"]], ["mobile.talk", "1400328732", ["mobile.beta", "mobile.templates"]], ["mobile.alpha", "1400328732", ["mobile.stable", "mobile.beta", "mobile.templates"]], ["mobile.toast.styles", "1400328732"], ["mobile.stable.styles", "1400328732"], ["mobile.stable.common", "1400328732", ["mobile.startup", "mobile.toast.styles", "mediawiki.jqueryMsg", "mediawiki.util", "mobile.templates"]], ["mobile.stable", "1400328732", ["mobile.startup", "mobile.stable.common", "mediawiki.util", "mobile.stable.styles", "mobile.templates", "mediawiki.language"]], ["mobile.site", "1400328732", [], "site"], ["mobile.mobilemenu.styles", "1400328732", ["mobile.styles"], "other"], ["mobile.mobileoptions.styles", "1400328732", [], "other"], ["mobile.mobileoptions.scripts", "1400328732", [], "other"], ["mobile.nearby.styles", "1400328732"], ["mobile.nearby.beta", "1400328732", ["mobile.stable.common", "mobile.nearby", "mobile.beta.common"]], ["mobile.nearby",
"1400328732", ["mobile.stable.common", "mobile.nearby.styles", "jquery.json", "mediawiki.language", "mobile.templates", "mobile.loggingSchemas"]], ["mobile.nearby.scripts", "1400328732", ["mobile.nearby"]], ["mobile.notifications.special.styles", "1400328732", [], "other"], ["mobile.notifications.special.scripts", "1400328732", ["mobile.stable"], "other"], ["mobile.notifications.overlay", "1400328732", ["mobile.stable"]], ["mobile.search.styles", "1400328732", [], "other"], ["mobile.watchlist.scripts", "1400328732", ["mobile.loggingSchemas", "mobile.stable"], "other"], ["mobile.watchlist.styles", "1400328732", [], "other"], ["mobile.userlogin.styles", "1400328732", [], "other"], ["mobile.userprofile.styles", "1400328732", [], "other"], ["mobile.uploads.scripts", "1400328732", ["mobile.stable.styles", "mobile.stable.common", "mobile.uploads", "mobile.templates"]], ["mobile.uploads.styles", "1400328732", [], "other"], ["mobile.mobilediff.styles", "1400328732", [], "other"], ["mobile.mobilediff.scripts", "1400328732", ["mobile.loggingSchemas",
"mobile.stable.common"]], ["mobile.mobilediff.scripts.beta.head", "1400328732", ["mobile.head"]]]);
    mw.config.set({
        "wgLoadScript": "http://hurraki.de/w/load.php",
        "debug": false,
        "skin": "vector",
        "stylepath": "http://hurraki.de/w/skins",
        "wgUrlProtocols": "http\\:\\/\\/|https\\:\\/\\/|ftp\\:\\/\\/|ftps\\:\\/\\/|ssh\\:\\/\\/|sftp\\:\\/\\/|irc\\:\\/\\/|ircs\\:\\/\\/|xmpp\\:|sip\\:|sips\\:|gopher\\:\\/\\/|telnet\\:\\/\\/|nntp\\:\\/\\/|worldwind\\:\\/\\/|mailto\\:|tel\\:|sms\\:|news\\:|svn\\:\\/\\/|git\\:\\/\\/|mms\\:\\/\\/|bitcoin\\:|magnet\\:|urn\\:|geo\\:|\\/\\/",
        "wgArticlePath": "http://hurraki.de/wiki/$1",
        "wgScriptPath": "http://hurraki.de/w",
        "wgScriptExtension": ".php",
        "wgScript": "http://hurraki.de/w/index.php",
        "wgVariantArticlePath": false,
        "wgActionPaths": {},
        "wgServer": "http://hurraki.de",
        "wgUserLanguage": "de",
        "wgContentLanguage": "de",
        "wgVersion": "1.22.5",
        "wgEnableAPI": true,
        "wgEnableWriteAPI": true,
        "wgMainPageTitle": "Hauptseite",
        "wgFormattedNamespaces": {
            "-2": "Medium",
            "-1": "Spezial",
            "0": "",
            "1": "Diskussion",
            "2": "Benutzer",
            "3": "Benutzer Diskussion",
            "4": "Hurraki - Wörterbuch für Leichte Sprache",
            "5": "Hurraki - Wörterbuch für Leichte Sprache Diskussion",
            "6": "Datei",
            "7": "Datei Diskussion",
            "8": "MediaWiki",
            "9": "MediaWiki Diskussion",
            "10": "Vorlage",
            "11": "Vorlage Diskussion",
            "12": "Hilfe",
            "13": "Hilfe Diskussion",
            "14": "Kategorie",
            "15": "Kategorie Diskussion",
            "274": "Widget",
            "275": "Widget Diskussion"
        },
        "wgNamespaceIds": {
            "medium": -2,
            "spezial": -1,
            "": 0,
            "diskussion": 1,
            "benutzer": 2,
            "benutzer_diskussion": 3,
            "hurraki_-_wörterbuch_für_leichte_sprache": 4,
            "hurraki_-_wörterbuch_für_leichte_sprache_diskussion": 5,
            "datei": 6,
            "datei_diskussion": 7,
            "mediawiki": 8,
            "mediawiki_diskussion": 9,
            "vorlage": 10,
            "vorlage_diskussion": 11,
            "hilfe": 12,
            "hilfe_diskussion": 13,
            "kategorie": 14,
            "kategorie_diskussion": 15,
            "widget": 274,
            "widget_diskussion": 275,
            "bild": 6,
            "bild_diskussion": 7,
            "benutzerin": 2,
            "benutzerin_diskussion": 3,
            "image": 6,
            "image_talk": 7,
            "media": -2,
            "special": -1,
            "talk": 1,
            "user": 2,
            "user_talk": 3,
            "project": 4,
            "project_talk": 5,
            "file": 6,
            "file_talk": 7,
            "mediawiki_talk": 9,
            "template": 10,
            "template_talk": 11,
            "help": 12,
            "help_talk": 13,
            "category": 14,
            "category_talk": 15,
            "widget_talk": 275
        },
        "wgSiteName": "Hurraki - Wörterbuch für Leichte Sprache",
        "wgFileExtensions": ["png", "gif", "svg", "jpg", "jpeg"],
        "wgDBname": "db_3381_23_uvo",
        "wgFileCanRotate": true,
        "wgAvailableSkins": {
            "vector": "Vector",
            "monobook": "MonoBook",
            "nostalgia": "Nostalgia",
            "modern": "Modern",
            "standard": "Standard",
            "chick": "Chick",
            "myskin": "MySkin",
            "cologneblue": "CologneBlue",
            "simple": "Simple"
        },
        "wgExtensionAssetsPath": "/w/extensions",
        "wgCookiePrefix": "db_3381_23_uvo",
        "wgResourceLoaderMaxQueryLength": -1,
        "wgCaseSensitiveNamespaces": [],
        "wgLegalTitleChars": " %!\"$\u0026'()*,\\-./0-9:;=?@A-Z\\\\\\^_`a-z~+\\u0080-\\uFFFF",
        "wgWikiEditorMagicWords": {
            "redirect": "#WEITERLEITUNG",
            "img_right": "rechts",
            "img_left": "links",
            "img_none": "ohne",
            "img_center": "zentriert",
            "img_thumbnail": "miniatur",
            "img_framed": "gerahmt",
            "img_frameless": "rahmenlos"
        },
        "wgCollectionVersion": "1.6.1",
        "wgStopMobileRedirectCookie": {
            "name": "stopMobileRedirect",
            "duration": 180,
            "domain": ".hurraki.de",
            "path": "/"
        },
        "wgMFNearbyEndpoint": "",
        "wgMFNearbyNamespace": 0
    });
};
if (isCompatible()) {
    //document.write("\u003Cscript src=\"http://hurraki.de/w/load.php?debug=false\u0026amp;lang=de\u0026amp;modules=jquery%2Cmediawiki\u0026amp;only=scripts\u0026amp;skin=vector\u0026amp;version=20140404T232428Z\"\u003E\u003C/script\u003E");
}
delete isCompatible;
/* cache key: db_3381_23_uvo:resourceloader:filter:minify-js:7:e55f33684042580a12523645754cc4d3 */