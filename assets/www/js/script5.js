mw.loader.implement("jquery.hidpi", function () {
    (function ($) {
        $.devicePixelRatio = function () {
            if (window.devicePixelRatio !== undefined) {
                return window.devicePixelRatio;
            } else if (window.msMatchMedia !== undefined) {
                if (window.msMatchMedia('(min-resolution: 192dpi)').matches) {
                    return 2;
                } else if (window.msMatchMedia('(min-resolution: 144dpi)').matches) {
                    return 1.5;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        };
        $.fn.hidpi = function () {
            var $target = this,
                devicePixelRatio = $.devicePixelRatio(),
                testImage = new Image();
            if (devicePixelRatio > 1 && testImage.srcset === undefined) {
                $target.find('img').each(function () {
                    var $img = $(this),
                        srcset = $img.attr('srcset'),
                        match;
                    if (typeof srcset === 'string' && srcset !== '') {
                        match = $.matchSrcSet(devicePixelRatio, srcset);
                        if (match !== null) {
                            $img.attr('src', match);
                        }
                    }
                });
            }
            return $target;
        };
        $.matchSrcSet = function (devicePixelRatio, srcset) {
            var candidates, candidate, bits, src, i, ratioStr, ratio, selectedRatio = 1,
                selectedSrc = null;
            candidates = srcset.split(/ *, */);
            for (i = 0; i < candidates.length; i++) {
                candidate = candidates[i];
                bits =
                    candidate.split(/ +/);
                src = bits[0];
                if (bits.length > 1 && bits[1].charAt(bits[1].length - 1) === 'x') {
                    ratioStr = bits[1].substr(0, bits[1].length - 1);
                    ratio = parseFloat(ratioStr);
                    if (ratio <= devicePixelRatio && ratio > selectedRatio) {
                        selectedRatio = ratio;
                        selectedSrc = src;
                    }
                }
            }
            return selectedSrc;
        };
    }(jQuery));;
}, {}, {});
mw.loader.implement("mediawiki.cldr", function () {
    (function (mw) {
        'use strict';
        var cldr = {
            getPluralForm: function (number, pluralRules) {
                var i;
                for (i = 0; i < pluralRules.length; i++) {
                    if (mw.libs.pluralRuleParser(pluralRules[i], number)) {
                        break;
                    }
                }
                return i;
            }
        };
        mw.cldr = cldr;
    }(mediaWiki));;
}, {}, {});
mw.loader.implement("mediawiki.hidpi", function () {
    jQuery(function ($) {
        $('body').hidpi();
    });;
}, {}, {});
mw.loader.implement("mediawiki.jqueryMsg", function () {
    (function (mw, $) {
        var oldParser, slice = Array.prototype.slice,
            parserDefaults = {
                magic: {
                    'SITENAME': mw.config.get('wgSiteName')
                },
                allowedHtmlElements: ['b', 'i'],
                allowedHtmlCommonAttributes: ['id', 'class', 'style', 'lang', 'dir', 'title', 'role'],
                allowedHtmlAttributesByElement: {},
                messages: mw.
                messages,
                language: mw.language,
                format: 'parse'
            };

        function appendWithoutParsing($parent, children) {
            var i, len;
            if (!$.isArray(children)) {
                children = [children];
            }
            for (i = 0, len = children.length; i < len; i++) {
                if (typeof children[i] !== 'object') {
                    children[i] = document.createTextNode(children[i]);
                }
            }
            return $parent.append(children);
        }

        function decodePrimaryHtmlEntities(encoded) {
            return encoded.replace(/&#039;/g, '\'').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        }

        function getFailableParserFn(options) {
            var parser = new mw.jqueryMsg.parser(options);
            return function (args) {
                var key = args[0],
                    argsArray = $.isArray(args[1]) ? args[1] : slice.call(args, 1);
                try {
                    return parser.parse(key, argsArray);
                } catch (e) {
                    return $('<span>').text(key + ': ' + e.message);
                }
            };
        }
        mw.jqueryMsg = {};
        mw.jqueryMsg.getMessageFunction = function (options) {
            var failableParserFn = getFailableParserFn(options),
                format;
            if (options && options.format !== undefined) {
                format = options.format;
            } else {
                format = parserDefaults.format;
            }
            return function () {
                var
                    failableResult = failableParserFn(arguments);
                if (format === 'text' || format === 'escaped') {
                    return failableResult.text();
                } else {
                    return failableResult.html();
                }
            };
        };
        mw.jqueryMsg.getPlugin = function (options) {
            var failableParserFn = getFailableParserFn(options);
            return function () {
                var $target = this.empty();
                $.each(failableParserFn(arguments).contents(), function (i, node) {
                    appendWithoutParsing($target, node);
                });
                return $target;
            };
        };
        mw.jqueryMsg.parser = function (options) {
            this.settings = $.extend({}, parserDefaults, options);
            this.settings.onlyCurlyBraceTransform = (this.settings.format === 'text' || this.settings.format === 'escaped');
            this.emitter = new mw.jqueryMsg.htmlEmitter(this.settings.language, this.settings.magic);
        };
        mw.jqueryMsg.parser.prototype = {
            astCache: {},
            parse: function (key, replacements) {
                return this.emitter.emit(this.getAst(key), replacements);
            },
            getAst: function (key) {
                var cacheKey = [key, this.settings.onlyCurlyBraceTransform].join(':'),
                    wikiText;
                if (this.astCache[cacheKey] === undefined) {
                    wikiText = this.settings.messages.get(key);
                    if (typeof wikiText !== 'string') {
                        wikiText = '\\[' + key + '\\]';
                    }
                    this.astCache[cacheKey] = this.wikiTextToAst(wikiText);
                }
                return this.astCache[cacheKey];
            },
            wikiTextToAst: function (input) {
                var pos, settings = this.settings,
                    concat = Array.prototype.concat,
                    regularLiteral, regularLiteralWithoutBar, regularLiteralWithoutSpace, regularLiteralWithSquareBrackets, doubleQuote, singleQuote, backslash, anyCharacter, asciiAlphabetLiteral, escapedOrLiteralWithoutSpace, escapedOrLiteralWithoutBar, escapedOrRegularLiteral, whitespace, dollar, digits, htmlDoubleQuoteAttributeValue, htmlSingleQuoteAttributeValue, htmlAttributeEquals, openHtmlStartTag, optionalForwardSlash, openHtmlEndTag, closeHtmlTag, openExtlink, closeExtlink, wikilinkPage, wikilinkContents, openWikilink, closeWikilink, templateName, pipe, colon, templateContents, openTemplate, closeTemplate, nonWhitespaceExpression, paramExpression, expression, curlyBraceTransformExpression, result;
                pos = 0;

                function choice(ps) {
                    return function () {
                        var i, result;
                        for (i = 0; i < ps.length; i++) {
                            result = ps[i]();
                            if (result !==
                                null) {
                                return result;
                            }
                        }
                        return null;
                    };
                }

                function sequence(ps) {
                    var i, res, originalPos = pos,
                        result = [];
                    for (i = 0; i < ps.length; i++) {
                        res = ps[i]();
                        if (res === null) {
                            pos = originalPos;
                            return null;
                        }
                        result.push(res);
                    }
                    return result;
                }

                function nOrMore(n, p) {
                    return function () {
                        var originalPos = pos,
                            result = [],
                            parsed = p();
                        while (parsed !== null) {
                            result.push(parsed);
                            parsed = p();
                        }
                        if (result.length < n) {
                            pos = originalPos;
                            return null;
                        }
                        return result;
                    };
                }

                function transform(p, fn) {
                    return function () {
                        var result = p();
                        return result === null ? null : fn(result);
                    };
                }

                function makeStringParser(s) {
                    var len = s.length;
                    return function () {
                        var result = null;
                        if (input.substr(pos, len) === s) {
                            result = s;
                            pos += len;
                        }
                        return result;
                    };
                }

                function makeRegexParser(regex) {
                    return function () {
                        var matches = input.substr(pos).match(regex);
                        if (matches === null) {
                            return null;
                        }
                        pos += matches[0].length;
                        return matches[0];
                    };
                }
                regularLiteral = makeRegexParser(/^[^{}\[\]$<\\]/);
                regularLiteralWithoutBar = makeRegexParser(/^[^{}\[\]$\\|]/);
                regularLiteralWithoutSpace = makeRegexParser(/^[^{}\[\]$\s]/);
                regularLiteralWithSquareBrackets = makeRegexParser(/^[^{}$\\]/);
                backslash = makeStringParser('\\');
                doubleQuote = makeStringParser('"');
                singleQuote = makeStringParser('\'');
                anyCharacter = makeRegexParser(/^./);
                openHtmlStartTag = makeStringParser('<');
                optionalForwardSlash = makeRegexParser(/^\/?/);
                openHtmlEndTag = makeStringParser('</');
                htmlAttributeEquals = makeRegexParser(/^\s*=\s*/);
                closeHtmlTag = makeRegexParser(/^\s*>/);

                function escapedLiteral() {
                    var result = sequence([backslash, anyCharacter]);
                    return result === null ? null : result[1];
                }
                escapedOrLiteralWithoutSpace = choice([escapedLiteral, regularLiteralWithoutSpace]);
                escapedOrLiteralWithoutBar = choice([escapedLiteral, regularLiteralWithoutBar]);
                escapedOrRegularLiteral = choice([escapedLiteral, regularLiteral]);

                function literalWithoutSpace() {
                    var result = nOrMore(1, escapedOrLiteralWithoutSpace)();
                    return result === null ? null : result.join('');
                }

                function literalWithoutBar() {
                    var result = nOrMore(1, escapedOrLiteralWithoutBar)();
                    return result === null ? null : result.join('');
                }

                function
                unescapedLiteralWithoutBar() {
                    var result = nOrMore(1, regularLiteralWithoutBar)();
                    return result === null ? null : result.join('');
                }

                function literal() {
                    var result = nOrMore(1, escapedOrRegularLiteral)();
                    return result === null ? null : result.join('');
                }

                function curlyBraceTransformExpressionLiteral() {
                    var result = nOrMore(1, regularLiteralWithSquareBrackets)();
                    return result === null ? null : result.join('');
                }
                asciiAlphabetLiteral = makeRegexParser(/[A-Za-z]+/);
                htmlDoubleQuoteAttributeValue = makeRegexParser(/^[^"]*/);
                htmlSingleQuoteAttributeValue = makeRegexParser(/^[^']*/);
                whitespace = makeRegexParser(/^\s+/);
                dollar = makeStringParser('$');
                digits = makeRegexParser(/^\d+/);

                function replacement() {
                    var result = sequence([dollar, digits]);
                    if (result === null) {
                        return null;
                    }
                    return ['REPLACE', parseInt(result[1], 10) - 1];
                }
                openExtlink = makeStringParser('[');
                closeExtlink = makeStringParser(']');

                function extlink() {
                    var result, parsedResult;
                    result = null;
                    parsedResult = sequence([openExtlink, nonWhitespaceExpression, whitespace, nOrMore(1, expression), closeExtlink]);
                    if (parsedResult !== null) {
                        result = ['EXTLINK', parsedResult[1]];
                        if (parsedResult[3].length === 1) {
                            result.push(parsedResult[3][0]);
                        } else {
                            result.push(['CONCAT'].concat(parsedResult[3]));
                        }
                    }
                    return result;
                }

                function extLinkParam() {
                    var result = sequence([openExtlink, dollar, digits, whitespace, expression, closeExtlink]);
                    if (result === null) {
                        return null;
                    }
                    return ['EXTLINKPARAM', parseInt(result[2], 10) - 1, result[4]];
                }
                openWikilink = makeStringParser('[[');
                closeWikilink = makeStringParser(']]');
                pipe = makeStringParser('|');

                function template() {
                    var result = sequence([openTemplate, templateContents, closeTemplate]);
                    return result === null ? null : result[1];
                }
                wikilinkPage = choice([unescapedLiteralWithoutBar, template]);

                function pipedWikilink() {
                    var result = sequence([wikilinkPage, pipe, expression]);
                    return result === null ? null : [result[0], result[2]];
                }
                wikilinkContents = choice([pipedWikilink, wikilinkPage]);

                function wikilink() {
                    var result, parsedResult, parsedLinkContents;
                    result = null;
                    parsedResult = sequence([openWikilink, wikilinkContents, closeWikilink]);
                    if (parsedResult !== null) {
                        parsedLinkContents = parsedResult[1];
                        result = ['WIKILINK'].concat(parsedLinkContents);
                    }
                    return result;
                }

                function doubleQuotedHtmlAttributeValue() {
                    var parsedResult = sequence([doubleQuote, htmlDoubleQuoteAttributeValue, doubleQuote]);
                    return parsedResult === null ? null : parsedResult[1];
                }

                function singleQuotedHtmlAttributeValue() {
                    var parsedResult = sequence([singleQuote, htmlSingleQuoteAttributeValue, singleQuote]);
                    return parsedResult === null ? null : parsedResult[1];
                }

                function htmlAttribute() {
                    var parsedResult = sequence([whitespace, asciiAlphabetLiteral, htmlAttributeEquals, choice([doubleQuotedHtmlAttributeValue, singleQuotedHtmlAttributeValue])]);
                    return parsedResult === null ? null : [parsedResult[1], parsedResult[3]];
                }

                function isAllowedHtml(startTagName, endTagName, attributes) {
                    var i, len, attributeName;
                    startTagName = startTagName.toLowerCase();
                    endTagName = endTagName.toLowerCase();
                    if (startTagName !== endTagName || $.inArray(startTagName, settings.allowedHtmlElements) === -1) {
                        return false;
                    }
                    for (i = 0, len = attributes.length; i < len; i += 2) {
                        attributeName = attributes[i];
                        if ($.inArray(attributeName, settings.allowedHtmlCommonAttributes) === -1 && $.inArray(attributeName, settings.allowedHtmlAttributesByElement[startTagName] || []) === -1) {
                            return false;
                        }
                    }
                    return true;
                }

                function htmlAttributes() {
                    var parsedResult = nOrMore(0, htmlAttribute)();
                    return concat.apply(['HTMLATTRIBUTES'], parsedResult);
                }

                function html() {
                    var result = null,
                        parsedOpenTagResult, parsedHtmlContents, parsedCloseTagResult, wrappedAttributes, attributes, startTagName, endTagName, startOpenTagPos, startCloseTagPos, endOpenTagPos, endCloseTagPos;
                    startOpenTagPos = pos;
                    parsedOpenTagResult = sequence([openHtmlStartTag, asciiAlphabetLiteral, htmlAttributes, optionalForwardSlash, closeHtmlTag]);
                    if (parsedOpenTagResult === null) {
                        return null;
                    }
                    endOpenTagPos = pos;
                    startTagName = parsedOpenTagResult[1];
                    parsedHtmlContents = nOrMore(0, expression)();
                    startCloseTagPos = pos;
                    parsedCloseTagResult = sequence([openHtmlEndTag, asciiAlphabetLiteral, closeHtmlTag]);
                    if (parsedCloseTagResult === null) {
                        return ['CONCAT',
input.substring(startOpenTagPos, endOpenTagPos)].concat(parsedHtmlContents);
                    }
                    endCloseTagPos = pos;
                    endTagName = parsedCloseTagResult[1];
                    wrappedAttributes = parsedOpenTagResult[2];
                    attributes = wrappedAttributes.slice(1);
                    if (isAllowedHtml(startTagName, endTagName, attributes)) {
                        result = ['HTMLELEMENT', startTagName, wrappedAttributes].concat(parsedHtmlContents);
                    } else {
                        result = ['CONCAT', input.substring(startOpenTagPos, endOpenTagPos)].concat(parsedHtmlContents, input.substring(startCloseTagPos, endCloseTagPos));
                    }
                    return result;
                }
                templateName = transform(makeRegexParser(/^[ !"$&'()*,.\/0-9;=?@A-Z\^_`a-z~\x80-\xFF+\-]+/), function (result) {
                    return result.toString();
                });

                function templateParam() {
                    var expr, result;
                    result = sequence([pipe, nOrMore(0, paramExpression)]);
                    if (result === null) {
                        return null;
                    }
                    expr = result[1];
                    return expr.length > 1 ? ['CONCAT'].concat(expr) : expr[0];
                }

                function templateWithReplacement() {
                    var result = sequence([templateName, colon, replacement]);
                    return result === null ? null : [result[0], result[2]];
                }

                function
                templateWithOutReplacement() {
                    var result = sequence([templateName, colon, paramExpression]);
                    return result === null ? null : [result[0], result[2]];
                }
                colon = makeStringParser(':');
                templateContents = choice([
                    function () {
                        var res = sequence([choice([templateWithReplacement, templateWithOutReplacement]), nOrMore(0, templateParam)]);
                        return res === null ? null : res[0].concat(res[1]);
                    },
                    function () {
                        var res = sequence([templateName, nOrMore(0, templateParam)]);
                        if (res === null) {
                            return null;
                        }
                        return [res[0]].concat(res[1]);
                    }]);
                openTemplate = makeStringParser('{{');
                closeTemplate = makeStringParser('}}');
                nonWhitespaceExpression = choice([template, wikilink, extLinkParam, extlink, replacement, literalWithoutSpace]);
                paramExpression = choice([template, wikilink, extLinkParam, extlink, replacement, literalWithoutBar]);
                expression = choice([template, wikilink, extLinkParam, extlink, replacement, html, literal]);
                curlyBraceTransformExpression = choice([template, replacement, curlyBraceTransformExpressionLiteral]);

                function start(rootExpression) {
                    var result = nOrMore(0,
                        rootExpression)();
                    if (result === null) {
                        return null;
                    }
                    return ['CONCAT'].concat(result);
                }
                result = start(this.settings.onlyCurlyBraceTransform ? curlyBraceTransformExpression : expression);
                if (result === null || pos !== input.length) {
                    throw new Error('Parse error at position ' + pos.toString() + ' in input: ' + input);
                }
                return result;
            }
        };
        mw.jqueryMsg.htmlEmitter = function (language, magic) {
            this.language = language;
            var jmsg = this;
            $.each(magic, function (key, val) {
                jmsg[key.toLowerCase()] = function () {
                    return val;
                };
            });
            this.emit = function (node, replacements) {
                var ret, subnodes, operation, jmsg = this;
                switch (typeof node) {
                case 'string':
                case 'number':
                    ret = node;
                    break;
                case 'object':
                    subnodes = $.map(node.slice(1), function (n) {
                        return jmsg.emit(n, replacements);
                    });
                    operation = node[0].toLowerCase();
                    if (typeof jmsg[operation] === 'function') {
                        ret = jmsg[operation](subnodes, replacements);
                    } else {
                        throw new Error('Unknown operation "' + operation + '"');
                    }
                    break;
                case 'undefined':
                    ret = '';
                    break;
                default:
                    throw new Error('Unexpected type in AST: ' + typeof node);
                }
                return ret;
            };
        };
        mw.
        jqueryMsg.htmlEmitter.prototype = {
            concat: function (nodes) {
                var $span = $('<span>').addClass('mediaWiki_htmlEmitter');
                $.each(nodes, function (i, node) {
                    if (node instanceof jQuery && node.hasClass('mediaWiki_htmlEmitter')) {
                        $.each(node.contents(), function (j, childNode) {
                            appendWithoutParsing($span, childNode);
                        });
                    } else {
                        appendWithoutParsing($span, node);
                    }
                });
                return $span;
            },
            replace: function (nodes, replacements) {
                var index = parseInt(nodes[0], 10);
                if (index < replacements.length) {
                    return replacements[index];
                } else {
                    return '$' + (index + 1);
                }
            },
            wikilink: function (nodes) {
                var page, anchor, url;
                page = nodes[0];
                url = mw.util.getUrl(page);
                if (nodes.length === 1) {
                    anchor = page;
                } else {
                    anchor = nodes[1];
                }
                return $('<a />').attr({
                    title: page,
                    href: url
                }).text(anchor);
            },
            htmlattributes: function (nodes) {
                var i, len, mapping = {};
                for (i = 0, len = nodes.length; i < len; i += 2) {
                    mapping[nodes[i]] = decodePrimaryHtmlEntities(nodes[i + 1]);
                }
                return mapping;
            },
            htmlelement: function (nodes) {
                var tagName, attributes, contents, $element;
                tagName = nodes.shift();
                attributes = nodes.shift();
                contents =
                    nodes;
                $element = $(document.createElement(tagName)).attr(attributes);
                return appendWithoutParsing($element, contents);
            },
            extlink: function (nodes) {
                var $el, arg = nodes[0],
                    contents = nodes[1];
                if (arg instanceof jQuery) {
                    $el = arg;
                } else {
                    $el = $('<a>');
                    if (typeof arg === 'function') {
                        $el.click(arg).attr('href', '#');
                    } else {
                        $el.attr('href', arg.toString());
                    }
                }
                return appendWithoutParsing($el, contents);
            },
            extlinkparam: function (nodes, replacements) {
                var replacement, index = parseInt(nodes[0], 10);
                if (index < replacements.length) {
                    replacement = replacements[index];
                } else {
                    replacement = '$' + (index + 1);
                }
                return this.extlink([replacement, nodes[1]]);
            },
            plural: function (nodes) {
                var forms, count;
                count = parseFloat(this.language.convertNumber(nodes[0], true));
                forms = nodes.slice(1);
                return forms.length ? this.language.convertPlural(count, forms) : '';
            },
            gender: function (nodes) {
                var gender, forms;
                if (nodes[0] && nodes[0].options instanceof mw.Map) {
                    gender = nodes[0].options.get('gender');
                } else {
                    gender = nodes[0];
                }
                forms = nodes.slice(1);
                return this.language.gender(gender,
                    forms);
            },
            grammar: function (nodes) {
                var form = nodes[0],
                    word = nodes[1];
                return word && form && this.language.convertGrammar(word, form);
            },
            int: function (nodes) {
                return mw.jqueryMsg.getMessageFunction()(nodes[0].toLowerCase());
            },
            formatnum: function (nodes) {
                var isInteger = (nodes[1] && nodes[1] === 'R') ? true : false,
                    number = nodes[0];
                return this.language.convertNumber(number, isInteger);
            }
        };
        window.gM = mw.jqueryMsg.getMessageFunction();
        $.fn.msg = mw.jqueryMsg.getPlugin();
        oldParser = mw.Message.prototype.parser;
        mw.Message.prototype.parser = function () {
            var messageFunction;
            if (this.format === 'plain' || !/\{\{|[\[<>]/.test(this.map.get(this.key))) {
                return oldParser.apply(this);
            }
            messageFunction = mw.jqueryMsg.getMessageFunction({
                'messages': this.map,
                'format': this.format
            });
            return messageFunction(this.key, this.parameters);
        };
    }(mediaWiki, jQuery));;
}, {}, {});
mw.loader.implement("mediawiki.language", function () {
    (function (mw, $) {
        var language = {
            procPLURAL: function (template) {
                if (template.title && template.parameters && mw.language.convertPlural) {
                    if (
                        template.parameters.length === 0) {
                        return '';
                    }
                    var count = mw.language.convertNumber(template.title, true);
                    return mw.language.convertPlural(parseInt(count, 10), template.parameters);
                }
                if (template.parameters[0]) {
                    return template.parameters[0];
                }
                return '';
            },
            convertPlural: function (count, forms) {
                var pluralRules, formCount, form, index, equalsPosition, pluralFormIndex = 0;
                if (!forms || forms.length === 0) {
                    return '';
                }
                for (index = 0; index < forms.length; index++) {
                    form = forms[index];
                    if (/^\d+=/.test(form)) {
                        equalsPosition = form.indexOf('=');
                        formCount = parseInt(form.substring(0, equalsPosition), 10);
                        if (formCount === count) {
                            return form.substr(equalsPosition + 1);
                        }
                        forms[index] = undefined;
                    }
                }
                forms = $.map(forms, function (form) {
                    return form;
                });
                pluralRules = mw.language.getData(mw.config.get('wgUserLanguage'), 'pluralRules');
                if (!pluralRules) {
                    return (count === 1) ? forms[0] : forms[1];
                }
                pluralFormIndex = mw.cldr.getPluralForm(count, pluralRules);
                pluralFormIndex = Math.min(pluralFormIndex, forms.length - 1);
                return forms[pluralFormIndex];
            },
            preConvertPlural: function (forms, count) {
                while (forms.length < count) {
                    forms.push(forms[forms.length - 1]);
                }
                return forms;
            },
            gender: function (gender, forms) {
                if (!forms || forms.length === 0) {
                    return '';
                }
                forms = mw.language.preConvertPlural(forms, 2);
                if (gender === 'male') {
                    return forms[0];
                }
                if (gender === 'female') {
                    return forms[1];
                }
                return (forms.length === 3) ? forms[2] : forms[0];
            },
            convertGrammar: function (word, form) {
                var grammarForms = mw.language.getData(mw.config.get('wgUserLanguage'), 'grammarForms');
                if (grammarForms && grammarForms[form]) {
                    return grammarForms[form][word] || word;
                }
                return word;
            }
        };
        $.extend(mw.language, language);
    }(mediaWiki, jQuery));
    (function (mw, $) {
        function pad(text, size, ch, end) {
            if (!ch) {
                ch = '0';
            }
            var out = String(text),
                padStr = replicate(ch, Math.ceil((size - out.length) / ch.length));
            return end ? out + padStr : padStr + out;
        }

        function replicate(str, num) {
            if (num <= 0 || !str) {
                return '';
            }
            var buf = [];
            while (num) {
                buf.push(str);
                str += str;
            }
            return buf.join('');
        }

        function commafyNumber(value, pattern, options) {
            options = options || {
                group: ',',
                decimal: '.'
            };
            if (isNaN(value)) {
                return value;
            }
            var padLength, patternDigits, index, whole, off, remainder, patternParts = pattern.split('.'),
                maxPlaces = (patternParts[1] || []).length,
                valueParts = String(Math.abs(value)).split('.'),
                fractional = valueParts[1] || '',
                groupSize = 0,
                groupSize2 = 0,
                pieces = [];
            if (patternParts[1]) {
                padLength = (patternParts[1] && patternParts[1].lastIndexOf('0') + 1);
                if (padLength > fractional.length) {
                    valueParts[1] = pad(fractional, padLength, '0', true);
                }
                if (maxPlaces < fractional.length) {
                    valueParts[1] = fractional.substr(0, maxPlaces);
                }
            } else {
                if (valueParts[1]) {
                    valueParts.pop();
                }
            }
            patternDigits = patternParts[0].replace(',', '');
            padLength = patternDigits.indexOf('0');
            if (padLength !== -1) {
                padLength = patternDigits.length - padLength;
                if (padLength > valueParts[0].length) {
                    valueParts[0] = pad(valueParts[0], padLength);
                }
                if (patternDigits.indexOf('#') === -1) {
                    valueParts[0] = valueParts[0].substr(valueParts[0].length - padLength);
                }
            }
            index = patternParts[0].lastIndexOf(',');
            if (index !== -1) {
                groupSize = patternParts[0].length - index - 1;
                remainder = patternParts[0].substr(0, index);
                index =
                    remainder.lastIndexOf(',');
                if (index !== -1) {
                    groupSize2 = remainder.length - index - 1;
                }
            }
            for (whole = valueParts[0]; whole;) {
                off = whole.length - groupSize;
                pieces.push((off > 0) ? whole.substr(off) : whole);
                whole = (off > 0) ? whole.slice(0, off) : '';
                if (groupSize2) {
                    groupSize = groupSize2;
                }
            }
            valueParts[0] = pieces.reverse().join(options.group);
            return valueParts.join(options.decimal);
        }
        $.extend(mw.language, {
            convertNumber: function (num, integer) {
                var i, tmp, transformTable, numberString, convertedNumber, pattern;
                pattern = mw.language.getData(mw.config.get('wgUserLanguage'), 'digitGroupingPattern') || '#,##0.###';
                transformTable = mw.language.getDigitTransformTable();
                if (!transformTable) {
                    return num;
                }
                if (integer) {
                    if (parseInt(num, 10) === num) {
                        return num;
                    }
                    tmp = [];
                    for (i in transformTable) {
                        tmp[transformTable[i]] = i;
                    }
                    transformTable = tmp;
                    numberString = num + '';
                } else {
                    numberString = mw.language.commafy(num, pattern);
                }
                convertedNumber = '';
                for (i = 0; i < numberString.length; i++) {
                    if (transformTable[numberString[i]]) {
                        convertedNumber += transformTable[numberString[i]];
                    } else {
                        convertedNumber += numberString[i];
                    }
                }
                return integer ? parseInt(convertedNumber, 10) : convertedNumber;
            },
            getDigitTransformTable: function () {
                return mw.language.getData(mw.config.get('wgUserLanguage'), 'digitTransformTable') || [];
            },
            getSeparatorTransformTable: function () {
                return mw.language.getData(mw.config.get('wgUserLanguage'), 'separatorTransformTable') || [];
            },
            commafy: function (value, pattern) {
                var numberPattern, transformTable = mw.language.getSeparatorTransformTable(),
                    group = transformTable[','] || ',',
                    numberPatternRE = /[#0,]*[#0](?:\.0*#*)?/,
                    decimal = transformTable['.'] || '.',
                    patternList = pattern.split(';'),
                    positivePattern = patternList[0];
                pattern = patternList[(value < 0) ? 1 : 0] || ('-' + positivePattern);
                numberPattern = positivePattern.match(numberPatternRE);
                if (!numberPattern) {
                    throw new Error('unable to find a number expression in pattern: ' + pattern);
                }
                return pattern.replace(numberPatternRE, commafyNumber(value, numberPattern[0], {
                    decimal: decimal,
                    group: group
                }));
            }
        });
    }(mediaWiki, jQuery));;
}, {}, {});
mw.loader.implement(
    "mediawiki.language.data", function () {
        mw.language.setData("de", {
            "digitTransformTable": null,
            "separatorTransformTable": {
                ",": ".",
                ".": ","
            },
            "grammarForms": [],
            "pluralRules": ["i = 1 and v = 0 @integer 1"],
            "digitGroupingPattern": null
        });
    }, {}, {});
mw.loader.implement("mediawiki.language.init", function () {
    (function (mw) {
        var language = {
            data: {},
            getData: function (langCode, dataKey) {
                var langData = language.data;
                if (langData && langData[langCode] instanceof mw.Map) {
                    return langData[langCode].get(dataKey);
                }
                return undefined;
            },
            setData: function (langCode, dataKey, value) {
                var langData = language.data;
                if (!(langData[langCode] instanceof mw.Map)) {
                    langData[langCode] = new mw.Map();
                }
                langData[langCode].set(dataKey, value);
            }
        };
        mw.language = language;
    }(mediaWiki));;
}, {}, {});
mw.loader.implement("mediawiki.libs.pluralruleparser", function () {
    (function (mw) {
        function pluralRuleParser(rule, number) {
            rule = rule.split('@')[0].trim();
            if (!rule.length) {
                return true;
            }
            var pos = 0,
                operand, expression, relation, result, whitespace = makeRegexParser(/^\s+/),
                value =
                makeRegexParser(/^\d+/),
                _n_ = makeStringParser('n'),
                _i_ = makeStringParser('i'),
                _f_ = makeStringParser('f'),
                _t_ = makeStringParser('t'),
                _v_ = makeStringParser('v'),
                _w_ = makeStringParser('w'),
                _is_ = makeStringParser('is'),
                _isnot_ = makeStringParser('is not'),
                _isnot_sign_ = makeStringParser('!='),
                _equal_ = makeStringParser('='),
                _mod_ = makeStringParser('mod'),
                _percent_ = makeStringParser('%'),
                _not_ = makeStringParser('not'),
                _in_ = makeStringParser('in'),
                _within_ = makeStringParser('within'),
                _range_ = makeStringParser('..'),
                _comma_ = makeStringParser(','),
                _or_ = makeStringParser('or'),
                _and_ = makeStringParser('and');

            function debug() {}
            debug('pluralRuleParser', rule, number);

            function choice(parserSyntax) {
                return function () {
                    for (var i = 0; i < parserSyntax.length; i++) {
                        var result = parserSyntax[i]();
                        if (result !== null) {
                            return result;
                        }
                    }
                    return null;
                };
            }

            function sequence(parserSyntax) {
                var originalPos = pos;
                var result = [];
                for (var i = 0; i < parserSyntax.length; i++) {
                    var res = parserSyntax[i]();
                    if (res === null) {
                        pos = originalPos;
                        return null;
                    }
                    result.push(res);
                }
                return result;
            }

            function nOrMore(n, p) {
                return function () {
                    var originalPos = pos;
                    var result = [];
                    var parsed = p();
                    while (parsed !== null) {
                        result.push(parsed);
                        parsed = p();
                    }
                    if (result.length < n) {
                        pos = originalPos;
                        return null;
                    }
                    return result;
                };
            }

            function makeStringParser(s) {
                var len = s.length;
                return function () {
                    var result = null;
                    if (rule.substr(pos, len) === s) {
                        result = s;
                        pos += len;
                    }
                    return result;
                };
            }

            function makeRegexParser(regex) {
                return function () {
                    var matches = rule.substr(pos).match(regex);
                    if (matches === null) {
                        return null;
                    }
                    pos += matches[0].length;
                    return matches[0];
                };
            }

            function i() {
                var result = _i_();
                if (result === null) {
                    debug(' -- failed i', parseInt(number, 10));
                    return result;
                }
                result = parseInt(number, 10);
                debug(' -- passed i ', result);
                return result;
            }

            function n() {
                var result = _n_();
                if (result === null) {
                    debug(' -- failed n ', number);
                    return result;
                }
                result = parseFloat(number, 10);
                debug(' -- passed n ', result);
                return result;
            }

            function f() {
                var result = _f_();
                if (result === null) {
                    debug(' -- failed f ', number);
                    return result;
                }
                result = (number + '.').split(
                    '.')[1] || 0;
                debug(' -- passed f ', result);
                return result;
            }

            function t() {
                var result = _t_();
                if (result === null) {
                    debug(' -- failed t ', number);
                    return result;
                }
                result = (number + '.').split('.')[1].replace(/0$/, '') || 0;
                debug(' -- passed t ', result);
                return result;
            }

            function v() {
                var result = _v_();
                if (result === null) {
                    debug(' -- failed v ', number);
                    return result;
                }
                result = (number + '.').split('.')[1].length || 0;
                debug(' -- passed v ', result);
                return result;
            }

            function w() {
                var result = _w_();
                if (result === null) {
                    debug(' -- failed w ', number);
                    return result;
                }
                result = (number + '.').split('.')[1].replace(/0$/, '').length || 0;
                debug(' -- passed w ', result);
                return result;
            }
            operand = choice([n, i, f, t, v, w]);
            expression = choice([mod, operand]);

            function mod() {
                var result = sequence([operand, whitespace, choice([_mod_, _percent_]), whitespace, value]);
                if (result === null) {
                    debug(' -- failed mod');
                    return null;
                }
                debug(' -- passed ' + parseInt(result[0], 10) + ' ' + result[2] + ' ' + parseInt(result[4], 10));
                return parseInt(result[0], 10) % parseInt(result[4], 10);
            }

            function not() {
                var result = sequence([whitespace, _not_]);
                if (result === null) {
                    debug(' -- failed not');
                    return null;
                }
                return result[1];
            }

            function is() {
                var result = sequence([expression, whitespace, choice([_is_]), whitespace, value]);
                if (result !== null) {
                    debug(' -- passed is : ' + result[0] + ' == ' + parseInt(result[4], 10));
                    return result[0] === parseInt(result[4], 10);
                }
                debug(' -- failed is');
                return null;
            }

            function isnot() {
                var result = sequence([expression, whitespace, choice([_isnot_, _isnot_sign_]), whitespace, value]);
                if (result !== null) {
                    debug(' -- passed isnot: ' + result[0] + ' != ' + parseInt(result[4], 10));
                    return result[0] !== parseInt(result[4], 10);
                }
                debug(' -- failed isnot');
                return null;
            }

            function not_in() {
                var result = sequence([expression, whitespace, _isnot_sign_, whitespace, rangeList]);
                if (result !== null) {
                    debug(' -- passed not_in: ' + result[0] + ' != ' + result[4]);
                    var range_list = result[4];
                    for (var i = 0; i < range_list.length; i++) {
                        if (parseInt(range_list[i], 10) === parseInt(result[0], 10)) {
                            return false;
                        }
                    }
                    return true;
                }
                debug(' -- failed not_in');
                return null;
            }

            function rangeList() {
                var result = sequence([choice([range, value]), nOrMore(0, rangeTail)]);
                var resultList = [];
                if (result !== null) {
                    resultList = resultList.concat(result[0]);
                    if (result[1][0]) {
                        resultList = resultList.concat(result[1][0]);
                    }
                    return resultList;
                }
                debug(' -- failed rangeList');
                return null;
            }

            function rangeTail() {
                var result = sequence([_comma_, rangeList]);
                if (result !== null) {
                    return result[1];
                }
                debug(' -- failed rangeTail');
                return null;
            }

            function range() {
                var i;
                var result = sequence([value, _range_, value]);
                if (result !== null) {
                    debug(' -- passed range');
                    var array = [];
                    var left = parseInt(result[0], 10);
                    var right = parseInt(result[2], 10);
                    for (i = left; i <= right; i++) {
                        array.push(i);
                    }
                    return array;
                }
                debug(' -- failed range');
                return null;
            }

            function _in() {
                var result = sequence([expression, nOrMore(0, not), whitespace, choice([_in_, _equal_]), whitespace, rangeList]);
                if (result !== null) {
                    debug(' -- passed _in:' + result);
                    var range_list = result[5];
                    for (var i = 0; i < range_list.length; i++) {
                        if (parseInt(range_list[i], 10) === parseInt(result[0], 10)) {
                            return (result[1][0] !== 'not');
                        }
                    }
                    return (result[1][0] === 'not');
                }
                debug(' -- failed _in ');
                return null;
            }

            function within() {
                var result = sequence([expression, nOrMore(0, not), whitespace, _within_, whitespace, rangeList]);
                if (result !== null) {
                    debug(' -- passed within');
                    var range_list = result[5];
                    if ((result[0] >= parseInt(range_list[0], 10)) && (result[0] < parseInt(range_list[range_list.length - 1], 10))) {
                        return (result[1][0] !== 'not');
                    }
                    return (result[1][0] === 'not');
                }
                debug(' -- failed within ');
                return null;
            }
            relation = choice([is, not_in, isnot, _in, within]);

            function and() {
                var result = sequence([relation, nOrMore(0, andTail)]);
                if (result) {
                    if (!result[0]) {
                        return false;
                    }
                    for (var i = 0; i < result[1].length; i++) {
                        if (!result[1][i]) {
                            return false;
                        }
                    }
                    return true;
                }
                debug(' -- failed and');
                return null;
            }

            function andTail() {
                var result = sequence([whitespace, _and_, whitespace, relation]);
                if (result !== null) {
                    debug(' -- passed andTail' + result);
                    return result[3];
                }
                debug(' -- failed andTail');
                return null;
            }

            function orTail() {
                var result = sequence([whitespace, _or_,
whitespace, and]);
                if (result !== null) {
                    debug(' -- passed orTail: ' + result[3]);
                    return result[3];
                }
                debug(' -- failed orTail');
                return null;
            }

            function condition() {
                var result = sequence([and, nOrMore(0, orTail)]);
                if (result) {
                    for (var i = 0; i < result[1].length; i++) {
                        if (result[1][i]) {
                            return true;
                        }
                    }
                    return result[0];
                }
                return false;
            }
            result = condition();
            if (result === null) {
                throw new Error('Parse error at position ' + pos.toString() + ' for rule: ' + rule);
            }
            if (pos !== rule.length) {
                debug('Warning: Rule not parsed completely. Parser stopped at ' + rule.substr(0, pos) + ' for rule: ' + rule);
            }
            return result;
        }
        mw.libs.pluralRuleParser = pluralRuleParser;
    })(mediaWiki);;
}, {}, {});
mw.loader.implement("mobile.stable", function () {
    (function (M, $) {
        var LoadingOverlay = M.require('LoadingOverlay'),
            popup = M.require('notifications'),
            blacklisted = /MSIE \d\./.test(navigator.userAgent),
            isEditingSupported = M.router.isSupported() && !blacklisted,
            CtaDrawer = M.require('CtaDrawer'),
            drawer = new CtaDrawer({
                queryParams: {
                    campaign: 'mobile_editPageActionCta'
                },
                content: mw.msg(
                    'mobile-frontend-editor-cta')
            });

        function addEditButton(section, container) {
            return $('<a class="edit-page" href="#editor/' + section + '">').text(mw.msg('mobile-frontend-editor-edit')).prependTo(container);
        }

        function makeCta($el, hash, returnToQuery) {
            $el.on(M.tapEvent('mouseup'), function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                drawer.render({
                    queryParams: {
                        returnto: mw.config.get('wgPageName') + hash,
                        returntoquery: returnToQuery
                    }
                }).toggle();
            }).on('click', false);
        }

        function init(page) {
            var isNew = mw.config.get('wgArticleId') === 0;
            if (M.query.undo) {
                window.alert(mw.msg('mobile-frontend-editor-undo-unsupported'));
            }
            M.router.route(/^editor\/(\d+)$/, function (sectionId) {
                var loadingOverlay = new LoadingOverlay();
                loadingOverlay.show();
                mw.loader.using('mobile.editor', function () {
                    var EditorOverlay = M.require('modules/editor/EditorOverlay'),
                        title = page ? page.title : mw.config.get('wgTitle'),
                        ns = page ? '' : mw.config.get('wgCanonicalNamespace');
                    sectionId = parseInt(sectionId, 10);
                    loadingOverlay.hide();
                    new EditorOverlay({
                        title: ns ?
                            ns + ':' + title : title,
                        isNew: isNew,
                        isNewEditor: mw.config.get('wgUserEditCount') === 0,
                        sectionId: mw.config.get('wgPageContentModel') === 'wikitext' ? sectionId : null
                    }).show();
                });
            });
            $('#ca-edit').addClass('enabled');
            if (mw.config.get('wgIsMainPage') || isNew || M.getLeadSection().text()) {
                addEditButton(0, '#ca-edit');
            } else {
                addEditButton(1, '#ca-edit');
            }
            $('.edit-page').on(M.tapEvent('mouseup'), function (ev) {
                ev.stopPropagation();
            });
        }

        function initCta() {
            $('#ca-edit').addClass('enabled').on(M.tapEvent('click'), function () {
                drawer.render({
                    queryParams: {
                        returntoquery: 'article_action=edit'
                    }
                }).show();
            });
            $('.edit-page').each(function () {
                var $a = $(this),
                    anchor = '#' + $(this).parent().find('[id]').attr('id');
                if (mw.config.get('wgMFMode') === 'stable') {
                    makeCta($a, anchor);
                } else {
                    makeCta($a, anchor, 'article_action=edit');
                }
            });
        }
        if (mw.config.get('wgIsPageEditable') && isEditingSupported) {
            if (mw.config.get('wgMFAnonymousEditing') || mw.config.get('wgUserName')) {
                init();
                M.on('page-loaded', init);
            } else {
                initCta();
                M.on('page-loaded', initCta);
            }
        } else {
            $('#ca-edit, .edit-page').on(M.tapEvent('click'), function (ev) {
                popup.show(mw.msg(isEditingSupported ? 'mobile-frontend-editor-disabled' : 'mobile-frontend-editor-unavailable'), 'toast');
                ev.preventDefault();
            });
        }
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        function escapeHash(hash) {
            return hash.replace(/(:|\.)/g, '\\$1');
        }

        function toggle($heading) {
            $heading.toggleClass('openSection');
            $heading.next().toggleClass('openSection');
            M.emit('section-toggle', $heading);
        }

        function reveal(selector) {
            var $target, $heading;
            try {
                $target = $(escapeHash(selector));
                $heading = $target.closest('.section_heading').eq(0);
                if ($heading.length > 0 && !$heading.hasClass('openSection')) {
                    toggle($heading);
                    window.scrollTo(0, $target.offset().top);
                }
            } catch (e) {}
        }

        function init() {
            var $page = $('#content'),
                tagName = 'h2',
                additionalClassNames = '';
            if (M.isWideScreen() && mw.config.get('wgMFMode') !== 'stable') {
                additionalClassNames = 'openSection';
            }
            $('html').removeClass('stub');
            if ($page.find('h1').length > 0) {
                tagName = 'h1';
            }
            $page.find(tagName).addClass([
'section_heading', additionalClassNames].join(' '));
            $page.find('.section_heading').next('div').addClass(['content_block', additionalClassNames].join(' '));
            $('.section_heading').on(M.tapEvent('mouseup'), function () {
                toggle($(this));
            });
            $('.section_anchors').remove();

            function checkHash() {
                var hash = window.location.hash;
                if (hash.indexOf('#') === 0) {
                    reveal(hash);
                }
            }
            checkHash();
            $('#content_wrapper a').on('click', checkHash);
        }
        if (!M.inNamespace('special') && !mw.config.get('wgIsMainPage')) {
            init();
        }
        M.on('page-loaded', function (page) {
            if (!page.isMainPage()) {
                init();
            }
        });
        if (mw.config.get('wgMFMode') === 'stable') {
            M.on('section-toggle', function ($section) {
                var $content = $section.next(),
                    content = $content.data('content');
                if (content) {
                    $content.html(content).data('content', false);
                }
            });
        }
        M.define('toggle', {
            escapeHash: escapeHash,
            reveal: reveal,
            toggle: toggle,
            enable: init
        });
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var module = (function () {
            var issues = [],
                Overlay = M.require('Overlay'),
                CleanupOverlay = Overlay.extend({
                    defaults: $.extend({}, Overlay.prototype.defaults, {
                        heading: mw.msg('mobile-frontend-meta-data-issues-header')
                    }),
                    template: M.template.get('overlays/cleanup')
                });

            function run($container, parentOverlay) {
                $container = $container || M.getLeadSection();
                var $metadata = $container.find('table.ambox'),
                    overlay;
                $metadata.find('.NavFrame').remove();
                $metadata.each(function () {
                    var $this = $(this);
                    if ($(this).find('table.ambox').length === 0) {
                        issues.push({
                            icon: $this.find('.mbox-image img, .ambox-image img').attr('src'),
                            text: $this.find('.mbox-text, .ambox-text').html()
                        });
                    }
                });
                overlay = new CleanupOverlay({
                    parent: parentOverlay,
                    issues: issues
                });
                $('<a class="mw-mf-cleanup">').click(function () {
                    overlay.show();
                }).text(mw.msg('mobile-frontend-meta-data-issues')).insertBefore($metadata.eq(0));
                $metadata.remove();
            }

            function init() {
                run();
                M.on('page-loaded', function () {
                    run();
                });
                M.on('edit-preview', function (overlay) {
                    run(overlay.$el, overlay);
                });
            }
            return {
                init: init,
                run: run
            };
        }());
        M.define('cleanuptemplates', module);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var
            LanguageOverlay = M.require('languages/LanguageOverlay');

        function parseList($list) {
            var list = [];
            $list.find('li').each(function () {
                var $a = $(this).find('a'),
                    lang, pageName = $a.attr('title');
                lang = {
                    lang: $a.attr('lang'),
                    langName: $a.text(),
                    url: $a.attr('href')
                };
                if (pageName) {
                    lang.pageName = pageName;
                }
                list.push(lang);
            });
            return list;
        }

        function initButton() {
            var $section = $('#mw-mf-language-section'),
                $h2 = $section.find('h2'),
                languages = parseList($section.find('#mw-mf-language-selection')),
                variants = parseList($section.find('#mw-mf-language-variant-selection'));
            if (languages.length > 0 || variants.length > 1) {
                $('<button>').text($h2.text()).addClass('languageSelector').on('click', function () {
                    new LanguageOverlay({
                        variants: variants,
                        languages: languages
                    }).show();
                }).insertBefore($section);
            }
            $section.remove();
        }
        $(initButton);
        M.on('languages-loaded', initButton);
        M.define('modules/languages', {
            parseList: parseList
        });
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var module = (function () {
            var units = ['seconds', 'minutes', 'hours', 'days',
'months', 'years'],
                limits = [1, 60, 3600, 86400, 2592000, 31536000];

            function timeAgo(timestampDelta) {
                var i = 0;
                while (i < limits.length && timestampDelta > limits[i + 1]) {
                    ++i;
                }
                return {
                    value: Math.round(timestampDelta / limits[i]),
                    unit: units[i]
                };
            }

            function init() {
                var $lastModified = $('#mw-mf-last-modified'),
                    ts = $lastModified.data('timestamp'),
                    keys = {
                        seconds: 'mobile-frontend-last-modified-seconds',
                        minutes: 'mobile-frontend-last-modified-minutes',
                        hours: 'mobile-frontend-last-modified-hours',
                        days: 'mobile-frontend-last-modified-days',
                        months: 'mobile-frontend-last-modified-months',
                        years: 'mobile-frontend-last-modified-years'
                    },
                    message, pageTimestamp, currentTimestamp, delta;
                if (ts) {
                    pageTimestamp = parseInt(ts, 10);
                    currentTimestamp = Math.round(new Date().getTime() / 1000);
                    delta = timeAgo(currentTimestamp - pageTimestamp);
                    message = mw.msg(keys[delta.unit], mw.language.convertNumber(delta.value));
                    $lastModified.text(message);
                }
            }
            M.on('page-loaded', init);
            return {
                timeAgo: timeAgo,
                init: init
            };
        }());
        M.define('last-modified', module);
    }(mw.mobileFrontend,
        jQuery));
    (function (M, $) {
        var funnel = $.cookie('mwUploadsFunnel') || 'article',
            showCta = mw.config.get('wgMFEnablePhotoUploadCTA') || funnel === 'nearby',
            popup = M.require('notifications'),
            LeadPhotoUploaderButton = M.require('modules/uploads/LeadPhotoUploaderButton'),
            PhotoUploaderButton = M.require('modules/uploads/PhotoUploaderButton'),
            isSupported = PhotoUploaderButton.isSupported;

        function needsPhoto($container) {
            return $container.find(mw.config.get('wgMFLeadPhotoUploadCssSelector')).length === 0;
        }
        if (funnel) {
            $.cookie('mwUploadsFunnel', null);
        }

        function makeDisabledButton(msg) {
            $('#ca-upload').on('click', function () {
                popup.show(mw.msg(msg || 'mobile-frontend-photo-upload-disabled'), 'toast');
            });
        }

        function initialize() {
            var isEditable = mw.config.get('wgIsPageEditable'),
                validNamespace = (M.inNamespace('') || M.inNamespace('user'));
            if (!M.isLoggedIn() && !showCta) {
                return makeDisabledButton('mobile-frontend-photo-upload-anon');
            } else if (!isEditable) {
                return makeDisabledButton('mobile-frontend-photo-upload-protected');
            } else if (!
                validNamespace || mw.util.getParamValue('action') || !needsPhoto(M.getLeadSection()) || mw.config.get('wgIsMainPage')) {
                return makeDisabledButton();
            }
            new LeadPhotoUploaderButton({
                buttonCaption: mw.msg('mobile-frontend-photo-upload'),
                insertInPage: true,
                el: '#ca-upload',
                pageTitle: mw.config.get('wgPageName'),
                funnel: funnel
            });
        }
        if (isSupported) {
            $(initialize);
            M.on('page-loaded', function () {
                initialize();
            });
        } else {
            makeDisabledButton('mobile-frontend-photo-upload-unavailable');
        }
        M.define('modules/uploads/_leadphoto', {
            needsPhoto: needsPhoto
        });
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var photo = M.require('modules/uploads/PhotoUploaderButton');
        if (!photo.isSupported) {
            $('#mw-mf-page-left li.icon-uploads').remove();
        }
        if (!M.supportsGeoLocation()) {
            $('#mw-mf-page-left li.icon-nearby').remove();
        }
    })(mw.mobileFrontend, jQuery);
    (function (M, $) {
        var Overlay = M.require('Overlay'),
            SearchOverlay, api = M.require('api'),
            searchOverlay;

        function createSearchRegEx(str) {
            str = str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return new RegExp('^(' + str + ')', 'ig');
        }

        function highlightSearchTerm(label, term) {
            label = $('<span>').text(label).html();
            term = $('<span>').text(term).html();
            return label.replace(createSearchRegEx(term), '<strong>$1</strong>');
        }
        SearchOverlay = Overlay.extend({
            template: M.template.get('overlays/search/search'),
            defaults: {
                explanation: mw.msg('mobile-frontend-search-help'),
                noresults: mw.msg('mobile-frontend-search-noresults'),
                action: mw.config.get('wgScript')
            },
            className: 'mw-mf-overlay list-overlay',
            postRender: function (options) {
                var self = this;
                this._super(options);
                this.data = this.defaults;
                this.$('input').on('keyup', function (ev) {
                    if (ev.keyCode && ev.keyCode === 13) {
                        $(this).parents('form').submit();
                    } else {
                        self.performSearch();
                    }
                });
                this.results = [];
                this.$('.clear').on('click', function () {
                    self.$('input').val('').focus();
                });
            },
            writeResults: function (results) {
                var $content = this.$('div.suggestions-results'),
                    data = {
                        pages: results || []
                    };
                if (results.length === 0) {
                    data.error = {
                        guidance: mw.msg('mobile-frontend-search-noresults')
                    };
                }
                $content.html(M.template.get('articleList').render(data));
                this.emit('write-results', results);
            },
            performSearch: function () {
                var self = this,
                    term = this.$('input').val();

                function completeSearch(data) {
                    data = $.map(data[1], function (item) {
                        return {
                            heading: highlightSearchTerm(item, term),
                            title: item,
                            url: mw.util.wikiGetlink(item)
                        };
                    });
                    self.writeResults(data);
                    self.$('input').removeClass('searching');
                }
                clearTimeout(this.timer);
                if (term.length > 0) {
                    this.timer = setTimeout(function () {
                        self.$('input').addClass('searching');
                        api.get({
                            search: term,
                            action: 'opensearch',
                            namespace: 0,
                            limit: 15
                        }).done(completeSearch);
                    }, 500);
                }
            },
            showAndFocus: function () {
                this.show();
                this.$('input').focus().select();
            }
        });
        searchOverlay = new SearchOverlay();

        function init() {
            $('#searchInput').on(M.tapEvent('touchend mouseup'), function () {
                searchOverlay.showAndFocus();
            });
        }
        init();
        M.define('search', {
            SearchOverlay: SearchOverlay,
            overlay: searchOverlay,
            highlightSearchTerm: highlightSearchTerm
        });
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var api = M.require('api'),
            w = (function () {
                var
                    popup = M.require('notifications'),
                    searchOverlay = M.require('search').overlay,
                    CtaDrawer = M.require('CtaDrawer'),
                    drawer = new CtaDrawer({
                        content: mw.msg('mobile-frontend-watchlist-cta'),
                        queryParams: {
                            campaign: 'mobile_watchPageActionCta',
                            returntoquery: 'article_action=watch'
                        }
                    });

                function logWatchEvent(eventType, token) {
                    var types = ['watchlist', 'unwatchlist', 'anonCTA'],
                        data = {
                            articleID: mw.config.get('wgArticleId'),
                            anon: mw.config.get('wgUserName') === null,
                            action: types[eventType],
                            isStable: mw.config.get('wgMFMode'),
                            token: eventType === 2 ? '+\\' : token,
                            username: mw.config.get('wgUserName') || ''
                        };
                    M.log('MobileBetaWatchlist', data);
                }

                function toggleWatch(title, token, unwatchflag, callback, errback) {
                    var data = {
                            format: 'json',
                            action: 'watch',
                            title: title,
                            token: token
                        },
                        msg = mw.msg('mobile-frontend-watchlist-add', title),
                        popupClass = 'watch-action toast';
                    if (unwatchflag) {
                        data.unwatch = true;
                        msg = mw.msg('mobile-frontend-watchlist-removed', title);
                    } else {
                        popupClass += ' watched';
                    }

                    function report() {
                        popup.show(msg, popupClass);
                    }
                    api.post(data).
                    done(callback).fail(errback).done(report);
                }

                function createButton(container) {
                    $(container).find('.watch-this-article').remove();
                    return $('<a class="watch-this-article">').appendTo(container)[0];
                }

                function createWatchListButton(container, title, isWatchedArticle) {
                    var prevent, watchBtn = createButton(container);
                    if (isWatchedArticle) {
                        $(watchBtn).addClass('watched');
                    }

                    function enable() {
                        prevent = false;
                        $(watchBtn).removeClass('disabled loading');
                    }

                    function success(data, token) {
                        if (data.watch.hasOwnProperty('watched')) {
                            logWatchEvent(0, token);
                            $(watchBtn).addClass('watched');
                        } else {
                            logWatchEvent(1, token);
                            $(watchBtn).removeClass('watched');
                        }
                        enable();
                    }

                    function toggleWatchStatus(unwatch) {
                        api.getToken('watch').done(function (token) {
                            toggleWatch(title, token, unwatch, function (data) {
                                success(data, token);
                            }, enable);
                        });
                    }
                    $(watchBtn).on(M.tapEvent('click'), function (ev) {
                        var isWatched = $(watchBtn).hasClass('watched');
                        if (prevent) {
                            ev.preventDefault();
                        }
                        prevent = true;
                        $(watchBtn).addClass('disabled loading');
                        M.emit('watched',
                            isWatched);
                        toggleWatchStatus(isWatched);
                    });
                }

                function asyncCheckWatchStatus(titles, callback) {
                    api.get({
                        action: 'query',
                        format: 'json',
                        titles: titles.join('|'),
                        prop: 'info',
                        inprop: 'watched'
                    }).done(function (data) {
                        var pages = data.query.pages,
                            statuses = {},
                            page, i;
                        for (i in pages) {
                            if (pages.hasOwnProperty(i) && i > -1) {
                                page = pages[i];
                                statuses[page.title] = page.hasOwnProperty('watched');
                            }
                        }
                        callback(statuses);
                    });
                }

                function checkWatchStatus(titles, callback) {
                    var cache = mw.config.get('wgWatchedPageCache') || {};
                    if (titles.length === 1 && typeof cache[titles[0]] !== 'undefined') {
                        callback(cache);
                    } else {
                        asyncCheckWatchStatus(titles, callback);
                    }
                }

                function initWatchListIcon(container, title) {
                    if (M.isLoggedIn()) {
                        checkWatchStatus([title], function (status) {
                            createWatchListButton(container, title, status[title]);
                        });
                    } else {
                        $(createButton(container)).on(M.tapEvent('click'), function () {
                            if (!drawer.isVisible()) {
                                logWatchEvent(2);
                                drawer.show();
                            }
                        });
                    }
                }

                function initWatchListIconList($container, allPagesAreWatched) {
                    var $items = $container.find('li'),
                        titles = [];
                    $items.each(function () {
                        titles.push($(this).attr('title'));
                    });
                    if (allPagesAreWatched) {
                        $container.find('li').each(function () {
                            var title = $(this).attr('title');
                            createWatchListButton(this, title, true);
                        });
                    } else if (M.isLoggedIn() && titles.length > 0) {
                        checkWatchStatus(titles, function (statuses) {
                            $container.find('li').each(function () {
                                var title = $(this).attr('title'),
                                    status = statuses[title];
                                if (status !== undefined) {
                                    createWatchListButton(this, title, status);
                                }
                            });
                        });
                    }
                }

                function upgradeUI() {
                    searchOverlay.on('write-results', function () {
                        initWatchListIconList(searchOverlay.$('ul'));
                    });
                }

                function init(page) {
                    var $container = $container || $('#ca-watch').removeClass('watched watch-this-article').empty();
                    if (!M.inNamespace('special')) {
                        initWatchListIcon($container, page.title);
                    }
                    upgradeUI();
                }
                M.on('page-loaded', init);
                init({
                    title: mw.config.get('wgPageName').replace(/_/gi, ' ')
                });
                return {
                    initWatchListIcon: initWatchListIcon,
                    initWatchListIconList: initWatchListIconList
                };
            }());
        M.define('watchstar', w);
    }(mw.mobileFrontend, jQuery));
    (
        function (M, $) {
            var Drawer = M.require('Drawer'),
                ReferencesDrawer, drawer;
            ReferencesDrawer = Drawer.extend({
                className: 'drawer position-fixed text references',
                template: M.template.get('ReferencesDrawer')
            });

            function getReference(id) {
                id = id.replace(/\./g, '\\.');
                return $('ol.references li' + id).html();
            }

            function showReference(ev) {
                drawer.render({
                    title: $(this).text(),
                    text: getReference($(this).attr('href'))
                });
                setTimeout($.proxy(drawer, 'show'), 0);
                ev.preventDefault();
            }

            function setup($container) {
                $container = $container || $('#content');
                $container.find('sup a').off('click').on('click', showReference);
                $container.find('.mw-cite-backlink a').off('click');
            }
            $(function () {
                drawer = new ReferencesDrawer();
                setup();
            });
            M.on('section-rendered references-loaded', setup);
            M.define('references', {
                setup: setup
            });
        }(mw.mobileFrontend, jQuery));;
}, {}, {
    "mobile-frontend-close-section": "Diesen Abschnitt schlie\u00dfen",
    "mobile-frontend-show-button": "\u003Cmobile-frontend-show-button\u003E",
    "mobile-frontend-hide-button": "\u003Cmobile-frontend-hide-button\u003E",
    "mobile-frontend-meta-data-issues": "Mit dieser Seite gibt es einige Probleme",
    "mobile-frontend-meta-data-issues-header": "Probleme",
    "mobile-frontend-last-modified-seconds": "Zuletzt ge\u00e4ndert vor {{PLURAL:$1|einer Sekunde|$1 Sekunden}}",
    "mobile-frontend-last-modified-hours": "Zuletzt ge\u00e4ndert vor {{PLURAL:$1|einer Stunde|$1 Stunden}}",
    "mobile-frontend-last-modified-minutes": "Zuletzt ge\u00e4ndert vor {{PLURAL:$1|einer Minute|$1 Minuten}}",
    "mobile-frontend-last-modified-days": "Zuletzt ge\u00e4ndert vor {{PLURAL:$1|einem Tag|$1 Tagen}}",
    "mobile-frontend-last-modified-months": "Zuletzt ge\u00e4ndert vor {{PLURAL:$1|einem Monat|$1 Monaten}}",
    "mobile-frontend-last-modified-years": "Zuletzt ge\u00e4ndert vor {{PLURAL:$1|einem Jahr|$1 Jahren}}",
    "mobile-frontend-photo-upload-disabled": "Auf dieser Seite wird kein Bild ben\u00f6tigt.",
    "mobile-frontend-photo-upload-protected": "Du hast keine Berechtigung, um ein Bild dieser Seite hinzuzuf\u00fcgen.",
    "mobile-frontend-photo-upload-anon": "Du musst angemeldet sein, um ein Bild dieser Seite hinzuzuf\u00fcgen.",
    "mobile-frontend-photo-upload-unavailable": "Das Hochladen von Bildern wird von deinem Browser nicht unterst\u00fctzt.",
    "mobile-frontend-photo-upload": "Ein Bild zu dieser Seite hinzuf\u00fcgen",
    "mobile-frontend-watchlist-add": "$1 wurde zu deiner Beobachtungsliste hinzugef\u00fcgt",
    "mobile-frontend-watchlist-removed": "$1 wurde von deiner Beobachtungsliste entfernt",
    "mobile-frontend-watchlist-cta": "Bitte melde dich an oder registriere dich, um diese Seite anzusehen.",
    "mobile-frontend-search-help": "Gib oben den Suchbegriff ein. Passende Seitennamen werden dann hier angezeigt.",
    "mobile-frontend-search-noresults": "Kein Seitentitel entspricht deiner Suche. \u00c4ndere deine Suche oder dr\u00fccke die Suchschaltfl\u00e4che deiner Tastatur, um die Suche auf den Inhalt der Seiten auszuweiten."
});
mw.loader.implement("mobile.startup", function () {
    (function (M, $) {
        var EventEmitter = M.require(
            'eventemitter');

        function matchRoute(hash, entry) {
            var match = hash.match(entry.path);
            if (match) {
                entry.callback.apply(this, match.slice(1));
                return true;
            }
            return false;
        }

        function getHash() {
            return window.location.hash.slice(1);
        }

        function Router() {
            var self = this;
            this.routes = {};
            this._enabled = true;
            this._oldHash = getHash();
            $(window).on('hashchange', function () {
                var routeEv = $.Event();
                if (self._enabled) {
                    self.emit('route', routeEv);
                    if (!routeEv.isDefaultPrevented()) {
                        self.checkRoute();
                    } else {
                        self._enabled = false;
                        window.location.hash = self._oldHash;
                    }
                } else {
                    self._enabled = true;
                }
                self._oldHash = getHash();
            });
        }
        Router.prototype = new EventEmitter();
        Router.prototype.checkRoute = function () {
            var hash = getHash();
            $.each(this.routes, function (id, entry) {
                return !matchRoute(hash, entry);
            });
        };
        Router.prototype.route = function (path, callback) {
            var entry = {
                path: typeof path === 'string' ? new RegExp('^' + path + '$') : path,
                callback: callback
            };
            this.routes[entry.path] = entry;
            matchRoute(getHash(), entry);
        };
        Router.prototype.navigate = function (path) {
            window.location.
            hash = path;
        };
        Router.prototype.isSupported = function () {
            return 'onhashchange' in window;
        };
        M.define('Router', Router);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var EventEmitter = M.require('eventemitter'),
            apiUrl = mw.config.get('wgScriptPath', '') + '/api.php',
            Api, api;
        $.ajaxSetup({
            url: apiUrl,
            dataType: 'json',
            data: {
                format: 'json'
            }
        });
        Api = EventEmitter.extend({
            apiUrl: apiUrl,
            initialize: function () {
                this.requests = [];
                this.tokenCache = {};
            },
            ajax: function (data, options) {
                var key, request, self = this;
                options = $.extend({}, options);
                if (typeof data !== 'string' && (typeof FormData === 'undefined' || !(data instanceof FormData))) {
                    for (key in data) {
                        if (data[key] === false) {
                            delete data[key];
                        } else if ($.isArray(data[key])) {
                            data[key] = data[key].join('|');
                        }
                    }
                }
                options.data = data;
                options.xhr = function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload && (mw.config.get('wgMFAjaxUploadProgressSupport'))) {
                        xhr.upload.addEventListener('progress', function (ev) {
                            if (ev.lengthComputable) {
                                self.emit('progress', request, ev.loaded / ev.total);
                            }
                        });
                    }
                    return xhr;
                };
                request = $.
                ajax(options);
                this.requests.push(request);
                return request;
            },
            get: function (data, options) {
                options = $.extend({}, options, {
                    type: 'GET'
                });
                return this.ajax(data, options);
            },
            post: function (data, options) {
                options = $.extend({}, options, {
                    type: 'POST'
                });
                return this.ajax(data, options);
            },
            abort: function () {
                this.requests.forEach(function (request) {
                    request.abort();
                });
            },
            getToken: function (tokenType, endpoint, caToken) {
                var data, d = $.Deferred(),
                    isCacheable;
                tokenType = tokenType || 'edit';
                isCacheable = tokenType !== 'centralauth';
                if (!this.tokenCache[endpoint]) {
                    this.tokenCache[endpoint] = {};
                }
                if (!M.isLoggedIn()) {
                    return d.reject('Token requested when not logged in.');
                } else if (isCacheable && this.tokenCache[endpoint].hasOwnProperty(tokenType)) {
                    return this.tokenCache[endpoint][tokenType];
                } else {
                    data = {
                        action: 'tokens',
                        type: tokenType
                    };
                    if (endpoint) {
                        data.origin = M.getOrigin();
                        if (caToken) {
                            data.centralauthtoken = caToken;
                        }
                    }
                    this.ajax(data, {
                        url: endpoint || this.apiUrl,
                        xhrFields: {
                            withCredentials: true
                        }
                    }).then(function (tokenData) {
                        var token;
                        if (tokenData &&
                            tokenData.tokens && !tokenData.warnings) {
                            token = tokenData.tokens[tokenType + 'token'];
                            if (token && token !== '+\\') {
                                d.resolve(token);
                            } else {
                                d.reject('Anonymous token.');
                            }
                        } else {
                            d.reject('Bad token name.');
                        }
                    });
                    this.tokenCache[endpoint][tokenType] = d;
                    return d;
                }
            }
        });
        api = new Api();
        api.Api = Api;
        M.define('api', api);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var Api = M.require('api').Api,
            PageApi;

        function transformSections(sections) {
            var collapseLevel = Math.min.apply(this, $.map(sections, function (s) {
                    return s.level;
                })) + '',
                result = [],
                $tmpContainer = $('<div>');
            $.each(sections, function (i, section) {
                section.line = $('<div>').html(section.line).text();
                if (!section.level || section.level === collapseLevel) {
                    result.push(section);
                } else {
                    $tmpContainer.html(section.text);
                    $tmpContainer.prepend($('<h' + section.level + '>').attr('id', section.anchor).html(section.line));
                    result[result.length - 1].text += $tmpContainer.html();
                }
            });
            return result;
        }
        PageApi = Api.extend({
            initialize: function () {
                this._super();
                this.cache = {};
            },
            getPage: function (title, endpoint,
                leadOnly) {
                var options = endpoint ? {
                        url: endpoint,
                        dataType: 'jsonp'
                    } : {},
                    page;
                if (!this.cache[title]) {
                    page = this.cache[title] = $.Deferred();
                    this.get({
                        action: 'mobileview',
                        page: title,
                        variant: mw.config.get('wgPreferredVariant'),
                        redirect: 'yes',
                        prop: 'sections|text',
                        noheadings: 'yes',
                        noimages: mw.config.get('wgImagesDisabled', false) ? 1 : undefined,
                        sectionprop: 'level|line|anchor',
                        sections: leadOnly ? 0 : 'all'
                    }, options).done(function (resp) {
                        var sections;
                        if (resp.error || !resp.mobileview.sections) {
                            page.reject(resp);
                        } else if (resp.mobileview.hasOwnProperty('liquidthreads')) {
                            page.reject({
                                error: {
                                    code: 'lqt'
                                }
                            });
                        } else {
                            sections = transformSections(resp.mobileview.sections);
                            page.resolve({
                                title: title,
                                id: -1,
                                lead: sections[0].text,
                                sections: sections.slice(1),
                                isMainPage: resp.mobileview.hasOwnProperty('mainpage') ? true : false
                            });
                        }
                    }).fail($.proxy(page, 'reject'));
                }
                return this.cache[title];
            },
            invalidatePage: function (title) {
                delete this.cache[title];
            },
            _getAllLanguages: function () {
                if (!this._languageCache) {
                    this._languageCache = this.get({
                        action: 'query',
                        meta: 'siteinfo',
                        siprop: 'languages'
                    }).then(function (data) {
                        var languages = {};
                        data.query.languages.forEach(function (item) {
                            languages[item.code] = item['*'];
                        });
                        return languages;
                    });
                }
                return this._languageCache;
            },
            getPageLanguages: function (title) {
                var self = this,
                    result = $.Deferred();
                this._getAllLanguages().done(function (allAvailableLanguages) {
                    self.get({
                        action: 'query',
                        prop: 'langlinks',
                        llurl: true,
                        lllimit: 'max',
                        titles: title
                    }).done(function (resp) {
                        var pages = $.map(resp.query.pages, function (v) {
                                return v;
                            }),
                            langlinks = pages[0] ? pages[0].langlinks || [] : [];
                        langlinks.forEach(function (item, i) {
                            langlinks[i].langname = allAvailableLanguages[item.lang];
                        });
                        result.resolve(langlinks);
                    }).fail($.proxy(result, 'reject'));
                });
                return result;
            }
        });
        M.define('PageApi', PageApi);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var Router = M.require('Router'),
            qs = window.location.search.split('?')[1],
            PageApi = M.require('PageApi'),
            $viewportMeta, viewport, ua = window.navigator.userAgent,
            isAppleDevice = /ipad|iphone/i.test(ua),
            isIPhone4 =
            isAppleDevice && /OS 4_/.test(ua),
            isOldIPhone = isAppleDevice && /OS [4]_[0-2]|OS [3]_/.test(ua),
            isIPhone5 = isAppleDevice && /OS 5_/.test(ua),
            isAndroid2 = /Android 2/.test(ua);

        function supportsPositionFixed() {
            var support = false;
            [/AppleWebKit\/(53[4-9]|5[4-9]\d?|[6-9])\d?\d?/, /Android [2-9]/, /Firefox/, /MSIE 1\d/].forEach(function (item) {
                if (item.test(navigator.userAgent)) {
                    support = true;
                }
            });
            return support;
        }

        function supportsGeoLocation() {
            return !!navigator.geolocation;
        }

        function lockViewport() {
            $viewportMeta.attr('content', 'initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }

        function unlockViewport() {
            $viewportMeta.attr('content', viewport);
        }

        function init() {
            var mode, $body = $('body'),
                $doc = $('html'),
                $viewport = $('#mw-mf-viewport55');
            if ($body.hasClass('alpha')) {
                mode = 'alpha';
            } else {
                mode = $body.hasClass('beta') ? 'beta' : 'stable';
            }
            mw.config.set('wgMFMode', mode);
            $doc.removeClass('page-loading');
            $('<div id="notifications">').appendTo($viewport);
            if (!supportsPositionFixed()) {
                $doc.addClass('no-position-fixed');
                $(window).
                on('scroll', function () {
                    var scrollTop = $(window).scrollTop(),
                        windowHeight = $(window).height(),
                        activeElement = document.activeElement,
                        scrollBottom = scrollTop + windowHeight;
                    if (isOldIPhone) {
                        if (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT') {
                            scrollBottom -= 120;
                        } else {
                            scrollBottom += 60;
                        }
                    }
                    if (scrollTop === 0) {
                        $viewport.add('.mw-mf-overlay').height('100%');
                    } else {
                        $viewport.add('.mw-mf-overlay').height(scrollBottom);
                    }
                });
            }
            $viewportMeta = $('meta[name="viewport"]');
            viewport = $viewportMeta.attr('content');
            if (viewport && viewport.indexOf('minimum-scale') === -1) {
                viewport += ', minimum-scale=0.25, maximum-scale=1.6';
            }

            function fixBrowserBugs() {
                if ($viewportMeta[0] && (isIPhone4 || isIPhone5)) {
                    lockViewport();
                    document.addEventListener('gesturestart', function () {
                        lockViewport();
                    }, false);
                }
                if (isAndroid2) {
                    $body.addClass('android2');
                    lockViewport();
                }
            }
            fixBrowserBugs();

            function supportsAnimations() {
                var el = $('<p>')[0],
                    $iframe = $('<iframe>'),
                    has3d, t, transforms = {
                        'webkitTransform': '-webkit-transform',
                        'transform': 'transform'
                    };
                if (isAndroid2) {
                    return false;
                }
                $iframe.appendTo($body).contents().find('body').append(el);
                for (t in transforms) {
                    if (el.style[t] !== undefined) {
                        el.style[t] = 'translate3d(1px,1px,1px)';
                        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                    }
                }
                $iframe.remove();
                return has3d !== undefined && has3d.length > 0 && has3d !== "none";
            }
            if (mw.config.get('wgMFEnableCssAnimations') && supportsAnimations()) {
                $doc.addClass('animations');
            }
        }

        function isLoggedIn() {
            return mw.config.get('wgUserName') ? true : false;
        }

        function getOrigin() {
            return window.location.protocol + '//' + window.location.hostname;
        }

        function prettyEncodeTitle(title) {
            return encodeURIComponent(title.replace(/ /g, '_')).replace(/%3A/g, ':').replace(/%2F/g, '/');
        }

        function log(schemaName, data) {
            if (mw.eventLog) {
                return mw.eventLog.logEvent(schemaName, data);
            } else {
                return $.Deferred().reject('EventLogging not installed.');
            }
        }

        function getSessionId() {
            var sessionId;
            if (typeof localStorage === 'undefined') {
                return null;
            }
            sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
                sessionId = '';
                while (sessionId.length < 32) {
                    sessionId += Math.random().toString(36).slice(2, 32 + 2 - sessionId.length);
                }
                localStorage.setItem('sessionId', sessionId);
            }
            return sessionId;
        }

        function deParam(qs) {
            var params = {};
            if (qs) {
                qs.split('&').forEach(function (p) {
                    p = p.split('=');
                    params[p[0]] = p[1];
                });
            }
            return params;
        }

        function isWideScreen() {
            return window.innerWidth > mw.config.get('wgMFDeviceWidthTablet');
        }

        function reloadPage(page) {
            if (page.isMainPage()) {
                $('body').addClass('page-Main_Page');
            } else {
                $('body').removeClass('page-Main_Page');
            }
            mw.config.set('wgArticleId', page.id);
            M.emit('page-loaded', page);
            document.title = page.title;
        }

        function inNamespace(namespace) {
            return mw.config.get('wgNamespaceNumber') === mw.config.get('wgNamespaceIds')[namespace];
        }
        $(init);
        $.extend(M, {
            init: init,
            inNamespace: inNamespace,
            jQuery: typeof jQuery !== 'undefined' ? jQuery : false,
            getOrigin: getOrigin,
            getLeadSection: function () {
                return $('#content div').eq(0);
            },
            getSessionId: getSessionId,
            isLoggedIn: isLoggedIn,
            isWideScreen: isWideScreen,
            lockViewport: lockViewport,
            log: log,
            reloadPage: reloadPage,
            supportsGeoLocation: supportsGeoLocation,
            supportsPositionFixed: supportsPositionFixed,
            prettyEncodeTitle: prettyEncodeTitle,
            query: deParam(qs),
            template: mw.template,
            unlockViewport: unlockViewport,
            router: new Router(),
            pageApi: new PageApi(),
            deParam: deParam,
            isTestA: mw.config.get('wgUserId') % 2 === 0,
            tapEvent: function (fallbackEvent) {
                return mw.config.get('wgMFMode') === 'alpha' ? 'tap' : fallbackEvent;
            }
        });
    }(mw.mobileFrontend, jQuery));
    (function (M) {
        M.settings = (function () {
            var supportsLocalStorage;
            try {
                supportsLocalStorage = 'localStorage' in window && window.localStorage !== null;
            } catch (e) {
                supportsLocalStorage = false;
            }

            function writeCookie(name, value, days, path, domain) {
                var date, expires, cookie;
                if (days) {
                    date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = '; expires=' + date.toGMTString();
                } else {
                    expires = '';
                } if (typeof path === 'undefined') {
                    path = '/';
                }
                cookie = name + '=' + value + expires + '; path=' + path;
                if (typeof domain !== 'undefined') {
                    cookie = cookie + '; domain=' +
                        domain;
                }
                document.cookie = cookie;
            }

            function readCookie(name) {
                var nameVA = name + '=',
                    ca = document.cookie.split(';'),
                    c, i;
                for (i = 0; i < ca.length; i++) {
                    c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1, c.length);
                    }
                    if (c.indexOf(nameVA) === 0) {
                        return c.substring(nameVA.length, c.length);
                    }
                }
                return null;
            }

            function removeCookie(name) {
                writeCookie(name, '', -1);
                return null;
            }

            function saveUserSetting(name, value, useCookieFallback) {
                return supportsLocalStorage ? localStorage.setItem(name, value) : (useCookieFallback ? writeCookie(name, value, 1) : false);
            }

            function getUserSetting(name, useCookieFallback) {
                return supportsLocalStorage ? localStorage.getItem(name) : (useCookieFallback ? readCookie(name) : false);
            }
            return {
                getUserSetting: getUserSetting,
                readCookie: readCookie,
                removeCookie: removeCookie,
                saveUserSetting: saveUserSetting,
                supportsLocalStorage: supportsLocalStorage,
                writeCookie: writeCookie
            };
        }());
    }(mw.mobileFrontend));
    (function (M, $) {
        var writeCookie = M.settings.writeCookie;

        function desktopViewClick() {
            var useFormatCookie = mw.config.get(
                    'wgUseFormatCookie'),
                redirectCookie = mw.config.get('wgStopMobileRedirectCookie');
            writeCookie(useFormatCookie.name, '', useFormatCookie.duration, useFormatCookie.path, useFormatCookie.domain);
            writeCookie(redirectCookie.name, 'true', redirectCookie.duration, redirectCookie.path, redirectCookie.domain);
        }
        $('#mw-mf-display-toggle').on('click', desktopViewClick);
    }(mw.mobileFrontend, jQuery));;
}, {}, {});
mw.loader.implement("mobile.templates", function () {
    var Hogan = {};
    (function (Hogan, useArrayBuffer) {
        Hogan.Template = function (renderFunc, text, compiler, options) {
            this.r = renderFunc || this.r;
            this.c = compiler;
            this.options = options;
            this.text = text || '';
            this.buf = (useArrayBuffer) ? [] : '';
        }
        Hogan.Template.prototype = {
            r: function (context, partials, indent) {
                return '';
            },
            v: hoganEscape,
            t: coerceToString,
            render: function render(context, partials, indent) {
                return this.ri([context], partials || {}, indent);
            },
            ri: function (context, partials, indent) {
                return this.r(context, partials, indent);
            },
            rp: function (name, context, partials, indent) {
                var partial = partials[name];
                if (!partial) {
                    return '';
                }
                if (this.c && typeof partial == 'string') {
                    partial = this.c.compile(partial, this.options);
                }
                return partial.ri(context, partials, indent);
            },
            rs: function (context, partials, section) {
                var tail = context[context.length - 1];
                if (!isArray(tail)) {
                    section(context, partials, this);
                    return;
                }
                for (var i = 0; i < tail.length; i++) {
                    context.push(tail[i]);
                    section(context, partials, this);
                    context.pop();
                }
            },
            s: function (val, ctx, partials, inverted, start, end, tags) {
                var pass;
                if (isArray(val) && val.length === 0) {
                    return false;
                }
                if (typeof val == 'function') {
                    val = this.ls(val, ctx, partials, inverted, start, end, tags);
                }
                pass = (val === '') || !!val;
                if (!inverted && pass && ctx) {
                    ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
                }
                return pass;
            },
            d: function (key, ctx, partials, returnFound) {
                var names = key.split('.'),
                    val = this.f(names[0], ctx, partials, returnFound),
                    cx = null;
                if (key === '.' && isArray(ctx[ctx.length - 2])) {
                    return ctx[ctx.length - 1];
                }
                for (var i = 1; i < names.length; i++) {
                    if (val && typeof val == 'object' && names[i] in val) {
                        cx = val;
                        val = val[names[i]];
                    } else {
                        val = '';
                    }
                }
                if (returnFound && !val) {
                    return false;
                }
                if (!returnFound && typeof val == 'function') {
                    ctx.push(cx);
                    val = this.lv(val, ctx, partials);
                    ctx.pop();
                }
                return val;
            },
            f: function (key, ctx, partials, returnFound) {
                var val = false,
                    v = null,
                    found = false;
                for (var i = ctx.length - 1; i >= 0; i--) {
                    v = ctx[i];
                    if (v && typeof v == 'object' && key in v) {
                        val = v[key];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return (returnFound) ? false : "";
                }
                if (!returnFound && typeof val == 'function') {
                    val = this.lv(val, ctx, partials);
                }
                return val;
            },
            ho: function (val, cx, partials, text, tags) {
                var compiler = this.c;
                var options = this.options;
                options.delimiters = tags;
                var text = val.call(cx, text);
                text = (text == null) ? String(text) : text.toString();
                this.b(compiler.compile(text, options).render(cx, partials));
                return false;
            },
            b: (useArrayBuffer) ? function (s) {
                this.buf.push(s);
            } : function (s) {
                this.buf += s;
            },
            fl: (useArrayBuffer) ? function () {
                var r = this.buf.join('');
                this.buf = [];
                return r;
            } : function () {
                var r = this.buf;
                this.buf = '';
                return r;
            },
            ls: function (val, ctx, partials, inverted, start, end, tags) {
                var cx = ctx[ctx.length - 1],
                    t = null;
                if (!inverted && this.c && val.length > 0) {
                    return this.ho(val, cx, partials, this.text.substring(start, end), tags);
                }
                t = val.call(cx);
                if (typeof t == 'function') {
                    if (inverted) {
                        return true;
                    } else if (this.c) {
                        return this.ho(t, cx, partials, this.text.substring(start, end), tags);
                    }
                }
                return t;
            },
            lv: function (val, ctx, partials) {
                var cx = ctx[ctx.length - 1];
                var result = val.call(cx);
                if (typeof result == 'function') {
                    result = coerceToString(result.call(cx));
                    if (this.c && ~result.indexOf("{\u007B")) {
                        return this.c.compile(result, this.options).render(cx, partials);
                    }
                }
                return coerceToString(result);
            }
        };
        var rAmp = /&/g,
            rLt = /</g,
            rGt = />/g,
            rApos = /\'/g,
            rQuot = /\"/g,
            hChars = /[&<>\"\']/;

        function coerceToString(val) {
            return String((val === null || val === undefined) ? '' : val);
        }

        function hoganEscape(str) {
            str = coerceToString(str);
            return hChars.test(str) ? str.replace(rAmp, '&amp;').replace(rLt, '&lt;').replace(rGt, '&gt;').replace(rApos, '&#39;').replace(rQuot, '&quot;') : str;
        }
        var isArray = Array.isArray || function (a) {
            return Object.prototype.toString.call(a) === '[object Array]';
        };
    })(typeof exports !== 'undefined' ? exports : Hogan);
    (function (Hogan) {
        var rIsWhitespace = /\S/,
            rQuot = /\"/g,
            rNewline = /\n/g,
            rCr = /\r/g,
            rSlash = /\\/g,
            tagTypes = {
                '#': 1,
                '^': 2,
                '/': 3,
                '!': 4,
                '>': 5,
                '<': 6,
                '=': 7,
                '_v': 8,
                '{': 9,
                '&': 10
            };
        Hogan.scan = function scan(text, delimiters) {
            var len = text.length,
                IN_TEXT = 0,
                IN_TAG_TYPE = 1,
                IN_TAG = 2,
                state = IN_TEXT,
                tagType = null,
                tag = null,
                buf = '',
                tokens = [],
                seenTag = false,
                i = 0,
                lineStart = 0,
                otag = '{{',
                ctag = '}}';

            function addBuf() {
                if (buf.length > 0) {
                    tokens.push(new String(buf));
                    buf = '';
                }
            }

            function lineIsWhitespace() {
                var isAllWhitespace = true;
                for (var j = lineStart; j < tokens.length; j++) {
                    isAllWhitespace = (tokens[j].tag && tagTypes[tokens[j].tag] < tagTypes['_v']) || (!
                        tokens[j].tag && tokens[j].match(rIsWhitespace) === null);
                    if (!isAllWhitespace) {
                        return false;
                    }
                }
                return isAllWhitespace;
            }

            function filterLine(haveSeenTag, noNewLine) {
                addBuf();
                if (haveSeenTag && lineIsWhitespace()) {
                    for (var j = lineStart, next; j < tokens.length; j++) {
                        if (!tokens[j].tag) {
                            if ((next = tokens[j + 1]) && next.tag == '>') {
                                next.indent = tokens[j].toString()
                            }
                            tokens.splice(j, 1);
                        }
                    }
                } else if (!noNewLine) {
                    tokens.push({
                        tag: '\n'
                    });
                }
                seenTag = false;
                lineStart = tokens.length;
            }

            function changeDelimiters(text, index) {
                var close = '=' + ctag,
                    closeIndex = text.indexOf(close, index),
                    delimiters = trim(text.substring(text.indexOf('=', index) + 1, closeIndex)).split(' ');
                otag = delimiters[0];
                ctag = delimiters[1];
                return closeIndex + close.length - 1;
            }
            if (delimiters) {
                delimiters = delimiters.split(' ');
                otag = delimiters[0];
                ctag = delimiters[1];
            }
            for (i = 0; i < len; i++) {
                if (state == IN_TEXT) {
                    if (tagChange(otag, text, i)) {
                        --i;
                        addBuf();
                        state = IN_TAG_TYPE;
                    } else {
                        if (text.charAt(i) == '\n') {
                            filterLine(seenTag);
                        } else {
                            buf += text.charAt(i);
                        }
                    }
                } else if (state == IN_TAG_TYPE) {
                    i += otag.length - 1;
                    tag = tagTypes[text.charAt(i + 1)];
                    tagType = tag ? text.charAt(i + 1) : '_v';
                    if (tagType == '=') {
                        i = changeDelimiters(text, i);
                        state = IN_TEXT;
                    } else {
                        if (tag) {
                            i++;
                        }
                        state = IN_TAG;
                    }
                    seenTag = i;
                } else {
                    if (tagChange(ctag, text, i)) {
                        tokens.push({
                            tag: tagType,
                            n: trim(buf),
                            otag: otag,
                            ctag: ctag,
                            i: (tagType == '/') ? seenTag - ctag.length : i + otag.length
                        });
                        buf = '';
                        i += ctag.length - 1;
                        state = IN_TEXT;
                        if (tagType == '{') {
                            if (ctag == '}}') {
                                i++;
                            } else {
                                cleanTripleStache(tokens[tokens.length - 1]);
                            }
                        }
                    } else {
                        buf += text.charAt(i);
                    }
                }
            }
            filterLine(seenTag, true);
            return tokens;
        }

        function cleanTripleStache(token) {
            if (token.n.substr(token.n.length - 1) === '}') {
                token.n = token.n.substring(0, token.n.length - 1);
            }
        }

        function trim(s) {
            if (s.trim) {
                return s.trim();
            }
            return s.replace(/^\s*|\s*$/g, '');
        }

        function tagChange(tag, text, index) {
            if (text.charAt(index) != tag.charAt(0)) {
                return false;
            }
            for (var i = 1, l = tag.length; i < l; i++) {
                if (text.charAt(index + i) != tag.charAt(i)) {
                    return false;
                }
            }
            return true;
        }

        function buildTree(tokens, kind, stack, customTags) {
            var instructions = [],
                opener = null,
                token = null;
            while (tokens.length > 0) {
                token = tokens.shift();
                if (token.tag == '#' || token.tag == '^' || isOpener(token, customTags)) {
                    stack.push(token);
                    token.nodes = buildTree(tokens, token.tag, stack, customTags);
                    instructions.push(token);
                } else if (token.tag == '/') {
                    if (stack.length === 0) {
                        throw new Error('Closing tag without opener: /' + token.n);
                    }
                    opener = stack.pop();
                    if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
                        throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
                    }
                    opener.end = token.i;
                    return instructions;
                } else {
                    instructions.
                    push(token);
                }
            }
            if (stack.length > 0) {
                throw new Error('missing closing tag: ' + stack.pop().n);
            }
            return instructions;
        }

        function isOpener(token, tags) {
            for (var i = 0, l = tags.length; i < l; i++) {
                if (tags[i].o == token.n) {
                    token.tag = '#';
                    return true;
                }
            }
        }

        function isCloser(close, open, tags) {
            for (var i = 0, l = tags.length; i < l; i++) {
                if (tags[i].c == close && tags[i].o == open) {
                    return true;
                }
            }
        }
        Hogan.generate = function (tree, text, options) {
            var code = 'var _=this;_.b(i=i||"");' + walk(tree) + 'return _.fl();';
            if (options.asString) {
                return 'function(c,p,i){' + code + ';}';
            }
            return new Hogan.Template(new Function('c', 'p', 'i', code), text, Hogan, options);
        }

        function esc(s) {
            return s.replace(rSlash, '\\\\').replace(rQuot, '\\\"').replace(rNewline, '\\n').replace(rCr, '\\r');
        }

        function chooseMethod(s) {
            return (~s.indexOf('.')) ? 'd' : 'f';
        }

        function walk(tree) {
            var code = '';
            for (var i = 0, l = tree.length; i < l; i++) {
                var tag = tree[i].tag;
                if (tag == '#') {
                    code += section(tree[i].nodes, tree[i].n, chooseMethod(tree[i].n), tree[i].i, tree[i].end, tree[i].otag + " " + tree[i].ctag);
                } else if (tag == '^') {
                    code += invertedSection(tree[i].nodes, tree[i].n, chooseMethod(tree[i].n));
                } else if (tag == '<' || tag == '>') {
                    code += partial(tree[i]);
                } else if (tag == '{' || tag == '&') {
                    code += tripleStache(tree[i].n, chooseMethod(tree[i].n));
                } else if (tag == '\n') {
                    code += text('"\\n"' + (tree.length - 1 == i ? '' : ' + i'));
                } else if (tag == '_v') {
                    code += variable(tree[i].n, chooseMethod(tree[i].n));
                } else if (tag === undefined) {
                    code += text('"' + esc(tree[i]) + '"');
                }
            }
            return code;
        }

        function section(nodes, id, method, start, end, tags) {
            return 'if(_.s(_.' + method + '("' + esc(id) + '",c,p,1),' + 'c,p,0,' + start + ',' + end + ',"' + tags + '")){' + '_.rs(c,p,' + 'function(c,p,_){' + walk(
                nodes) + '});c.pop();}';
        }

        function invertedSection(nodes, id, method) {
            return 'if(!_.s(_.' + method + '("' + esc(id) + '",c,p,1),c,p,1,0,0,"")){' + walk(nodes) + '};';
        }

        function partial(tok) {
            return '_.b(_.rp("' + esc(tok.n) + '",c,p,"' + (tok.indent || '') + '"));';
        }

        function tripleStache(id, method) {
            return '_.b(_.t(_.' + method + '("' + esc(id) + '",c,p,0)));';
        }

        function variable(id, method) {
            return '_.b(_.v(_.' + method + '("' + esc(id) + '",c,p,0)));';
        }

        function text(id) {
            return '_.b(' + id + ');';
        }
        Hogan.parse = function (tokens, text, options) {
            options = options || {};
            return buildTree(tokens, '', [], options.sectionTags || []);
        }, Hogan.cache = {};
        Hogan.compile = function (text, options) {
            options = options || {};
            var key = text + '||' + !!options.asString;
            var t = this.cache[key];
            if (t) {
                return t;
            }
            t = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
            return this.cache[key] = t;
        };
    })(typeof exports !== 'undefined' ? exports : Hogan);
    (function ($) {
        var templates = {},
            template = {
                add: function (name, markup) {
                    templates[name] = this.compile(markup);
                },
                get: function (name) {
                    if (!templates[name]) {
                        throw new Error('Template not found: ' + name);
                    }
                    return templates[name];
                },
                compile: function (templateBody) {
                    return Hogan.compile(templateBody);
                }
            };
        $.extend(mw, {
            template: template
        });
    }(jQuery));;
}, {}, {});
mw.loader.implement("mobile.stable.common", function () {
    mw.template.add("LoadingOverlay", "\u003Cdiv class=\"header\"\u003E\n\t\u003Cbutton class=\"cancel\"\u003E{{closeMsg}}\u003C/button\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"spinner loading\"\u003E\u003C/div\u003E\n");
    mw.template.add("section", "{{#heading}}\n\u003Ch2\u003E\n\t\u003Cspan id=\"{{anchor}}\"\u003E{{{heading}}}\u003C/span\u003E\n\t\u003Ca href=\"#editor/{{id}}\" data-section=\"{{id}}\" class=\"edit-page\"\u003E{{editLabel}}\u003C/a\u003E\n\u003C/h2\u003E\n{{/heading}}\n\u003Cdiv\u003E\n{{{content}}}\n\u003C/div\u003E\n");
    mw.template.add("wikitext/commons-upload",
        "{{=\u003C% %\u003E=}}\n== {{int:filedesc}} ==\n{{Information\n|description=\u003C%text%\u003E\n|source={{own}}\n|author=[[User:\u003C%username%\u003E]]\n}}\u003C%suffix%\u003E\n\n== {{int:license-header}} ==\n{{self|cc-by-sa-3.0}}\n");
    mw.template.add("overlays/languages",
        "\u003Cdiv class=\"header\"\u003E\n\t\u003Cbutton class=\"cancel\"\u003E{{closeMsg}}\u003C/button\u003E\n\t\u003Cdiv class=\"search-box\"\u003E\n\t\t\u003Cinput type=\"search\" class=\"search\" placeholder=\"{{placeholder}}\"\u003E\n\t\u003C/div\u003E\n\u003C/div\u003E\n{{#variantHeader}}\n\u003Cp class=\"mw-mf-overlay-header\"\u003E{{{variantHeader}}}\u003C/p\u003E\n\u003Cul class=\"actionable\"\u003E\n\t{{#variants}}\n\t\t\u003Cli\u003E\n\t\t\t\u003Ca href=\"{{url}}\" hreflang=\"{{lang}}\" lang=\"{{lang}}\"\u003E\u003Cspan\u003E{{langName}}\u003C/span\u003E{{#pageName}}  ({{pageName}}){{/pageName}}\u003C/a\u003E\n\t\t\u003C/li\u003E\n\t{{/variants}}\n\u003C/ul\u003E\n{{/variantHeader}}\n{{#header}}\n\u003Cp class=\"mw-mf-overlay-header\"\u003E{{{header}}}\u003C/p\u003E\n\u003Cul class=\"actionable\"\u003E\n\t{{#languages}}\n\t\t\u003Cli {{#preferred}}class=\"preferred\"{{/preferred}}\u003E\n\t\t\t\u003Ca href=\"{{url}}\" hreflang=\"{{lang}}\" lang=\"{{lang}}\"\u003E\u003Cspan\u003E{{langName}}\u003C/span\u003E{{#pageName}} ({{pageName}}){{/pageName}}\u003C/a\u003E\n\t\t\u003C/li\u003E\n\t{{/languages}}\n\u003C/ul\u003E\n{{/header}}\n\u003Cp class=\"mw-mf-overlay-footer\" style=\"display:none\"\u003E\n\t\u003Ca href=\"{{languagesLink}}\"\u003E{{languagesText}}\u003C/a\u003E\n\u003C/p\u003E\n"
    );
    mw.template.add("overlay", "\u003Cdiv class=\"header\"\u003E\n\t\u003Cbutton class=\"cancel\"\u003E{{closeMsg}}\u003C/button\u003E\n\t{{{heading}}}\n\u003C/div\u003E\n{{{content}}}\n");
    mw.template.add("overlays/cleanup", "\u003Cdiv class=\"header\"\u003E\n\t\u003Cbutton class=\"cancel\"\u003E{{closeMsg}}\u003C/button\u003E\n\t\u003Ch2\u003E{{heading}}\u003C/h2\u003E\n\u003C/div\u003E\n\u003Cul class=\"cleanup\"\u003E\n\t{{#issues}}\n\t\u003Cli\u003E\u003Cimg src=\"{{icon}}\"\u003E {{{text}}}\u003C/li\u003E\n\t{{/issues}}\n\u003C/ul\u003E\n");
    mw.template.add("articleList",
        "{{#error}}\n\u003Cdiv class=\"alert error\"\u003E\n\t{{#heading}}\u003Ch2\u003E{{heading}}\u003C/h2\u003E{{/heading}}\n\t\u003Cp\u003E{{guidance}}\u003C/p\u003E\n\u003C/div\u003E\n{{/error}}\n{{#loadingMessage}}\n\u003Cdiv class=\"content loading\"\u003E{{loadingMessage}}\u003C/div\u003E\n{{/loadingMessage}}\n\u003Cul class=\"page-list a-to-z actionable\"\u003E\n\t{{#pages}}\n\t\u003Cli title=\"{{title}}\"\u003E\n\t\t\u003Ca href=\"{{url}}\" class=\"title\" name=\"{{anchor}}\" data-latlng=\"{{latitude}},{{longitude}}\" data-title=\"{{title}}\"\u003E\n\t\t\t\u003Cdiv class=\"listThumb {{pageimageClass}}\" style=\"{{listThumbStyleAttribute}}\"\u003E\u003C/div\u003E\n\t\t\t\u003Ch2\u003E{{{heading}}}\u003C/h2\u003E\n\t\t\t\u003Cdiv class=\"info proximity\"\u003E{{proximity}}\u003C/div\u003E\n\t\t\u003C/a\u003E\n\t\u003C/li\u003E\n\t{{/pages}}\n\u003C/ul\u003E\n");
    mw.template.add("overlays/search/search",
        "\u003Cdiv class=\"header\"\u003E\n\t\u003Cbutton class=\"cancel\"\u003E{{closeMsg}}\u003C/button\u003E\n\t\u003Cform class=\"search-box\" method=\"get\" action=\"{{action}}\"\u003E\n\t\t\u003Cinput type=\"search\" class=\"search\" name=\"search\"\u003E\n\t\t\u003Ca class=\"clear\"\u003E\u003C/a\u003E\n\t\u003C/form\u003E\n\u003C/div\u003E\n\u003Cdiv class=\"suggestions-results\"\u003E\n\t\u003Cp class=\"mw-mf-overlay-header\"\u003E{{explanation}}\u003C/p\u003E\n\u003C/div\u003E\n");
    mw.template.add("page",
        "\u003Ch1 id=\"section_0\"\u003E{{title}}\u003C/h1\u003E\n\u003Cul id=\"page-actions\" class=\"hlist\"\u003E\n\t\u003Cli id=\"ca-edit\"\u003E\u003C/li\u003E\u003Cli id=\"ca-upload\"\u003E\n\t\u003C/li\u003E\u003Cli id=\"ca-talk\" class=\"{{#isTalkPage}}selected{{/isTalkPage}}\"\u003E\u003Ca href=\"{{talkLink}}\" id=\"talk\"\u003E{{talkLabel}}\u003C/a\u003E\n\t\u003C/li\u003E\u003Cli id=\"ca-watch\"\u003E\u003C/li\u003E\n\u003C/ul\u003E\n\u003Cdiv id=\"content\" class=\"content\"\u003E\n\t\u003Cdiv\u003E{{{lead}}}\u003C/div\u003E\n\t{{#sections}}\n\t\u003Ch2 data-id=\"{{id}}\"\u003E\n\t\t\u003Cspan id=\"{{anchor}}\"\u003E{{{line}}}\u003C/span\u003E\n\t\t\u003Ca href=\"#editor/{{id}}\" data-section=\"{{id}}\" class=\"edit-page\"\u003E{{editLabel}}\u003C/a\u003E\n\t\u003C/h2\u003E\n\t\u003Cdiv\n\t\tdata-references=\"{{isReferences}}\"\n\t\tdata-content=\"{{text}}\"\u003E\n\t\u003C/div\u003E\n\t{{/sections}}\n\t{{#inBetaOrAlpha}}\u003Cdiv id=\"page-secondary-actions\"\u003E{{/inBetaOrAlpha}}\n\t\u003Cdiv class=\"section\" id=\"mw-mf-language-section\"\u003E\u003C/div\u003E\n\t{{#inBetaOrAlpha}}\u003C/div\u003E{{/inBetaOrAlpha}}\n\t\u003Ca href=\"{{historyUrl}}\" id=\"mw-mf-last-modified\" data-timestamp=\"{{lastModifiedTimestamp}}\"\u003E\u003C/a\u003E\n\u003C/div\u003E\n"
    );
    mw.template.add("languageSection", "\u003Ch2 id=\"section_language\" class=\"section_heading\"\u003E{{heading}}\u003C/h2\u003E\n\u003Cdiv id=\"content_language\"\u003E\n\t\u003Cp id=\"mw-mf-language-header\"\u003E{{description}}\u003C/p\u003E\n\t\u003Cul id=\"mw-mf-language-selection\"\u003E\n\t{{#langlinks}}\n\t\t\u003Cli\u003E\n\t\t\t\u003Ca href=\"{{url}}\" hreflang=\"{{lang}}\" lang=\"{{lang}}\" title=\"{{*}}\"\u003E{{langname}}\u003C/a\u003E\n\t\t\u003C/li\u003E\n\t{{/langlinks}}\n\t\u003C/ul\u003E\n\u003C/div\u003E\n");
    mw.template.add("uploads/LeadPhotoUploaderButton", "\u003Cinput name=\"file\" type=\"file\"\u003E{{buttonCaption}}\n");
    mw.template.add("uploads/PhotoUploaderButton", "{{buttonCaption}}\n\u003Cdiv\u003E\u003Cinput name=\"file\" type=\"file\"\u003E\u003C/div\u003E\n");
    mw.template.add("ctaDrawer",
        "\u003Ca class=\"close\" href=\"#\"\u003E{{cancelMessage}}\u003C/a\u003E\n\u003Cp\u003E{{content}}\u003C/p\u003E\n\u003Cdiv class=\"buttonBar\"\u003E\n\t\u003Ca class=\"button wide\" href=\"{{loginUrl}}\"\u003E{{loginCaption}}\u003C/a\u003E\n\t\u003Ca class=\"signup\" href=\"{{signupUrl}}\"\u003E{{signupCaption}}\u003C/a\u003E\n\u003C/div\u003E\n");
    mw.template.add("ReferencesDrawer", "\u003Cbutton\u003E\u003C/button\u003E\n\u003Ch3\u003E{{title}}\u003C/h3\u003E\n{{{text}}}\n\n");
    (function (M, $) {
        var EventEmitter = M.require('eventemitter'),
            View;
        View = EventEmitter.extend({
            tagName: 'div',
            initialize: function (options) {
                this._super();
                options = $.extend({}, this.defaults, options);
                if (options.el) {
                    this.$el = $(options.el);
                } else {
                    this.$el = $('<' + this.tagName + '>');
                }
                this.$el.addClass(this.className);
                if (typeof this.template === 'string') {
                    this.template = M.template.compile(this.template);
                }
                this.options = options;
                this.render(options);
            },
            preRender: function () {},
            postRender: function () {},
            render: function (data) {
                data = $.extend(true, {}, this.options, data);
                this.preRender(data);
                if (this.template) {
                    this.$el.html(this.template.render(data));
                }
                this.postRender(data);
                return this;
            },
            $: function (query) {
                return this.$el.find(query);
            }
        });
        ['append', 'prepend', 'appendTo', 'prependTo', 'after', 'before', 'insertAfter', 'insertBefore', 'remove', 'detach'].forEach(function (prop) {
            View.prototype[prop] = function () {
                this.$el[prop].apply(this.$el, arguments);
                return this;
            };
        });
        M.define('view', View);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var View = M.require('view'),
            Drawer = View.extend({
                defaults: {
                    cancelMessage: mw.msg('mobile-frontend-drawer-cancel')
                },
                className: 'drawer position-fixed',
                minHideDelay: 0,
                postRender: function () {
                    var self = this;
                    this.$('.close').click(function (ev) {
                        ev.preventDefault();
                        self.hide();
                    });
                    this.appendTo('#notifications');
                },
                show: function () {
                    var self = this;
                    if (!self.isVisible()) {
                        setTimeout(function () {
                            self.$el.addClass('visible');
                            if (!self.locked) {
                                setTimeout(function () {
                                    $(window).one('scroll.drawer', $.proxy(self, 'hide'));
                                    $(
                                        '#mw-mf-page-center, .mw-mf-overlay').one(M.tapEvent('click') + '.drawer', $.proxy(self, 'hide'));
                                }, self.minHideDelay);
                            }
                        }, 10);
                    }
                },
                hide: function () {
                    var self = this;
                    setTimeout(function () {
                        self.$el.removeClass('visible');
                        $(window).off('.drawer');
                        $('#mw-mf-page-center, .mw-mf-overlay').off('.drawer');
                    }, 10);
                },
                isVisible: function () {
                    return this.$el.hasClass('visible');
                },
                toggle: function () {
                    if (this.isVisible()) {
                        this.hide();
                    } else {
                        this.show();
                    }
                }
            });
        M.define('Drawer', Drawer);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var Drawer = M.require('Drawer'),
            CtaDrawer = Drawer.extend({
                defaults: {
                    loginCaption: mw.msg('mobile-frontend-watchlist-cta-button-login'),
                    signupCaption: mw.msg('mobile-frontend-watchlist-cta-button-signup'),
                    cancelMessage: mw.msg('mobile-frontend-drawer-cancel')
                },
                template: M.template.get('ctaDrawer'),
                preRender: function (options) {
                    var params = $.extend({
                        returnto: options.returnTo || mw.config.get('wgPageName')
                    }, options.queryParams);
                    options.loginUrl = mw.util.wikiGetlink('Special:UserLogin', params);
                    options.signupUrl = mw.util.wikiGetlink('Special:UserLogin', $.extend(params, {
                        type: 'signup'
                    }));
                }
            });
        M.define('CtaDrawer', CtaDrawer);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var View = M.require('view'),
            Overlay = View.extend({
                defaults: {
                    heading: '',
                    content: '',
                    closeMsg: mw.msg('mobile-frontend-overlay-escape')
                },
                template: M.template.get('overlay'),
                className: 'mw-mf-overlay',
                closeOnBack: false,
                fullScreen: true,
                appendTo: '#mw-mf-viewport55',
                initialize: function (options) {
                    options = options || {};
                    this.parent = options.parent;
                    this.isOpened = false;
                    this._super(options);
                },
                postRender: function () {
                    var self = this;
                    this.$('.cancel, .confirm').on(M.tapEvent('click'), function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        if (self.closeOnBack) {
                            window.history.back();
                        } else {
                            self.hide();
                        }
                    });
                },
                show: function () {
                    var self = this;

                    function hideOnRoute() {
                        M.router.one('route', function (ev) {
                            if (!self.hide()) {
                                ev.preventDefault();
                                hideOnRoute();
                            }
                        });
                    }
                    if (this.closeOnBack) {
                        hideOnRoute();
                    }
                    if (this.parent) {
                        this.parent.hide();
                    }
                    this.$el.appendTo(this.appendTo);
                    this.scrollTop =
                        document.body.scrollTop;
                    if (this.fullScreen) {
                        $('html').addClass('overlay-enabled');
                        window.scrollTo(0, 1);
                    } else {
                        $('#mw-mf-page-center').one(M.tapEvent('click'), $.proxy(this, 'hide'));
                    }
                    $('body').removeClass('navigation-enabled');
                },
                hide: function () {
                    this.$el.detach();
                    if (this.parent) {
                        this.parent.show();
                    } else if (this.fullScreen) {
                        $('html').removeClass('overlay-enabled');
                        window.scrollTo(document.body.scrollLeft, this.scrollTop);
                    }
                    return true;
                }
            });
        M.define('Overlay', Overlay);
    }(mw.mobileFrontend, jQuery));
    (function (M) {
        var Overlay = M.require('Overlay'),
            LoadingOverlay;
        LoadingOverlay = Overlay.extend({
            template: M.template.get('LoadingOverlay')
        });
        M.define('LoadingOverlay', LoadingOverlay);
    }(mw.mobileFrontend));
    (function (M) {
        var View = M.require('view'),
            ProgressBar;
        ProgressBar = View.extend({
            className: 'progress-bar',
            template: '<div class="value"></div>',
            setValue: function (value) {
                this.$('.value').css('width', value * 100 + '%');
            }
        });
        M.define('widgets/progress-bar', ProgressBar);
    }(mw.mobileFrontend));
    (function (M) {
        var Drawer = M.
        require('Drawer'), Toast;
        Toast = Drawer.extend({
            className: 'toast position-fixed',
            minHideDelay: 1000,
            show: function (content, className) {
                this.$el.html(content).removeAttr('class').addClass(this.className).addClass(className);
                this._super();
            }
        });
        M.define('notifications', new Toast());
    }(mw.mobileFrontend));
    (function (M, $) {
        var View = M.require('view'),
            Section, Page;
        Section = View.extend({
            template: M.template.get('section'),
            defaults: {
                line: '',
                text: '',
                editLabel: mw.msg('mobile-frontend-editor-edit')
            },
            initialize: function (options) {
                this.line = options.line;
                this.text = options.text;
                this.hasReferences = options.hasReferences || false;
                this.id = options.id || null;
                this.anchor = options.anchor;
                this._super(options);
            }
        });
        Page = View.extend({
            template: M.template.get('page'),
            defaults: {
                title: '',
                lead: '',
                inBetaOrAlpha: mw.config.get('wgMFMode') !== 'stable',
                isMainPage: false,
                talkLabel: mw.msg('mobile-frontend-talk-overlay-header'),
                editLabel: mw.msg('mobile-frontend-editor-edit'),
                lastModifiedTimestamp: ("" + new Date().getTime()).substr(0, 10)
            },
            isMainPage: function () {
                return this.options.isMainPage;
            },
            render: function (options) {
                var pageTitle = options.title,
                    self = this,
                    $el = this.$el,
                    _super = self._super;
                if (!options.sections) {
                    $el.empty().addClass('spinner loading');
                    M.pageApi.getPage(pageTitle).done(function (pageData) {
                        options = $.extend(options, pageData);
                        _super.call(self, options);
                        M.pageApi.getPageLanguages(pageTitle).done(function (langlinks) {
                            var template = M.template.get('languageSection'),
                                data = {
                                    langlinks: langlinks,
                                    heading: mw.msg('mobile-frontend-language-article-heading'),
                                    description: mw.msg('mobile-frontend-language-header', langlinks.length)
                                };
                            $el.find('#mw-mf-language-section').html(template.render(data));
                            M.emit('languages-loaded');
                        });
                        $el.removeClass('spinner loading');
                        self.emit('ready', self);
                    }).fail($.proxy(self, 'emit', 'error'));
                } else {
                    self._super(options);
                }
            },
            isTalkPage: function () {
                return M.inNamespace('talk');
            },
            preRender: function (options) {
                var self = this;
                this.sections = [];
                this._sectionLookup = {};
                this.title = options.title;
                this.lead = options.lead;
                $.
                each(options.sections, function () {
                    var section = new Section(this);
                    self.sections.push(section);
                    self._sectionLookup[section.id] = section;
                });
            },
            getReferenceSection: function () {
                return this._referenceLookup;
            },
            getSubSection: function (id) {
                return this._sectionLookup[id];
            },
            getSubSections: function () {
                return this.sections;
            }
        });
        M.define('Page', Page);
        M.define('Section', Section);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var View = M.require('view'),
            popup = M.require('notifications'),
            CtaDrawer = M.require('CtaDrawer'),
            LoadingOverlay = M.require('LoadingOverlay'),
            PhotoUploaderButton, LeadPhotoUploaderButton;

        function isSupported() {
            if (navigator.userAgent.match(/Windows Phone (OS 7|8.0)/)) {
                return false;
            }
            var browserSupported = (typeof FileReader !== 'undefined' && typeof FormData !== 'undefined' && ($('<input type="file"/>').prop('type') === 'file'));
            return browserSupported && !mw.config.get('wgImagesDisabled', false);
        }
        PhotoUploaderButton = View.extend({
            template: M.template.get('uploads/PhotoUploaderButton'),
            className: 'button photo',
            initialize: function (options) {
                this._super(options);
            },
            postRender: function () {
                var self = this,
                    $input = this.$('input'),
                    ctaDrawer;
                if (!M.isLoggedIn()) {
                    ctaDrawer = new CtaDrawer({
                        content: mw.msg('mobile-frontend-photo-upload-cta'),
                        queryParams: {
                            campaign: 'mobile_uploadPageActionCta',
                            returntoquery: 'article_action=photo-upload'
                        }
                    });
                    this.$el.click(function (ev) {
                        ctaDrawer.show();
                        ev.preventDefault();
                    });
                    return;
                }
                $input.attr('accept', 'image/*;').on('change', function () {
                    var options = $.extend({}, self.options, {
                            file: $input[0].files[0],
                            parent: self
                        }),
                        loadingOverlay = new LoadingOverlay();
                    loadingOverlay.show();
                    mw.loader.using('mobile.uploads', function () {
                        var PhotoUploader = M.require('modules/uploads/PhotoUploader');
                        loadingOverlay.hide();
                        new PhotoUploader(options);
                    });
                    $input.val('');
                });
            }
        });
        LeadPhotoUploaderButton = PhotoUploaderButton.extend({
            template: M.template.get('uploads/LeadPhotoUploaderButton'),
            className: 'enabled',
            initialize: function (options) {
                var self = this;
                this._super(options);
                this.on('start', function () {
                    self.$el.
                    removeClass('enabled');
                }).on('success', function (data) {
                    popup.show(mw.msg('mobile-frontend-photo-upload-success-article'), 'toast');
                    mw.loader.using('mobile.uploads', function () {
                        var LeadPhoto = M.require('modules/uploads/LeadPhoto');
                        new LeadPhoto({
                            url: data.url,
                            pageUrl: data.descriptionUrl,
                            caption: data.description
                        }).prependTo(M.getLeadSection());
                    });
                }).on('error cancel', function () {
                    self.$el.addClass('enabled');
                });
            }
        });
        PhotoUploaderButton.isSupported = LeadPhotoUploaderButton.isSupported = isSupported();
        M.define('modules/uploads/PhotoUploaderButton', PhotoUploaderButton);
        M.define('modules/uploads/LeadPhotoUploaderButton', LeadPhotoUploaderButton);
    }(mw.mobileFrontend, jQuery));
    (function (M, $) {
        var Overlay = M.require('Overlay'),
            LanguageOverlay;
        LanguageOverlay = Overlay.extend({
            defaults: {
                languagesLink: mw.util.wikiGetlink('Special:MobileOptions/Language'),
                languagesText: mw.msg('mobile-frontend-language-footer'),
                placeholder: mw.msg('mobile-frontend-language-site-choose')
            },
            className: 'language-overlay mw-mf-overlay list-overlay',
            template: M.template.get('overlays/languages'),
            initialize: function (options) {
                if (options.languages && options.languages.length) {
                    options.header = mw.msg('mobile-frontend-language-header', options.languages.length);
                }
                if (options.variants && options.variants.length) {
                    options.variantHeader = mw.msg('mobile-frontend-language-header', options.variants.length);
                }
                M.emit('language-overlay-initialize', options);
                this._super(options);
            },
            filterLists: function (val) {
                var matches = 0;
                this.$('ul li').each(function () {
                    var $choice = $(this);
                    if ($choice.find('span').text().toLowerCase().indexOf(val) > -1) {
                        matches += 1;
                        $choice.show();
                    } else {
                        $choice.hide();
                    }
                });
                return matches;
            },
            postRender: function (options) {
                var $footer, self = this;
                this._super(options);
                $footer = this.$('.mw-mf-overlay-footer');
                this.$('ul').find('a').on('click', function () {
                    M.emit('language-select', $(this).attr('lang'));
                });
                this.$('.search').on('keyup', function () {
                    var matches = self.filterLists(this.value.toLowerCase());
                    if (matches > 0) {
                        $footer.hide();
                    } else {
                        $footer.show();
                    }
                });
            }
        });
        M.define('languages/LanguageOverlay', LanguageOverlay);
    }(mw.mobileFrontend, jQuery));;
}, {}, {
    "mobile-frontend-watchlist-cta-button-signup": "Registrieren",
    "mobile-frontend-watchlist-cta-button-login": "Anmelden",
    "mobile-frontend-drawer-cancel": "Abbrechen",
    "mobile-frontend-overlay-escape": "Zur\u00fcck",
    "mobile-frontend-photo-upload-cta": "Bitte melde dich an oder registriere dich, um ein Bild hinzuzuf\u00fcgen.",
    "cancel": "Abbrechen",
    "mobile-frontend-language-header": "Diese Seite ist in {{PLURAL:$1|einer Sprache|$1 Sprachen}} verf\u00fcgbar",
    "mobile-frontend-language-site-choose": "Sprache suchen",
    "mobile-frontend-language-footer": "Hinweis: Diese Seite ist m\u00f6glicherweise nicht in deiner Sprache geschrieben. Du kannst einsehen, welche Sprachen {{SITENAME}} unterst\u00fctzt, indem du hier klickst.",
    "mobile-frontend-talk-overlay-header": "Diskussion",
    "mobile-frontend-language-article-heading": "In einer anderen Sprache lesen",
    "mobile-frontend-editor-disabled": "Du bist nicht berechtigt, diese Seite zu bearbeiten.",
    "mobile-frontend-editor-unavailable": "Das mobile Bearbeiten ist derzeit f\u00fcr deinen Browser nicht verf\u00fcgbar. Bitte versuche einen anderen Browser.",
    "mobile-frontend-editor-cta": "Du musst angemeldet sein, um Seiten auf mobilen Ger\u00e4ten zu bearbeiten.",
    "mobile-frontend-editor-edit": "Bearbeiten",
    "mobile-frontend-editor-save": "Speichern"
});
mw.loader.implement("mobile.stable.styles", function () {;
}, {
    "css": [
".loading{background-image:url(http://hurraki.de/w/extensions/MobileFrontend/less/common/images/ajax-loader.gif?2014-01-15T22:50:00Z) !important;background-repeat:no-repeat;background-position:center;-o-background-size:32px auto;-webkit-background-size:32px auto;background-size:32px auto}.loading.spinner{height:100px}.loading.content{padding-top:48px;text-align:center;background-position:50% 0}.loading.drawer,.loading.buttonBar{background-position:16px 50%;padding-left:60px}.progress-bar{width:100%;height:8px;border:1px solid #9ea0a3;box-shadow:inset 0 0 4px #bbb}.progress-bar .value{width:0;height:100%;background:#3366BB}.alpha{-webkit-tap-highlight-color:transparent}  button.languageSelector{margin-top:.5em}.language-overlay \u003E ul{padding-bottom:0}.language-overlay \u003E ul .preferred{font-weight:bold}   .mw-mf-overlay input.search{ padding-right:32px}.mw-mf-overlay input.search.searching{background-color:#eee}form{position:relative}form .clear{top:.3em;right:0;width:32px;height:32px;background:url(img/close-button-beta.png?2014-01-15T22:50:00Z) no-repeat scroll 50% 50%;-o-background-size:auto 12px;-webkit-background-size:auto 12px;background-size:auto 12px;cursor:pointer;position:absolute}.suggestions-results .error{color:#666;border:none;border-bottom:solid 1px #eee;padding:12px 40px;background:none;min-height:auto;font-size:0.9em}.suggestions-results .error p,.suggestions-results .error .content{margin:0}  a.mw-mf-cleanup{display:block;padding:10px 15px 10px 44px;background-image:url(http://hurraki.de/w/extensions/MobileFrontend/less/modules/images/issues-blue.png?2014-01-15T22:50:00Z);background-repeat:no-repeat;margin-bottom:4px;-o-background-size:24px 24px;-webkit-background-size:24px 24px;background-size:24px 24px;background-position:10px center}a.mw-mf-cleanup:hover{background-image:url(http://hurraki.de/w/extensions/MobileFrontend/less/modules/images/issues-gray.png?2014-01-15T22:50:00Z);text-decoration:none;color:#565656;background-color:#f0f0f0}ul.cleanup img{display:block;margin:0 auto 1em auto}  .page-list .watch-this-article{position:absolute;right:8px;top:50%;margin-top:-11px;width:22px;height:22px;-o-background-size:auto 22px;-webkit-background-size:auto 22px;background-size:auto 22px}.animations .watch-this-article{-webkit-backface-visibility:hidden;-webkit-transition:-webkit-transform .5s;transition:transform .5s}.animations .watch-this-article.watched{-webkit-transform:rotate(72deg);transform:rotate(72deg)}  .button.photo{position:relative;display:table;margin:0 auto;padding-left:44px;text-align:left; }.button.photo div{background:url(http://hurraki.de/w/extensions/MobileFrontend/less/modules/images/camera.png?2014-01-15T22:50:00Z) left 45% no-repeat;margin:0 10px;-o-background-size:24px auto;-webkit-background-size:24px auto;background-size:24px auto}.button.photo input{opacity:0;z-index:2}.button.photo input,.button.photo div{cursor:pointer;position:absolute;top:0;left:0;width:100%;height:100%}#content \u003E .button.photo{display:block;margin-bottom:10px}.photo-overlay .content{padding-bottom:11em !important}.photo-overlay .help{display:block}.photo-overlay img{height:90px;float:left;margin:0 8px 8px 0}.photo-overlay .loading{background-position:0 50%;padding:0 0 0 48px;margin:0;line-height:90px}.photo-overlay textarea{width:100%;height:6em}.photo-overlay textarea::-webkit-input-placeholder,.photo-overlay textarea::-moz-placeholder{text-align:center;line-height:6em}@keyframes pulse{from{opacity:1}to{opacity:.2}}@-webkit-keyframes pulse{from{opacity:1}to{opacity:.2}}.photo-nag{height:90%}.photo-nag .preview{height:50%;-o-background-size:100% auto;-webkit-background-size:100% auto;background-size:100% auto;background-repeat:no-repeat}.photo-nag .preview.loading{-o-background-size:32px auto;-webkit-background-size:32px auto;background-size:32px auto}.photo-nag li{clear:both;min-height:50px;padding:0 0 1em 66px;line-height:1.25}.photo-nag label div{float:left;width:50px;height:50px;margin:0 0 0 -66px;font-size:40px;font-weight:bold;line-height:50px;border:3px solid #939393;border-radius:50px;background:#e6e7e8 url(http://hurraki.de/w/extensions/MobileFrontend/less/modules/images/confirm.png?2014-01-15T22:50:00Z) 50% 50% no-repeat;-o-background-size:24px 24px;-webkit-background-size:24px 24px;background-size:24px 24px}.photo-nag label div input{display:none}.photo-nag label div.checked{background-color:#006398;background-image:url(http://hurraki.de/w/extensions/MobileFrontend/less/modules/images/confirmChecked.png?2014-01-15T22:50:00Z);border-color:#006398}.photo-nag strong{padding:.3em 0;display:block;font-weight:normal;font-size:1.2em;line-height:1}.animations .photo-nag label div.active{-webkit-animation:pulse 1s ease-in-out infinite alternate;animation:pulse 1s ease-in-out infinite alternate}@media (min-width:768px){.photo-nag .preview{-o-background-size:auto 100%;-webkit-background-size:auto 100%;background-size:auto 100%;background-position:50% 50%}}   .cloaked input{opacity:0;position:absolute;top:0;left:0;right:0;bottom:0}.tutorial{padding-left:16px;padding-right:16px;line-height:1.4;font-size:0.9em;background-color:#006398;color:white;height:100%;box-shadow:0 1px 5px 0 rgba(117,117,117,0.8)}.tutorial .slide{text-align:center;background-size:auto 180px;background-repeat:no-repeat;background-position:center -10px;padding:10px 0;width:100%}.tutorial .slide p{line-height:1.4;margin:0 0 1em}.tutorial .slide button.actionable,.tutorial .slide button,.tutorial .slide .button{position:relative;background-color:white;color:#006398;padding:12px;border:none;font-weight:bold}.tutorial .slide .cancel{background:none;color:white}.tutorial .photo-upload{padding-top:160px;background-image:url(http://hurraki.de/w/extensions/MobileFrontend/less/modules/images/tutorials/photos.png?2014-01-15T22:50:00Z)}.tutorial .editing{padding-top:20px}   .content .edit-page{position:absolute;display:none;background:url(http://hurraki.de/w/extensions/MobileFrontend/less/modules/../common/images/pagemenu/edit.png?2014-01-15T22:50:00Z) 100% .5em no-repeat;-o-background-size:auto 30px;-webkit-background-size:auto 30px;background-size:auto 30px;text-indent:-9999px;border-left:solid 1px #E2E3E4;width:35px;top:0;bottom:0;right:0}.content h1.openSection .edit-page,.content h2.openSection .edit-page{display:none}.stub .edit-page{margin:0;display:block}.editor-overlay textarea{width:100%;min-height:50%;padding:10px 16px 8em;line-height:1.5;border:none;resize:none;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}.editor-overlay textarea:focus{outline:none}.editor-overlay input{margin:0 0 .7em;width:100%;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box}.editor-overlay .preview{display:none;padding-bottom:15em}.editor-overlay .preview \u003E h2{font:bold .75em \"Helvetica Neue\",\"Helvetica\",\"Nimbus Sans L\",\"Arial\",\"Liberation Sans\",sans-serif;color:#707070;text-align:center;background:#f3f3f3 url(http://hurraki.de/w/extensions/MobileFrontend/less/modules/images/preview-bg.png?2014-01-15T22:50:00Z) 50% 50% repeat-x;-o-background-size:auto .8em;-webkit-background-size:auto .8em;background-size:auto .8em;line-height:1.7;text-transform:uppercase}.editor-overlay .buttonBar{display:none;box-shadow:0 -10px 10px 0 #fff}.editor-overlay .buttonBar .message{margin:0 0 .7em;padding:0 0 .3em;border-bottom:1px solid #ccc;color:#707070}.editor-overlay .buttonBar .message p{display:inline-block;text-align:center;padding-top:0}.editor-overlay .initial-bar{display:block}.abusefilter-overlay .mbox-image{min-width:30px}@media (max-height:355px){.editor-overlay .initial-bar{position:static}}.android2 .editor-overlay textarea{line-height:1.2}\n/* cache key: db_3381_23_uvo:resourceloader:filter:minify-css:7:23444c7f47d0b7a9bf5e4b6a7c847a4e */"
]
}, {});
mw.loader.implement("mobile.toast.styles", function () {;
}, {
    "css": [
"#notifications{height:0;position:absolute;z-index:5;width:100%}.toast,.drawer{bottom:0;left:0;right:0;background-color:#f3f3f3;box-shadow:0 -1px 8px 0 rgba(0,0,0,0.35);word-wrap:break-word;z-index:5;display:none}.toast.visible,.drawer.visible{display:block}.animations .toast,.animations .drawer{display:block;visibility:hidden; -webkit-transform:translate3d(0,100px,0);transform:translate3d(0,100px,0);bottom:100px;opacity:0;-webkit-backface-visibility:hidden;-webkit-transition:-webkit-transform .25s,opacity .25s,visibility 0s .25s,bottom 0s .25s;transition:transform .25s,opacity .25s,visibility 0s .25s,bottom 0s .25s}.animations .toast.visible,.animations .drawer.visible{bottom:0;-webkit-backface-visibility:hidden;-webkit-transition:-webkit-transform .25s,opacity .25s;transition:transform .25s,opacity .25s;visibility:visible;opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.toast{font-size:.9em;padding:.9em 1em;background-color:#373737;color:#fff;margin:0 10% 20px;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;width:80%;text-align:center;border-radius:3px}.toast.error{background-image:url(http://hurraki.de/w/extensions/MobileFrontend/less/common/images/error.png?2014-01-15T22:50:00Z);background-position:16px 50%;background-repeat:no-repeat;padding-left:5%;width:75%;border:none}.toast.landmark{color:#F7F737}.references h3{margin:0;padding-right:4px;display:inline}.references .mw-cite-backlink{display:none}.references button{float:right;margin-top:.7em;width:16px;height:12px;background:url(img/close-button-beta.png?2014-01-15T22:50:00Z) no-repeat 0 50%;-o-background-size:auto 12px;-webkit-background-size:auto 12px;background-size:auto 12px}\n/* cache key: db_3381_23_uvo:resourceloader:filter:minify-css:7:85fb3e1e028d7234107c89d9c61f3a22 */"
]
}, {});
/* cache key: db_3381_23_uvo:resourceloader:filter:minify-js:7:cc5204a33904440a0bf105e62f229d0c */