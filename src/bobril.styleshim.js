/// <reference path="bobril.d.ts"/>
(function (b) {
    var setStyleShim = b.setStyleShim;
    function addFilter(s, v) {
        if (s.zoom == null)
            s.zoom = "1";
        var f = s.filter;
        s.filter = (f == null) ? v : f + " " + v;
    }
    function addGradientFilter(s, c1, c2, dir) {
        addFilter(s, "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + c1 + "',endColorstr='" + c2 + "', gradientType='" + dir + "')");
    }
    var simpleLinearGradient = /^linear\-gradient\(to (.+?),(.+?),(.+?)\)/ig;
    function ieGradient(s, v, oldName) {
        var match = simpleLinearGradient.exec(v);
        if (match == null)
            return false;
        var dir = match[1];
        var color1 = match[2];
        var color2 = match[3];
        var tmp;
        switch (dir) {
            case "top":
                dir = "0";
                tmp = color1;
                color1 = color2;
                color2 = tmp;
                break;
            case "bottom":
                dir = "0";
                break;
            case "left":
                dir = "1";
                tmp = color1;
                color1 = color2;
                color2 = tmp;
                break;
            case "right":
                dir = "1";
                break;
            default: return false;
        }
        s[oldName] = "none";
        addGradientFilter(s, color1, color2, dir);
        return true;
    }
    if (b.ieVersion() === 8) {
        setStyleShim("opacity", function (s, v, oldName) {
            s[oldName] = undefined;
            if (v === "")
                return;
            v = parseFloat(v);
            addFilter(s, "alpha(opacity=" + ((v * 100) | 0) + ")");
        });
        function hex2(n) {
            if (n <= 0)
                return "00";
            else if (n >= 255)
                return "ff";
            var r = Math.round(n).toString(16);
            if (r.length < 2)
                return "0" + r;
            return r;
        }
        var rergba = /\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d+|\d*\.\d+)\s*\)\s*/;
        setStyleShim("background", function (s, v, oldName) {
            if (ieGradient(s, v, oldName))
                return;
            var match = rergba.exec(v);
            if (match == null)
                return;
            var colorstr = "#" + hex2(parseFloat(match[4]) * 255) + hex2(parseFloat(match[1])) + hex2(parseFloat(match[2])) + hex2(parseFloat(match[3]));
            s[oldName] = "none";
            addGradientFilter(s, colorstr, colorstr, "0");
        });
        var deg2radians = Math.PI * 2 / 360;
        setStyleShim("transform", function (s, v, oldName) {
            s[oldName] = undefined;
            var match = /^rotate\((\d+)deg\)$/.exec(v);
            if (match == null)
                return;
            var match2 = match[1];
            var deg = parseFloat(match2);
            var rad = deg * deg2radians;
            var costheta = Math.cos(rad);
            var sintheta = Math.sin(rad);
            var m11 = costheta;
            var m12 = -sintheta;
            var m21 = sintheta;
            var m22 = costheta;
            var maxX = 0, maxY = 0, minX = 0, minY = 0;
            function trans(x, y) {
                var xx = m11 * x + m12 * y;
                var yy = m21 * x + m22 * y;
                minX = Math.min(minX, xx);
                maxX = Math.max(maxX, xx);
                minY = Math.min(minY, yy);
                maxY = Math.max(maxY, yy);
            }
            var origHeight = parseFloat(s.height);
            var origWidth = parseFloat(s.width);
            trans(0, 0);
            trans(0, origHeight);
            trans(origWidth, 0);
            trans(origWidth, origHeight);
            addFilter(s, "progid:DXImageTransform.Microsoft.Matrix(M11=" + m11 + ",M12=" + m12 + ",M21=" + m21 + ",M22=" + m22 + ",sizingMethod='auto expand')");
            s.left = Math.round((origWidth - (maxX - minX)) * 0.5) + "px";
            s.top = Math.round((origHeight - (maxY - minY)) * 0.5) + "px";
        });
    }
    else if (b.ieVersion() === 9) {
        setStyleShim("background", ieGradient);
    }
    else {
        var teststyle = document.createElement("div").style;
        teststyle.cssText = "background:-webkit-linear-gradient(top,red,red)";
        if (teststyle.background.length > 0) {
            var startsWithGradient = /^(?:repeating\-)?(?:linear|radial)\-gradient/ig;
            var revdirs = { top: "bottom", bottom: "top", left: "right", right: "left" };
            function gradientWebkitter(style, value, name) {
                if (startsWithGradient.test(value)) {
                    var pos = value.indexOf("(to ");
                    if (pos > 0) {
                        pos += 4;
                        var posend = value.indexOf(",", pos);
                        var dir = value.slice(pos, posend);
                        dir = dir.split(" ").map(function (v) { return revdirs[v] || v; }).join(" ");
                        value = value.slice(0, pos - 3) + dir + value.slice(posend);
                    }
                    value = "-webkit-" + value;
                }
                style[name] = value;
            }
            ;
            setStyleShim("background", gradientWebkitter);
        }
    }
})(b);
