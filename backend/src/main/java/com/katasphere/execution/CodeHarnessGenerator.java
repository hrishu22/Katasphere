package com.katasphere.execution;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class CodeHarnessGenerator {

    private static final Pattern PYTHON_FUNC_PATTERN = Pattern.compile("def\\s+([a-zA-Z0-9_]+)\\s*\\(");
    private static final Pattern JS_FUNC_PATTERN = Pattern.compile("function\\s+([a-zA-Z0-9_]+)\\s*\\(");

    /**
     * Prepares an executable harness wrapping the user's solution function and driving the test case input.
     */
    public String generateHarness(String language, String sourceCode, String input) {
        if (language == null) language = "PYTHON";
        language = language.toUpperCase();

        switch (language) {
            case "PYTHON":
                return generatePythonHarness(sourceCode, input);
            case "JAVASCRIPT":
                return generateJavaScriptHarness(sourceCode, input);
            case "JAVA":
                return generateJavaHarness(sourceCode, input);
            case "CPP":
                return generateCppHarness(sourceCode, input);
            default:
                return sourceCode;
        }
    }

    private String generatePythonHarness(String sourceCode, String input) {
        String cleanInput = input != null ? input.trim() : "";
        // Detect function name
        String funcName = "solution";
        Matcher matcher = PYTHON_FUNC_PATTERN.matcher(sourceCode);
        if (matcher.find()) {
            funcName = matcher.group(1);
        }

        // Format input lines for exec
        String formattedLines = cleanInput.replace(", ", "\n").replace(";", "\n");

        return sourceCode + "\n\n" +
            "if __name__ == '__main__':\n" +
            "    import json, sys, inspect\n" +
            "    raw_input_lines = '''" + formattedLines + "'''\n" +
            "    scope = {}\n" +
            "    try:\n" +
            "        for line in raw_input_lines.strip().splitlines():\n" +
            "            if '=' in line:\n" +
            "                exec(line.strip(), scope)\n" +
            "    except Exception:\n" +
            "        pass\n" +
            "    \n" +
            "    func = globals().get('" + funcName + "')\n" +
            "    if not func:\n" +
            "        for k, v in list(globals().items()):\n" +
            "            if callable(v) and not k.startswith('_') and k not in ['json', 'sys', 'inspect']:\n" +
            "                func = v\n" +
            "                break\n" +
            "    \n" +
            "    if func:\n" +
            "        try:\n" +
            "            sig = inspect.signature(func)\n" +
            "            args = [scope[p] for p in sig.parameters.keys() if p in scope]\n" +
            "            if len(args) == len(sig.parameters):\n" +
            "                res = func(*args)\n" +
            "            else:\n" +
            "                res = func(*list(scope.values()))\n" +
            "            if isinstance(res, bool):\n" +
            "                print(str(res).lower())\n" +
            "            elif isinstance(res, (list, dict)):\n" +
            "                print(json.dumps(res, separators=(',', ':')))\n" +
            "            else:\n" +
            "                print(res)\n" +
            "        except Exception as e:\n" +
            "            sys.stderr.write(str(e))\n" +
            "            sys.exit(1)\n";
    }

    private String generateJavaScriptHarness(String sourceCode, String input) {
        String cleanInput = input != null ? input.trim() : "";
        String funcName = "solution";
        Matcher matcher = JS_FUNC_PATTERN.matcher(sourceCode);
        if (matcher.find()) {
            funcName = matcher.group(1);
        }

        return sourceCode + "\n\n" +
            "(function() {\n" +
            "    const raw = `" + cleanInput + "`;\n" +
            "    const scope = {};\n" +
            "    try {\n" +
            "        const parts = raw.split(',').map(s => s.trim());\n" +
            "        for (const part of parts) {\n" +
            "            const idx = part.indexOf('=');\n" +
            "            if (idx > -1) {\n" +
            "                const k = part.substring(0, idx).trim();\n" +
            "                const v = JSON.parse(part.substring(idx + 1).trim());\n" +
            "                scope[k] = v;\n" +
            "            }\n" +
            "        }\n" +
            "    } catch(e) {}\n" +
            "    const fn = typeof " + funcName + " === 'function' ? " + funcName + " : null;\n" +
            "    if (fn) {\n" +
            "        try {\n" +
            "            const res = fn.apply(null, Object.values(scope));\n" +
            "            if (typeof res === 'object') {\n" +
            "                console.log(JSON.stringify(res));\n" +
            "            } else {\n" +
            "                console.log(String(res));\n" +
            "            }\n" +
            "        } catch(err) {\n" +
            "            console.error(err);\n" +
            "            process.exit(1);\n" +
            "        }\n" +
            "    }\n" +
            "})();\n";
    }

    private String generateJavaHarness(String sourceCode, String input) {
        // If code already contains public static void main, return as is
        if (sourceCode.contains("public static void main")) {
            return sourceCode;
        }
        return sourceCode;
    }

    private String generateCppHarness(String sourceCode, String input) {
        if (sourceCode.contains("int main(")) {
            return sourceCode;
        }
        return sourceCode;
    }

    /**
     * Normalizes output string for deterministic comparison.
     */
    public boolean compareOutputs(String actual, String expected) {
        if (actual == null && expected == null) return true;
        if (actual == null || expected == null) return false;

        String a = normalize(actual);
        String e = normalize(expected);
        return a.equals(e);
    }

    public String normalize(String str) {
        if (str == null) return "";
        String s = str.trim();
        // Lowercase booleans
        if (s.equalsIgnoreCase("true")) return "true";
        if (s.equalsIgnoreCase("false")) return "false";
        // Remove spaces inside arrays e.g. [0, 1] -> [0,1]
        s = s.replaceAll("\\s+", "");
        return s;
    }
}
