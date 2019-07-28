# sparse
Sufficiently fast S-expression parser (to pairs) for the web

Capable of parsing over 15,000,000 characters of s-expression per second (tested on a 100,000,000 character sample of open source LISP code).

Supports ; line comments and (), {}, and [] brackets. Whitespace is ignored. Supports double-quoted strings with \ escaping. All other characters are matched as name tokens, including backticks, single quotes, and commas.
