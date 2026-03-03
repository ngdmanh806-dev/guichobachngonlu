from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repository.analytics_repo import (
	get_admission_by_major,
	get_admitted_students_exam_scores,
	get_admitted_students_scores,
	get_demographics_by_province,
	get_view_admission_data,
	get_data_quality_stats,
)
from app.schemas import DashboardAnalyticsResponse
from app.services.analytics import (
	analyze_score_distribution,
	build_thpt_subject_analysis_chart,
	calculate_summary,
	format_score_distribution_chart,
	map_major_items,
	map_province_items,
)
from app.services.visualization import (
	format_major_admission_chart,
	format_province_pie_chart,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
def get_dashboard_analytics(year: int = 2024, db: Session = Depends(get_db)):
	try:
		df_view = get_view_admission_data(db)
		df_major = get_admission_by_major(db, year)
		df_province = get_demographics_by_province(db, year)

		summary = calculate_summary(df_view)
		score_distribution = analyze_score_distribution(df_view)

		response = DashboardAnalyticsResponse(
			year=year,
			summary=summary,
			charts={
				"admission_by_major": format_major_admission_chart(df_major),
				"demographics_by_province": format_province_pie_chart(df_province),
				"score_distribution": format_score_distribution_chart(score_distribution),
				"thpt_subject_analysis": build_thpt_subject_analysis_chart(df_view),
			},
			top_majors=map_major_items(df_major),
			top_provinces=map_province_items(df_province),
		)
		return response
	except Exception as exc:
		raise HTTPException(
			status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
			detail=f"Không thể lấy dữ liệu analytics: {str(exc)}",
		) from exc


@router.get("/summary")
def get_summary_analytics(year: int = 2024, db: Session = Depends(get_db)):
	try:
		df_view = get_view_admission_data(db)
		return calculate_summary(df_view)
	except Exception as exc:
		raise HTTPException(
			status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
			detail=f"Không thể lấy summary analytics: {str(exc)}",
		) from exc


@router.get("/charts")
def get_chart_analytics(year: int = 2024, db: Session = Depends(get_db)):
	try:
		df_view = get_view_admission_data(db)
		df_major = get_admission_by_major(db, year)
		df_province = get_demographics_by_province(db, year)
		score_distribution = analyze_score_distribution(df_view)

		return {
			"year": year,
			"admission_by_major": format_major_admission_chart(df_major),
			"demographics_by_province": format_province_pie_chart(df_province),
			"score_distribution": format_score_distribution_chart(score_distribution),
			"thpt_subject_analysis": build_thpt_subject_analysis_chart(df_view),
		}
	except Exception as exc:
		raise HTTPException(
			status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
			detail=f"Không thể lấy chart analytics: {str(exc)}",
		) from exc
