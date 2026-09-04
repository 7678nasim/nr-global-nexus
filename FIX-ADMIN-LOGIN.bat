@echo off
setlocal
cd /d "%~dp0"

echo.
echo ==========================================
echo   NR GLOBAL NEXUS - ADMIN LOGIN FIX
echo ==========================================
echo.

if not exist "backend\.env" (
  echo ERROR: backend\.env not found.
  echo Put this BAT file in the NR GLOBAL NEXUS project folder.
  pause
  exit /b 1
)

echo [1/4] Updating ADMIN_PASSWORD and ADMIN_TOKEN...
python -c "from pathlib import Path; import secrets,string; p=Path(r'backend/.env'); lines=p.read_text(encoding='utf-8').splitlines(); pw='NRG-'+''.join(secrets.choice(string.ascii_letters+string.digits) for _ in range(24)); tok='NRG-'+secrets.token_urlsafe(32); out=[]; seen=set(); vals={'ADMIN_PASSWORD':pw,'ADMIN_TOKEN':tok}; [out.append(k+'='+vals[k]) if (k in vals and not (k in seen or seen.add(k))) else (out.append(x) if k not in vals else None) for x in lines for k in [x.split('=',1)[0].strip()]]; [out.append(k+'='+v) for k,v in vals.items() if k not in seen]; p.write_text('\n'.join(out)+'\n',encoding='utf-8'); Path('ADMIN-CREDENTIALS-LOCAL.txt').write_text('NR GLOBAL NEXUS LOCAL ADMIN CREDENTIALS\n\nADMIN PASSWORD: '+pw+'\nADMIN TOKEN: '+tok+'\n\nKeep this file private. Do not upload or share it.\n',encoding='utf-8'); print('New local admin credentials created.')"

if errorlevel 1 (
  echo ERROR: Could not update .env
  pause
  exit /b 1
)

echo [2/4] Stopping old Python/Uvicorn processes...
taskkill /F /IM python.exe >nul 2>&1

echo [3/4] Starting backend...
start "NR GLOBAL NEXUS BACKEND" cmd /k "cd /d ""%~dp0backend"" && python -m uvicorn server:app --host 0.0.0.0 --port 8000"

echo Waiting for backend...
timeout /t 5 /nobreak >nul

echo [4/4] Testing admin login automatically...
python -c "import json,time; from pathlib import Path; import urllib.request; c=Path('ADMIN-CREDENTIALS-LOCAL.txt').read_text(encoding='utf-8'); pw=[x.split(': ',1)[1] for x in c.splitlines() if x.startswith('ADMIN PASSWORD: ')][0]; data=json.dumps({'password':pw}).encode(); req=urllib.request.Request('http://127.0.0.1:8000/api/admin/login',data=data,headers={'Content-Type':'application/json'},method='POST'); r=urllib.request.urlopen(req,timeout=15); print('LOGIN HTTP STATUS:',r.status); print('ADMIN LOGIN TEST: SUCCESS')"

if errorlevel 1 (
  echo.
  echo ADMIN LOGIN TEST FAILED.
  echo Check the backend window for the exact error.
) else (
  echo.
  echo ==========================================
  echo SUCCESS - ADMIN LOGIN IS WORKING
  echo ==========================================
  echo.
  echo Your new local admin credentials are saved in:
  echo ADMIN-CREDENTIALS-LOCAL.txt
  echo.
  echo Keep that file private.
)

pause
