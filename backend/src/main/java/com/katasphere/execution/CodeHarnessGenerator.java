package com.katasphere.execution;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class CodeHarnessGenerator {

    public record ParsedOutput(String actualOutput, String userStdout) {}

    private static final Pattern PYTHON_FUNC_PATTERN = Pattern.compile("def\\s+([a-zA-Z0-9_]+)\\s*\\(");
    private static final Pattern JS_FUNC_PATTERN = Pattern.compile("function\\s+([a-zA-Z0-9_]+)\\s*\\(");
    public static final String RET_DELIMITER = "__KATASPHERE_RET__:";

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
        String funcName = "solution";
        Matcher matcher = PYTHON_FUNC_PATTERN.matcher(sourceCode);
        if (matcher.find()) {
            funcName = matcher.group(1);
        }

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
            "                print('" + RET_DELIMITER + "' + str(res).lower())\n" +
            "            elif isinstance(res, (list, dict)):\n" +
            "                print('" + RET_DELIMITER + "' + json.dumps(res, separators=(',', ':')))\n" +
            "            else:\n" +
            "                print('" + RET_DELIMITER + "' + str(res))\n" +
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
            "                console.log('" + RET_DELIMITER + "' + JSON.stringify(res));\n" +
            "            } else {\n" +
            "                console.log('" + RET_DELIMITER + "' + String(res));\n" +
            "            }\n" +
            "        } catch(err) {\n" +
            "            console.error(err);\n" +
            "            process.exit(1);\n" +
            "        }\n" +
            "    }\n" +
            "})();\n";
    }

    private String generateJavaHarness(String sourceCode, String input) {
        String cleanInput = input != null ? input.trim() : "";
        String escapedInput = cleanInput
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "");

        StringBuilder userImports = new StringBuilder();
        StringBuilder cleanCode = new StringBuilder();
        for (String line : sourceCode.split("\n")) {
            String trimmed = line.trim();
            if (trimmed.startsWith("package ")) {
                continue;
            }
            if (trimmed.startsWith("import ")) {
                userImports.append(line).append("\n");
            } else {
                cleanCode.append(line).append("\n");
            }
        }

        String finalUserCode = cleanCode.toString().replaceAll("public\\s+class\\s+Solution", "class Solution");

        return "import java.util.*;\n" +
            "import java.util.stream.*;\n" +
            "import java.lang.reflect.*;\n" +
            userImports + "\n" +
            "public class KatasphereRunner {\n" +
            "    public static void main(String[] args) {\n" +
            "        try {\n" +
            "            String input = \"" + escapedInput + "\";\n" +
            "            Class<?> clazz = Class.forName(\"Solution\");\n" +
            "            Object instance = clazz.getDeclaredConstructor().newInstance();\n" +
            "            List<String> raw = extractTokens(input);\n" +
            "            Method targetMethod = null;\n" +
            "            for (Method m : clazz.getDeclaredMethods()) {\n" +
            "                if (Modifier.isPublic(m.getModifiers()) && !Modifier.isStatic(m.getModifiers())) {\n" +
            "                    if (m.getParameterCount() == raw.size() && m.getReturnType() != void.class) {\n" +
            "                        targetMethod = m;\n" +
            "                        break;\n" +
            "                    }\n" +
            "                    if (targetMethod == null) targetMethod = m;\n" +
            "                }\n" +
            "            }\n" +
            "            if (targetMethod == null) {\n" +
            "                System.err.println(\"No public solution method found in Solution\");\n" +
            "                System.exit(1);\n" +
            "            }\n" +
            "            Class<?>[] paramTypes = targetMethod.getParameterTypes();\n" +
            "            Object[] parsedArgs = new Object[paramTypes.length];\n" +
            "            for (int i = 0; i < paramTypes.length && i < raw.size(); i++) {\n" +
            "                parsedArgs[i] = convert(paramTypes[i], raw.get(i));\n" +
            "            }\n" +
            "            Object res = targetMethod.invoke(instance, parsedArgs);\n" +
            "            String strRes;\n" +
            "            if (res == null) strRes = \"null\";\n" +
            "            else if (res instanceof int[]) strRes = Arrays.toString((int[]) res);\n" +
            "            else if (res instanceof long[]) strRes = Arrays.toString((long[]) res);\n" +
            "            else if (res instanceof double[]) strRes = String.format(Locale.US, \"%.5f\", (Double) res);\n" +
            "            else if (res instanceof boolean[]) strRes = String.valueOf(res);\n" +
            "            else if (res instanceof Object[]) strRes = Arrays.deepToString((Object[]) res);\n" +
            "            else strRes = String.valueOf(res);\n" +
            "            System.out.println(\"" + RET_DELIMITER + "\" + strRes);\n" +
            "        } catch (Throwable t) {\n" +
            "            Throwable cause = t.getCause() != null ? t.getCause() : t;\n" +
            "            cause.printStackTrace(System.err);\n" +
            "            System.exit(1);\n" +
            "        }\n" +
            "    }\n" +
            "    static List<String> extractTokens(String input) {\n" +
            "        List<String> tokens = new ArrayList<>();\n" +
            "        if (input == null || input.isBlank()) return tokens;\n" +
            "        int len = input.length(); int i = 0;\n" +
            "        while (i < len) {\n" +
            "            int eq = input.indexOf('=', i);\n" +
            "            if (eq == -1) break;\n" +
            "            i = eq + 1;\n" +
            "            while (i < len && Character.isWhitespace(input.charAt(i))) i++;\n" +
            "            int start = i;\n" +
            "            if (i < len && input.charAt(i) == '\"') {\n" +
            "                i++;\n" +
            "                while (i < len && input.charAt(i) != '\"') {\n" +
            "                    if (input.charAt(i) == '\\\\' && i + 1 < len) i++;\n" +
            "                    i++;\n" +
            "                }\n" +
            "                if (i < len) i++;\n" +
            "            } else if (i < len && input.charAt(i) == '[') {\n" +
            "                int depth = 1; i++;\n" +
            "                while (i < len && depth > 0) {\n" +
            "                    if (input.charAt(i) == '[') depth++;\n" +
            "                    else if (input.charAt(i) == ']') depth--;\n" +
            "                    i++;\n" +
            "                }\n" +
            "            } else {\n" +
            "                while (i < len && input.charAt(i) != ',') i++;\n" +
            "            }\n" +
            "            tokens.add(input.substring(start, i).trim());\n" +
            "            while (i < len && (input.charAt(i) == ',' || Character.isWhitespace(input.charAt(i)))) i++;\n" +
            "        }\n" +
            "        return tokens;\n" +
            "    }\n" +
            "    static Object convert(Class<?> type, String val) {\n" +
            "        val = val.trim();\n" +
            "        if (type == int.class || type == Integer.class) return Integer.parseInt(val);\n" +
            "        if (type == long.class || type == Long.class) return Long.parseLong(val);\n" +
            "        if (type == double.class || type == Double.class) return Double.parseDouble(val);\n" +
            "        if (type == boolean.class || type == Boolean.class) return Boolean.parseBoolean(val);\n" +
            "        if (type == String.class) {\n" +
            "            if (val.startsWith(\"\\\"\") && val.endsWith(\"\\\"\") && val.length() >= 2) {\n" +
            "                return val.substring(1, val.length() - 1);\n" +
            "            }\n" +
            "            return val;\n" +
            "        }\n" +
            "        if (type == int[].class) {\n" +
            "            val = val.replaceAll(\"[\\\\[\\\\]\\\\s]\", \"\");\n" +
            "            if (val.isEmpty()) return new int[0];\n" +
            "            String[] p = val.split(\",\");\n" +
            "            int[] a = new int[p.length];\n" +
            "            for (int k = 0; k < p.length; k++) a[k] = Integer.parseInt(p[k].trim());\n" +
            "            return a;\n" +
            "        }\n" +
            "        if (type == double[].class) {\n" +
            "            val = val.replaceAll(\"[\\\\[\\\\]\\\\s]\", \"\");\n" +
            "            if (val.isEmpty()) return new double[0];\n" +
            "            String[] p = val.split(\",\");\n" +
            "            double[] a = new double[p.length];\n" +
            "            for (int k = 0; k < p.length; k++) a[k] = Double.parseDouble(p[k].trim());\n" +
            "            return a;\n" +
            "        }\n" +
            "        return val;\n" +
            "    }\n" +
            "}\n\n" +
            finalUserCode;
    }

    private String generateCppHarness(String sourceCode, String input) {
        if (sourceCode.contains("int main(")) {
            return sourceCode;
        }
        return sourceCode;
    }

    /**
     * Splits process stdout into user console output (debug logs) and the function return value.
     */
    public ParsedOutput parseOutput(String rawStdout) {
        if (rawStdout == null) {
            return new ParsedOutput("", null);
        }
        int idx = rawStdout.indexOf(RET_DELIMITER);
        if (idx != -1) {
            String debug = rawStdout.substring(0, idx).trim();
            String ret = rawStdout.substring(idx + RET_DELIMITER.length()).trim();
            return new ParsedOutput(ret, debug.isEmpty() ? null : debug);
        }
        return new ParsedOutput(rawStdout.trim(), null);
    }

    /**
     * Normalizes output string for deterministic comparison.
     */
    public boolean compareOutputs(String actual, String expected) {
        if (actual == null && expected == null) return true;
        if (actual == null || expected == null) return false;

        ParsedOutput parsed = parseOutput(actual);
        String a = normalize(parsed.actualOutput());
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
