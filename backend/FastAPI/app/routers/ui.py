from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas import (
    UIDashboardResponse,
    UIChartItem,
    UIPaginatedStudents,
    UIInsightsResponse
)
from app.services.analytics import (
    fetch_ui_dashboard,
    fetch_ui_charts,
    fetch_ui_students,
    fetch_ui_insights
)

router = APIRouter(prefix="/ui", tags=["UI Components Data"])


@router.get("/dashboard", response_model=UIDashboardResponse)
def get_ui_dashboard(db: Session = Depends(get_db)):
    """
    Returns KPIs, GPA Data, and Gender Distribution formatted exactly
    for the DashboardPage.jsx React component.
    """
    return fetch_ui_dashboard(db)


@router.get("/charts", response_model=List[UIChartItem])
def get_ui_charts(db: Session = Depends(get_db)):
    """
    Returns a unified array of Major GPA and Attendance data formatted exactly
    for the ChartsPage.jsx React component.
    """
    return fetch_ui_charts(db)


@router.get("/students", response_model=UIPaginatedStudents)
def get_ui_students(
    page: int = Query(1, ge=1, description="Page number"),
    pageSize: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Returns paginated student data formatted exactly for the StudentTable.jsx
    React component (includes derived GPA and attendance string).
    """
    return fetch_ui_students(db, page=page, pageSize=pageSize)


@router.get("/insights", response_model=UIInsightsResponse)
def get_ui_insights(db: Session = Depends(get_db)):
    """
    Returns exact narrative string paragraphs formatted exactly for the
    AnalyticsPage.jsx React component.
    """
    return fetch_ui_insights(db)
