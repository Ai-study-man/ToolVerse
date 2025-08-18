@echo off
echo ========================================
echo 推送ToolVerse项目到GitHub
echo ========================================
echo.

echo 检查网络连接...
ping github.com -n 1 >nul
if errorlevel 1 (
    echo ❌ 无法连接到GitHub，请检查网络连接
    pause
    exit /b 1
)

echo ✅ 网络连接正常

echo.
echo 开始推送到GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ❌ 推送失败，尝试使用force-with-lease...
    git push -u origin main --force-with-lease
)

if errorlevel 1 (
    echo.
    echo ❌ 推送仍然失败
    echo 请稍后手动执行: git push origin main
) else (
    echo.
    echo ✅ 成功推送到GitHub！
)

echo.
echo 当前提交状态：
git status --short

pause
