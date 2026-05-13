# *** Task / TaskState / Progress / Plan models ***

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class TaskGates(BaseModel):
    l1Approved: bool = False
    l2Approved: bool = False
    l3Approved: bool = False
    scenariosBuilt: bool = False
    codeWritten: bool = False
    qaPassed: bool = False
    pushRequested: bool = False
    pushApproved: bool = False


class TaskArtifacts(BaseModel):
    planL1Path: str = ""
    planL2Path: str = ""
    planL3Path: str = ""
    scenariosPath: str = ""
    codeChanges: List[Any] = Field(default_factory=list)
    qaReportPath: str = ""


class TaskTimestamps(BaseModel):
    created: Optional[str] = None
    updated: Optional[str] = None
    eachStateEntered: Dict[str, str] = Field(default_factory=dict)


class TaskState(BaseModel):
    taskId: str
    title: str = ""
    currentState: str = "received"
    history: List[Dict[str, Any]] = Field(default_factory=list)
    gates: TaskGates = Field(default_factory=TaskGates)
    artifacts: TaskArtifacts = Field(default_factory=TaskArtifacts)
    timestamps: TaskTimestamps = Field(default_factory=TaskTimestamps)
    blockers: List[Any] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)


class ProgressSnapshot(BaseModel):
    taskId: str
    label: str = ""
    percent: float = 0
    step: str = ""
    totalSteps: int = 0
    etaSeconds: Optional[float] = None
    updatedAt: Optional[str] = None


class PlanLayer(BaseModel):
    taskId: str
    layer: str  # *** "L1" | "L2" | "L3" ***
    path: str
    content: str = ""


class Task(BaseModel):
    taskId: str
    title: str = ""
    currentState: str = "received"
    progressPercent: float = 0
    progressLabel: str = ""
    cardPath: Optional[str] = None
