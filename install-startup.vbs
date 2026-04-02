Set WshShell = CreateObject("WScript.Shell")
Set Shortcut = WshShell.CreateShortcut(WshShell.SpecialFolders("Startup") & "\Markdown 编辑器.lnk")
Shortcut.TargetPath = "D:\MyMarkdown\start.bat"
Shortcut.WorkingDirectory = "D:\MyMarkdown"
Shortcut.Save
