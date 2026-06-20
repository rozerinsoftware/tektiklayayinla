import zipfile
import re
import sys

path = sys.argv[1]
out = sys.argv[2]
with zipfile.ZipFile(path) as z:
    xml = z.read("word/document.xml").decode("utf-8")
text = re.sub(r"</w:p>", "\n", xml)
text = re.sub(r"<[^>]+>", "", text)
text = text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
lines = [l.strip() for l in text.split("\n") if l.strip()]
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print(len(lines))
