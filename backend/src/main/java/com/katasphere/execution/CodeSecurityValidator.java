package com.katasphere.execution;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class CodeSecurityValidator {

    public record SecurityCheckResult(boolean safe, String violationReason) {}

    // Java restricted patterns
    private static final List<Pattern> JAVA_RESTRICTED = List.of(
        Pattern.compile("Runtime\\s*\\.\\s*getRuntime"),
        Pattern.compile("ProcessBuilder"),
        Pattern.compile("System\\s*\\.\\s*exit"),
        Pattern.compile("System\\s*\\.\\s*getenv"),
        Pattern.compile("System\\s*\\.\\s*getProperties"),
        Pattern.compile("java\\.lang\\.reflect"),
        Pattern.compile("java\\.net\\.(Socket|ServerSocket|URL|HttpURLConnection|URI|HttpClient)"),
        Pattern.compile("java\\.nio\\.file\\.(Files|Paths?)"),
        Pattern.compile("java\\.io\\.(File|FileOutputStream|FileWriter|RandomAccessFile)"),
        Pattern.compile("ClassLoader"),
        Pattern.compile("SecurityManager")
    );

    // Python restricted patterns
    private static final List<Pattern> PYTHON_RESTRICTED = List.of(
        Pattern.compile("\\bimport\\s+(os|subprocess|sys|shutil|socket|urllib|requests|http|ftplib|smtplib)\\b"),
        Pattern.compile("\\bfrom\\s+(os|subprocess|sys|shutil|socket|urllib|requests|http)\\s+import"),
        Pattern.compile("\\bos\\.(system|popen|spawn|remove|unlink|rmdir|mkdir|rename|environ)\\b"),
        Pattern.compile("\\b(eval|exec|compile|__import__)\\s*\\("),
        Pattern.compile("\\bopen\\s*\\("),
        Pattern.compile("\\bsys\\.(exit|modules)\\b")
    );

    // JavaScript restricted patterns
    private static final List<Pattern> JS_RESTRICTED = List.of(
        Pattern.compile("\\brequire\\s*\\(\\s*['\"](child_process|fs|net|http|https|tls|dgram|dns|cluster|os)['\"]\\s*\\)"),
        Pattern.compile("\\bimport\\s+.*from\\s+['\"](child_process|fs|net|http|https)['\"]"),
        Pattern.compile("\\bprocess\\.(exit|kill|env)\\b"),
        Pattern.compile("\\b(eval|Function)\\s*\\(")
    );

    // C++ restricted patterns
    private static final List<Pattern> CPP_RESTRICTED = List.of(
        Pattern.compile("#include\\s*<(cstdlib|unistd\\.h|sys/|windows\\.h|winsock|fstream|filesystem)>"),
        Pattern.compile("\\bsystem\\s*\\("),
        Pattern.compile("\\bfork\\s*\\("),
        Pattern.compile("\\bexec[lv]p?\\s*\\(")
    );

    /**
     * Validates that the submitted code does not contain malicious system calls or restricted libraries.
     */
    public SecurityCheckResult validate(String language, String sourceCode) {
        if (sourceCode == null || sourceCode.isBlank()) {
            return new SecurityCheckResult(true, null);
        }

        String lang = language != null ? language.toUpperCase() : "PYTHON";
        List<Pattern> patterns;

        switch (lang) {
            case "JAVA":
                patterns = JAVA_RESTRICTED;
                break;
            case "PYTHON":
                patterns = PYTHON_RESTRICTED;
                break;
            case "JAVASCRIPT":
                patterns = JS_RESTRICTED;
                break;
            case "CPP":
                patterns = CPP_RESTRICTED;
                break;
            default:
                patterns = List.of();
        }

        for (Pattern pattern : patterns) {
            if (pattern.matcher(sourceCode).find()) {
                return new SecurityCheckResult(
                    false,
                    "Security violation: restricted module, package, or system call detected [" + pattern.pattern() + "]"
                );
            }
        }

        return new SecurityCheckResult(true, null);
    }
}
