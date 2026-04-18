# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-31

### ✨ Added
- **Last Week Support**: Added `last_week` time range option for querying plans and generating reports
- **Enhanced Time Range Filtering**: Support for week, last_week, month, and all time ranges
- **Comprehensive Plan Management**: 9 powerful tools for complete plan lifecycle management
  - `create_plan_draft` - Create plan drafts with AI assistance
  - `confirm_plan` - Confirm and save plans
  - `update_plan` - Modify plan information
  - `list_plans` - List plans with filters
  - `get_plan_detail` - Get detailed plan information
  - `update_task_status` - Update task status
  - `generate_execution_report` - Generate execution reports
  - `get_plan_reminders` - Get plan reminders
  - `get_today_focus` - Get today's focus tasks

### 🐛 Fixed
- **Last Week Calculation Bug**: Fixed incorrect time range calculation for last week queries
- **Monday/Sunday Boundary Handling**: Improved week boundary detection logic

### 📝 Documentation
- Complete Chinese README with detailed installation guide
- English README for international users
- Comprehensive installation guide (INSTALLATION.md)
- Contributing guidelines
- MIT License

### 🔧 Technical
- TypeScript ES Module support
- Node.js >= 18 compatibility
- @sinclair/typebox for parameter validation
- RESTful API client integration

---

## [1.0.3] - 2026-04-18

### Fixed
- Documented OpenClaw `plugins.entries` / `openclaw.json` correctly; removed obsolete `plugins: []` + `path` examples that caused gateway validation errors.

### Added
- `loadConfig`: accept legacy `apiBaseUrl` as alias for `apiBase`.

### Changed
- `scripts/create-clawhub-zip.mjs`: zip output name `lingcloud-ai-plan-manager-<version>-clawhub.zip` (from plugin id), safe on Windows.

## [Unreleased]

### Planned Features
- [ ] Plugin configuration UI
- [ ] Offline mode support
- [ ] Advanced analytics dashboard
- [ ] Export/Import functionality
- [ ] Multi-language support (Spanish, French, German)

---

## Release Notes

### How to Update

**Via OpenClaw Chat:**
```
Update lingcloud-ai-plan-manager plugin
```

**Manual Update:**
```bash
cd lingcloud-ai-plan-manager
git pull
npm install
npm run build
```

---

## Version History

| Version | Release Date | Description |
|---------|-------------|-------------|
| 1.0.0   | 2026-03-31  | Initial release with full feature set |

---

For more details, visit the [GitHub repository](https://github.com/feixuelingcloud/lingcloud-ai-plan-manager).
