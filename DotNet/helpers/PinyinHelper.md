# PinyinHelper

```csharp
ChineseChar cc = new ChineseChar(string text);
var pinyin = cc.Pinyins;
foreach(string s in pinyin) {
    Console.Write(s);
}
 
// 获得中文首字母
string txt = textBox1.Text;
foreach(char c in txt) {
    ChineseChar cc = new ChineseChar(c);
    string pinyin = cc.Pinyins[0]; //多音字中第一个拼音
    char firstLetter = pinyin[0];
    textBox2.Text += firstLetter;
}
 
// 中国人 => ZGR
public static string GetPinyinFirstLetter(string str) {
    StringBuilder pinyin = new StringBuilder();
    foreach(var s in str) {
        ChineseChar cc = new ChineseChar(s);
        pinyin.Append(cc.Pinyins[0][0]); //Pinyins[0]多音字第一个音（zhong1）,[0][0]第一个音首字母
    }
    return pinyin.ToString();
}
```