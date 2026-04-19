# Quick Start - Fix SimpleLTC QM Coach V2

**Status:** Ready to execute  
**Time Required:** 75-105 minutes  
**Approach:** Browser UI via Playwright

## Prerequisites ✓

- [x] Issues identified and documented
- [x] Fix plans created
- [x] Microsoft Learn references reviewed
- [ ] User authentication (MFA required)

## Three Ways to Execute

### Option 1: Guided PowerShell Script (Recommended)
```powershell
.\scripts\Fix-AllIssues.ps1
```
- Walks through each fix step-by-step
- Pauses for manual browser actions
- Verifies completion at each stage

### Option 2: Manual Browser Fixes
1. Open `BROWSER-FIX-GUIDE.md`
2. Follow step-by-step instructions
3. Complete each fix in order
4. Test and publish

### Option 3: Kiro Automation (Advanced)
Ask Kiro to execute fixes via Playwright MCP after authentication

## Critical Fix #1 (Must Do First)

**Problem:** DoR Summary Email workflow broken  
**Cause:** QMORCHESTRATOR missing ProcessingStatus output  
**Fix Time:** 10 minutes

**Quick Steps:**
1. Open: https://copilotstudio.microsoft.com/environments/a944fdf0-0d2e-e14d-8a73-0f5ffae23315/agents/ea52ad9c-8233-f111-88b3-6045bd09a824/canvas
2. Topics → QM ORCHESTRATOR → Details → Outputs
3. Add output: `ProcessingStatus` (String)
4. Topics → DoR SUMMARY EMAIL
5. Update binding: `Processing_Status_PLACEHOLDER` → `ProcessingStatus`
6. Save both topics

## All Fixes at a Glance

| # | Fix | Priority | Time | Status |
|---|-----|----------|------|--------|
| 1 | Processing_Status_PLACEHOLDER | CRITICAL | 10m | Pending |
| 2 | Verify Flow IDs | CRITICAL | 15m | Pending |
| 3 | Define Output Contracts | HIGH | 30m | Pending |
| 10 | Variable Reset Logic | HIGH | 10m | Pending |
| 4 | Complete/Remove Stubs | HIGH | 15m | Pending |
| 8 | Enhance Error Recovery | HIGH | 15m | Pending |
| 9 | Verify Knowledge Base | HIGH | 10m | Pending |
| 5 | Outlook Shared Mailbox | MEDIUM | TBD | Needs IT |
| 6 | Dynamic Facility Lookup | MEDIUM | TBD | Future |
| 7 | Pre-Publish Validation | MEDIUM | TBD | Future |

## After Fixes Complete

1. **Test** in Copilot Studio test pane
2. **Publish** from browser UI
3. **Sync** to local repo: `Copilot Studio: Get from tenant`
4. **Verify** runtime: `pac copilot status`

## Files Reference

- **FIX-PLAN.md** - Comprehensive strategy with Microsoft Learn refs
- **BROWSER-FIX-GUIDE.md** - Detailed step-by-step instructions
- **FIX-SUMMARY.md** - Executive summary
- **scripts/Fix-AllIssues.ps1** - Guided execution script

## Need Help?

- Check BROWSER-FIX-GUIDE.md troubleshooting section
- Review Microsoft Learn links in FIX-PLAN.md
- Check console errors in browser
- Verify PAC authentication: `pac auth list`

## Success Criteria

✓ DoR workflow completes without placeholder errors  
✓ All topics have output contracts  
✓ Variables reset on conversation restart  
✓ Error messages are user-friendly  
✓ Knowledge base fully indexed  
✓ Changes published and synced  

---

**Ready to start?** Run `.\scripts\Fix-AllIssues.ps1` or open BROWSER-FIX-GUIDE.md
