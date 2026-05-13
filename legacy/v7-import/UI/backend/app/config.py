# *** Settings via pydantic-settings; env-driven, .env supported ***

from pathlib import Path
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    brain_root: Path = Field(default=Path(r"C:\falcon\Brain"))
    brain_ui_port: int = Field(default=8000)
    brain_ui_token: Optional[str] = Field(default=None)
    brain_ui_admin_token: Optional[str] = Field(default=None)
    kokoro_base_url: str = Field(default="http://localhost:8880/v1")
    brain_memory_dir: Path = Field(
        default=Path(r"C:\Users\Pc5\.claude\projects\C--falcon\memory")
    )
    # *** Audit log location: defaults to backend/audit.log; override via BRAIN_UI_AUDIT_LOG ***
    brain_ui_audit_log: Optional[Path] = Field(default=None)

    @property
    def state_dir(self) -> Path:
        return self.brain_root / "state"

    @property
    def analysis_dir(self) -> Path:
        return self.brain_root / "analysis"

    @property
    def jobs_dir(self) -> Path:
        return self.brain_root / "jobs"

    @property
    def scripts_dir(self) -> Path:
        return self.brain_root / "scripts"

    @property
    def settings_dir(self) -> Path:
        return self.brain_root / "settings"

    @property
    def sound_dir(self) -> Path:
        return self.settings_dir / "sound"

    @property
    def voice_samples_dir(self) -> Path:
        return self.sound_dir / "voice-samples"

    @property
    def alerts_dir(self) -> Path:
        return self.voice_samples_dir / "alerts"

    @property
    def announcer_dir(self) -> Path:
        return self.voice_samples_dir / "announcer"

    @property
    def reports_dir(self) -> Path:
        return self.brain_root / "analysis" / "tables"

    @property
    def keys_env(self) -> Path:
        return self.scripts_dir / "keys.env"

    @property
    def brain_skills_root(self) -> Path:
        return self.brain_root.parent / "brain-skills"

    @property
    def assets_dir(self) -> Path:
        return self.brain_root / "assets"

    @property
    def schemas_dir(self) -> Path:
        return self.analysis_dir / "schemas"

    @property
    def memory_dir(self) -> Path:
        return self.brain_memory_dir


_settings: Optional[Settings] = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
