package com.katasphere.execution;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class CodeSecurityValidator {

    public record SecurityCheckResult(boolean safe, String violationReason) {}

    // Java restricted patterns (RCE, reflection, file manipulation, sockets, JVM control)
    private static final List<Pattern> JAVA_RESTRICTED = List.of(
        Pattern.compile("Runtime\\s*\\.\\s*getRuntime"),
        Pattern.compile("ProcessBuilder"),
        Pattern.compile("ProcessHandle"),
        Pattern.compile("System\\s*\\.\\s*(exit|getenv|getProperties|setProperty|load|loadLibrary)"),
        Pattern.compile("java\\.lang\\.reflect"),
        Pattern.compile("Class\\s*\\.\\s*forName"),
        Pattern.compile("(getDeclaredMethod|getMethod|getDeclaredField|getField|invoke)\\s*\\("),
        Pattern.compile("java\\.lang\\.invoke"),
        Pattern.compile("sun\\.(misc\\.Unsafe|reflect)"),
        Pattern.compile("java\\.net\\.(Socket|ServerSocket|DatagramSocket|URL|HttpURLConnection|URI|HttpClient|NetworkInterface)"),
        Pattern.compile("java\\.nio\\.file\\.(Files|Paths?|Path\\s*\\.\\s*of)"),
        Pattern.compile("java\\.io\\.(File|FileInputStream|FileOutputStream|FileWriter|FileReader|RandomAccessFile)"),
        Pattern.compile("(ClassLoader|URLClassLoader)"),
        Pattern.compile("SecurityManager")
    );

    // Python restricted patterns (OS execution, socket network, file access, dynamic code eval, introspection)
    private static final List<Pattern> PYTHON_RESTRICTED = List.of(
        Pattern.compile("\\bimport\\s+(os|subprocess|sys|shutil|socket|urllib|requests|http|ftplib|smtplib|ctypes|pty|platform|importlib|builtins)\\b"),
        Pattern.compile("\\bfrom\\s+(os|subprocess|sys|shutil|socket|urllib|requests|http|ctypes|pty|platform|importlib)\\s+import"),
        Pattern.compile("\\bos\\.(system|popen|spawn|remove|unlink|rmdir|mkdir|rename|environ)\\b"),
        Pattern.compile("\\b(eval|exec|compile|__import__)\\s*\\("),
        Pattern.compile("\\b(open|file)\\s*\\("),
        Pattern.compile("\\bsys\\.(exit|modules)\\b"),
        Pattern.compile("(__subclasses__|__builtins__|__globals__)"),
        Pattern.compile("\\b(getattr|setattr|delattr|globals|locals)\\s*\\(")
    );

    // JavaScript restricted patterns (child_process, fs, net, dynamic evaluation, process access)
    private static final List<Pattern> JS_RESTRICTED = List.of(
        Pattern.compile("\\brequire\\s*\\(\\s*['\"](child_process|fs|net|http|https|tls|dgram|dns|cluster|os|worker_threads|vm|v8)['\"]\\s*\\)"),
        Pattern.compile("\\bimport\\s+.*from\\s+['\"](child_process|fs|net|http|https|cluster|os|worker_threads|vm)['\"]"),
        Pattern.compile("\\b(process|global\\.process|globalThis\\.process)\\.(exit|kill|env)"),
        Pattern.compile("\\b(eval|Function)\\s*\\("),
        Pattern.compile("constructor\\s*\\.\\s*constructor\\s*\\(")
    );

    // C++ restricted patterns (system commands, fork bomb, network headers, filesystem)
    private static final List<Pattern> CPP_RESTRICTED = List.of(
        Pattern.compile("#include\\s*<(cstdlib|unistd\\.h|sys/|windows\\.h|winsock|fstream|filesystem|dlfcn\\.h)>"),
        Pattern.compile("\\b(system|popen|fork|kill|ptrace)\\s*\\("),
        Pattern.compile("\\bexec[lv]p?\\s*\\("),
        Pattern.compile("\\b__asm__\\b")
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
