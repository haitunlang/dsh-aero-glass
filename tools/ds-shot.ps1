param(
  [string]$Name = "shot",
  [switch]$Reload
)
$ErrorActionPreference = "Stop"
$code = @'
using System;
using System.Runtime.InteropServices;
public class DshShotWin32 {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
}
'@
if (-not ([System.Management.Automation.PSTypeName]'DshShotWin32').Type) { Add-Type -TypeDefinition $code }
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$p = Get-Process -Name "DeepSeek Harness" | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
if ($null -eq $p) { throw "DeepSeek Harness window not found" }
$h = $p.MainWindowHandle
if ([DshShotWin32]::IsIconic($h)) { [DshShotWin32]::ShowWindow($h, 9) | Out-Null; Start-Sleep -Milliseconds 500 }
[DshShotWin32]::SetForegroundWindow($h) | Out-Null
Start-Sleep -Milliseconds 600

if ($Reload) {
  [System.Windows.Forms.SendKeys]::SendWait("^r")
  Start-Sleep -Seconds 5
  [DshShotWin32]::SetForegroundWindow($h) | Out-Null
  Start-Sleep -Milliseconds 800
}

$r = New-Object DshShotWin32+RECT
[DshShotWin32]::GetWindowRect($h, [ref]$r) | Out-Null
$w = $r.Right - $r.Left
$hh = $r.Bottom - $r.Top
$dir = Join-Path $PSScriptRoot "..\shots"
New-Item -ItemType Directory -Force $dir | Out-Null
$bmp = New-Object System.Drawing.Bitmap $w, $hh
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($r.Left, $r.Top, 0, 0, (New-Object System.Drawing.Size $w, $hh))
$path = Join-Path $dir ($Name + ".png")
$bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output $path
